/**
 * Lanyard API Integration (WebSocket + REST Fallback)
 * Real-time Discord presence & Spotify live stream card
 */

(function () {
  'use strict';

  // Configurable Discord User ID
  // Can be overridden via window.DISCORD_USER_ID or data-discord-id attribute on <body>
  const defaultUserId = '856833249770209320';
  const DISCORD_USER_ID = window.DISCORD_USER_ID || 
    document.body.getAttribute('data-discord-id') || 
    defaultUserId;

  const LANYARD_WS_URL = 'wss://api.lanyard.rest/socket';
  const LANYARD_REST_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

  let socket = null;
  let heartbeatInterval = null;
  let reconnectTimeout = null;
  let spotifyInterval = null;
  let currentSpotifyData = null;

  // DOM Elements
  const statusRing = document.getElementById('discord-status-ring');
  const avatarImg = document.getElementById('discord-avatar');
  const usernameText = document.getElementById('discord-username-display');
  const bioDiscordHandle = document.getElementById('bio-discord-handle');
  
  // Spotify elements
  const spotifyCardActive = document.getElementById('spotify-card-active');
  const spotifyCardInactive = document.getElementById('spotify-card-inactive');
  const spotifyCover = document.getElementById('spotify-cover');
  const spotifyTitle = document.getElementById('spotify-title');
  const spotifyArtist = document.getElementById('spotify-artist');
  const spotifyProgressBar = document.getElementById('spotify-progress-bar');
  const spotifyCurrentTime = document.getElementById('spotify-current-time');
  const spotifyTotalTime = document.getElementById('spotify-total-time');

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updatePresenceUI(data) {
    if (!data) return;

    // 1. Update Status Ring
    const status = data.discord_status || 'offline';
    if (statusRing) {
      statusRing.className = 'status-indicator';
      statusRing.classList.add(`status-${status}`);
      statusRing.setAttribute('title', `Status: ${status.toUpperCase()}`);
    }

    // 2. Update Avatar if available
    if (avatarImg && data.discord_user) {
      const user = data.discord_user;
      if (user.avatar) {
        const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
        avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
      }
      
      avatarImg.onerror = () => {
        avatarImg.src = 'assets/avatar.jpg';
      };
      
      // Update clean handle without numerical ID
      const cleanUsername = user.global_name || user.username || 'SIMIIUS';
      if (usernameText) {
        usernameText.textContent = cleanUsername;
      }
      if (bioDiscordHandle) {
        bioDiscordHandle.textContent = `@${user.username || 'simiius'}`;
      }
    }

    // 3. Update Spotify Stream Card
    if (data.spotify) {
      currentSpotifyData = data.spotify;
      if (spotifyCardActive) spotifyCardActive.classList.remove('hidden');
      if (spotifyCardInactive) spotifyCardInactive.classList.add('hidden');

      if (spotifyCover) spotifyCover.src = data.spotify.album_art_url || 'assets/cover1.jpg';
      if (spotifyTitle) spotifyTitle.textContent = data.spotify.song || 'Unknown Song';
      if (spotifyArtist) spotifyArtist.textContent = data.spotify.artist || 'Unknown Artist';

      startSpotifyTimer();
    } else {
      currentSpotifyData = null;
      stopSpotifyTimer();
      if (spotifyCardActive) spotifyCardActive.classList.add('hidden');
      if (spotifyCardInactive) {
        spotifyCardInactive.classList.remove('hidden');
        // Check if there is another rich presence activity (e.g. Code or Game)
        const activity = (data.activities || []).find(a => a.type === 0);
        const inactiveSub = document.getElementById('spotify-inactive-subtext');
        if (inactiveSub) {
          if (activity) {
            inactiveSub.textContent = `Playing ${activity.name}`;
          } else {
            inactiveSub.textContent = 'No activity / Offline';
          }
        }
      }
    }
  }

  function startSpotifyTimer() {
    stopSpotifyTimer();
    updateSpotifyProgress();
    spotifyInterval = setInterval(updateSpotifyProgress, 500);
  }

  function stopSpotifyTimer() {
    if (spotifyInterval) {
      clearInterval(spotifyInterval);
      spotifyInterval = null;
    }
  }

  function updateSpotifyProgress() {
    if (!currentSpotifyData || !currentSpotifyData.timestamps) return;
    const { start, end } = currentSpotifyData.timestamps;
    const now = Date.now();
    const total = (end - start) / 1000;
    const current = Math.min(total, Math.max(0, (now - start) / 1000));
    const percent = Math.min(100, Math.max(0, (current / total) * 100));

    if (spotifyProgressBar) {
      spotifyProgressBar.style.width = `${percent}%`;
    }
    if (spotifyCurrentTime) {
      spotifyCurrentTime.textContent = formatTime(current);
    }
    if (spotifyTotalTime) {
      spotifyTotalTime.textContent = formatTime(total);
    }
  }

  // REST API Fallback
  async function fetchRestPresence() {
    try {
      const res = await fetch(LANYARD_REST_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        updatePresenceUI(json.data);
      }
    } catch (err) {
      // Graceful fallback to offline defaults
      updatePresenceUI({
        discord_status: 'offline',
        discord_user: {
          username: 'simiius',
          global_name: 'SIMIIUS'
        },
        spotify: null
      });
    }
  }

  // Lanyard WebSocket Client
  function connectWebSocket() {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      socket = new WebSocket(LANYARD_WS_URL);

      socket.onopen = () => {
        // Connected, waiting for Opcode 1 (Hello)
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { op, d, t } = message;

          switch (op) {
            case 1: // Hello -> initialize heartbeat and subscribe
              const interval = d.heartbeat_interval;
              if (heartbeatInterval) clearInterval(heartbeatInterval);
              heartbeatInterval = setInterval(() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(JSON.stringify({ op: 3 }));
                }
              }, interval);

              // Subscribe to user
              socket.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: DISCORD_USER_ID }
              }));
              break;

            case 0: // Event Dispatch (INIT_STATE or PRESENCE_UPDATE)
              if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
                updatePresenceUI(d);
              }
              break;

            default:
              break;
          }
        } catch (e) {
          console.warn('Lanyard message parse error:', e);
        }
      };

      socket.onerror = (err) => {
        console.warn('Lanyard socket error, falling back to REST:', err);
        fetchRestPresence();
      };

      socket.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        // Attempt reconnect after 5s
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };
    } catch (e) {
      fetchRestPresence();
    }
  }

  // Initialize
  window.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    // Also initial REST fetch for instant display
    fetchRestPresence();
  });
})();

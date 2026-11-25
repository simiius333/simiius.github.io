/**
 * Lanyard API Integration (WebSocket + Active REST Polling Fallback)
 * Real-time Discord presence, Avatar synchronization & Spotify live card
 */

(function () {
  'use strict';

  // Configurable Discord User ID
  const defaultUserId = '856833249770209320';
  const DISCORD_USER_ID = window.DISCORD_USER_ID || 
    (document.body && document.body.getAttribute('data-discord-id')) || 
    defaultUserId;

  const LANYARD_WS_URL = 'wss://api.lanyard.rest/socket';
  const LANYARD_REST_BASE = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

  let socket = null;
  let heartbeatInterval = null;
  let reconnectTimeout = null;
  let restPollInterval = null;
  let spotifyInterval = null;
  let currentSpotifyData = null;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function getElements() {
    return {
      statusDot: document.getElementById('discord-status-dot') || document.getElementById('discord-status-ring'),
      avatarImg: document.getElementById('discord-avatar'),
      usernameText: document.getElementById('discord-username-display'),
      bioDiscordHandle: document.getElementById('bio-discord-handle'),
      spotifyCardActive: document.getElementById('spotify-card-active'),
      spotifyCardInactive: document.getElementById('spotify-card-inactive'),
      spotifyCover: document.getElementById('spotify-cover'),
      spotifyTrack: document.getElementById('spotify-track') || document.getElementById('spotify-title'),
      spotifyArtist: document.getElementById('spotify-artist'),
      spotifyProgress: document.getElementById('spotify-progress') || document.getElementById('spotify-progress-bar'),
      spotifyCurrentTime: document.getElementById('spotify-current-time'),
      spotifyTotalTime: document.getElementById('spotify-total-time'),
      discordActivityDesc: document.getElementById('discord-activity-desc') || document.getElementById('spotify-inactive-subtext'),
      discordActivityDot: document.getElementById('discord-activity-dot')
    };
  }

  function updatePresenceUI(data) {
    if (!data) return;
    const els = getElements();

    // 1. Update Status Indicator on Avatar
    const status = data.discord_status || 'offline';
    if (els.statusDot) {
      els.statusDot.className = 'status-indicator';
      els.statusDot.classList.add(`status-${status}`);
      els.statusDot.setAttribute('title', `Discord: ${status.toUpperCase()}`);
      els.statusDot.setAttribute('aria-label', `Discord: ${status.toUpperCase()}`);
    }

    // 2. Update Avatar and Usernames
    if (data.discord_user) {
      const user = data.discord_user;
      if (els.avatarImg && user.avatar) {
        const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
        const targetSrc = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
        if (els.avatarImg.src !== targetSrc) {
          els.avatarImg.src = targetSrc;
        }
        els.avatarImg.onerror = () => {
          els.avatarImg.src = 'assets/avatar.jpg';
        };
      }

      const cleanUsername = user.global_name || user.username || 'SIMIIUS';
      if (els.usernameText) {
        els.usernameText.textContent = cleanUsername;
      }
      if (els.bioDiscordHandle) {
        els.bioDiscordHandle.textContent = `@${user.username || 'simiius'}`;
      }
    }

    // 3. Update Spotify Live Playing or Discord Activities
    if (data.listening_to_spotify && data.spotify) {
      currentSpotifyData = data.spotify;
      if (els.spotifyCardActive) els.spotifyCardActive.classList.remove('hidden');
      if (els.spotifyCardInactive) els.spotifyCardInactive.classList.add('hidden');

      if (els.spotifyCover) {
        els.spotifyCover.src = data.spotify.album_art_url || 'assets/cover1.jpg';
      }
      if (els.spotifyTrack) {
        els.spotifyTrack.textContent = data.spotify.song || 'Unknown Track';
      }
      if (els.spotifyArtist) {
        els.spotifyArtist.textContent = data.spotify.artist || 'Unknown Artist';
      }

      startSpotifyTimer();
    } else {
      currentSpotifyData = null;
      stopSpotifyTimer();
      if (els.spotifyCardActive) els.spotifyCardActive.classList.add('hidden');
      if (els.spotifyCardInactive) {
        els.spotifyCardInactive.classList.remove('hidden');
        
        // Find custom or game activity
        const activities = data.activities || [];
        const game = activities.find(a => a.type === 0);
        const streaming = activities.find(a => a.type === 1);
        const custom = activities.find(a => a.type === 4);

        if (els.discordActivityDesc) {
          if (streaming) {
            els.discordActivityDesc.textContent = `Streaming ${streaming.name}`;
          } else if (game) {
            els.discordActivityDesc.textContent = `Playing ${game.name}`;
          } else if (custom && custom.state) {
            els.discordActivityDesc.textContent = custom.state;
          } else if (status === 'online') {
            els.discordActivityDesc.textContent = 'Active on Discord';
          } else if (status === 'idle') {
            els.discordActivityDesc.textContent = 'Away on Discord';
          } else if (status === 'dnd') {
            els.discordActivityDesc.textContent = 'Do Not Disturb';
          } else {
            els.discordActivityDesc.textContent = 'No activity / Offline';
          }
        }

        if (els.discordActivityDot) {
          if (status === 'online') {
            els.discordActivityDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
          } else if (status === 'idle') {
            els.discordActivityDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
          } else if (status === 'dnd') {
            els.discordActivityDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
          } else {
            els.discordActivityDot.className = 'w-2.5 h-2.5 rounded-full bg-slate-600';
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
    const els = getElements();
    const { start, end } = currentSpotifyData.timestamps;
    const now = Date.now();
    const total = Math.max(1, (end - start) / 1000);
    const current = Math.min(total, Math.max(0, (now - start) / 1000));
    const percent = Math.min(100, Math.max(0, (current / total) * 100));

    if (els.spotifyProgress) {
      els.spotifyProgress.style.width = `${percent.toFixed(1)}%`;
    }
    if (els.spotifyCurrentTime) {
      els.spotifyCurrentTime.textContent = formatTime(current);
    }
    if (els.spotifyTotalTime) {
      els.spotifyTotalTime.textContent = formatTime(total);
    }
  }

  // Active REST API Fetcher
  async function fetchRestPresence() {
    try {
      const timestamp = Date.now();
      const res = await fetch(`${LANYARD_REST_BASE}?_=${timestamp}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        updatePresenceUI(json.data);
      }
    } catch (err) {
      console.warn('Lanyard REST poll notice:', err.message);
    }
  }

  // Lanyard WebSocket Connection
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
          console.warn('Lanyard parse error:', e);
        }
      };

      socket.onerror = () => {
        // Fallback handled by periodic REST poll
      };

      socket.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };
    } catch (e) {
      // Socket creation failed; REST polling continues
    }
  }

  function init() {
    // 1. Immediate REST presence fetch
    fetchRestPresence();
    // 2. Establish live WebSocket
    connectWebSocket();
    // 3. Fallback recurring REST poll every 6s for continuous live sync
    if (!restPollInterval) {
      restPollInterval = setInterval(fetchRestPresence, 6000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

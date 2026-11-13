// Lanyard Real-time Spotify & Discord Presence Controller
(function () {
  const DISCORD_USER_ID = '856833249770209320';
  const REST_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
  const WS_URL = 'wss://api.lanyard.rest/socket';

  // Elements
  const avatarEl = document.getElementById('user-avatar');
  const statusDotEl = document.getElementById('user-status-dot');
  const statusTextEl = document.getElementById('user-status-text');

  // Spotify Elements
  const spotifyCard = document.getElementById('spotify-card');
  const spotifyPlayingView = document.getElementById('spotify-playing-view');
  const spotifyIdleView = document.getElementById('spotify-idle-view');
  const albumArtEl = document.getElementById('spotify-album-art');
  const vinylArtEl = document.getElementById('spotify-vinyl-art');
  const trackTitleEl = document.getElementById('spotify-track-title');
  const trackArtistEl = document.getElementById('spotify-track-artist');
  const trackAlbumEl = document.getElementById('spotify-track-album');
  const progressBarEl = document.getElementById('spotify-progress-bar');
  const progressScrubberEl = document.getElementById('spotify-progress-scrubber');
  const timeCurrentEl = document.getElementById('spotify-time-current');
  const timeTotalEl = document.getElementById('spotify-time-total');
  const listenAlongBtn = document.getElementById('spotify-listen-along-btn');
  const embedContainer = document.getElementById('spotify-embed-container');
  const embedIframe = document.getElementById('spotify-embed-iframe');
  const toggleEmbedBtn = document.getElementById('toggle-embed-btn');

  let currentSpotifyData = null;
  let progressRaf = null;
  let ws = null;
  let heartbeatInterval = null;

  // Format milliseconds to MM:SS
  function formatTime(ms) {
    if (isNaN(ms) || ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Smooth Scrubber Animation loop
  function updatePlaybackProgress() {
    if (!currentSpotifyData || !currentSpotifyData.timestamps) {
      if (progressRaf) cancelAnimationFrame(progressRaf);
      return;
    }

    const start = currentSpotifyData.timestamps.start;
    const end = currentSpotifyData.timestamps.end;
    const total = end - start;
    const now = Date.now();
    const elapsed = Math.min(Math.max(now - start, 0), total);

    const progressPct = total > 0 ? (elapsed / total) * 100 : 0;

    if (progressBarEl) progressBarEl.style.width = `${progressPct.toFixed(2)}%`;
    if (progressScrubberEl) progressScrubberEl.style.left = `${progressPct.toFixed(2)}%`;
    if (timeCurrentEl) timeCurrentEl.textContent = formatTime(elapsed);
    if (timeTotalEl) timeTotalEl.textContent = formatTime(total);

    if (elapsed < total) {
      progressRaf = requestAnimationFrame(updatePlaybackProgress);
    } else {
      // Song finished, re-fetch status in a moment
      setTimeout(fetchRestStatus, 2000);
    }
  }

  // Handle presence update
  function applyPresence(data) {
    if (!data) return;

    // 1. Update Profile Avatar & Status
    if (data.discord_user && data.discord_user.avatar && avatarEl) {
      const avatarHash = data.discord_user.avatar;
      const isGif = avatarHash.startsWith('a_');
      avatarEl.src = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.${isGif ? 'gif' : 'png'}?size=256`;
    }

    if (data.discord_status && statusDotEl && statusTextEl) {
      const status = data.discord_status;
      statusDotEl.className = 'w-3 h-3 rounded-full border-2 border-white';
      if (status === 'online') {
        statusDotEl.classList.add('bg-emerald-500', 'shadow-[0_0_10px_rgba(16,185,129,0.8)]');
        statusTextEl.textContent = 'Online in Discord';
      } else if (status === 'idle') {
        statusDotEl.classList.add('bg-amber-400');
        statusTextEl.textContent = 'Away / Idle';
      } else if (status === 'dnd') {
        statusDotEl.classList.add('bg-rose-500');
        statusTextEl.textContent = 'Do Not Disturb';
      } else {
        statusDotEl.classList.add('bg-slate-300');
        statusTextEl.textContent = 'Offline';
      }
    }

    // 2. Handle Spotify Playback
    if (data.listening_to_spotify && data.spotify) {
      currentSpotifyData = data.spotify;

      if (spotifyPlayingView) spotifyPlayingView.classList.remove('hidden');
      if (spotifyIdleView) spotifyIdleView.classList.add('hidden');

      if (albumArtEl) albumArtEl.src = data.spotify.album_art_url || '';
      if (vinylArtEl) vinylArtEl.src = data.spotify.album_art_url || '';
      if (trackTitleEl) trackTitleEl.textContent = data.spotify.song || 'Unknown Track';
      if (trackArtistEl) trackArtistEl.textContent = data.spotify.artist || 'Unknown Artist';
      if (trackAlbumEl) trackAlbumEl.textContent = data.spotify.album || '';

      const trackUrl = `https://open.spotify.com/track/${data.spotify.track_id}`;
      if (listenAlongBtn) {
        listenAlongBtn.href = trackUrl;
        listenAlongBtn.title = `Listen along: ${data.spotify.song} by ${data.spotify.artist}`;
      }

      // Update embed player URL if open
      if (embedIframe && embedIframe.src.indexOf(data.spotify.track_id) === -1) {
        embedIframe.dataset.trackId = data.spotify.track_id;
        if (!embedContainer.classList.contains('hidden')) {
          embedIframe.src = `https://open.spotify.com/embed/track/${data.spotify.track_id}?utm_source=generator&theme=0`;
        }
      }

      if (progressRaf) cancelAnimationFrame(progressRaf);
      progressRaf = requestAnimationFrame(updatePlaybackProgress);
    } else {
      currentSpotifyData = null;
      if (progressRaf) cancelAnimationFrame(progressRaf);

      if (spotifyPlayingView) spotifyPlayingView.classList.add('hidden');
      if (spotifyIdleView) spotifyIdleView.classList.remove('hidden');
      if (embedContainer) embedContainer.classList.add('hidden');
    }
  }

  // REST Fallback / Initial load
  async function fetchRestStatus() {
    try {
      const res = await fetch(REST_URL);
      const json = await res.json();
      if (json.success && json.data) {
        applyPresence(json.data);
      }
    } catch (err) {
      console.warn('Lanyard REST error:', err);
    }
  }

  // WebSocket for Real-time push
  function initWebSocket() {
    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        // Opcode 2: Initialize / Subscribe
        ws.send(JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: DISCORD_USER_ID
          }
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { op, t, d } = message;

          if (op === 1) {
            // Hello opcode: set heartbeat
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            heartbeatInterval = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, d.heartbeat_interval);
          } else if (op === 0) {
            // Event opcode
            if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
              applyPresence(d);
            }
          }
        } catch (e) {
          console.error('Lanyard WS parse error:', e);
        }
      };

      ws.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        // Attempt reconnect after 5s
        setTimeout(initWebSocket, 5000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      console.warn('Lanyard WS not available, falling back to polling:', e);
      setInterval(fetchRestStatus, 10000);
    }
  }

  // Interactive Spotify Embed Player Toggle
  if (toggleEmbedBtn && embedContainer && embedIframe) {
    toggleEmbedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = embedContainer.classList.contains('hidden');
      if (isHidden) {
        const trackId = currentSpotifyData?.track_id || embedIframe.dataset.trackId;
        if (trackId) {
          embedIframe.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
        }
        embedContainer.classList.remove('hidden');
        toggleEmbedBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          <span>Hide Player</span>
        `;
      } else {
        embedContainer.classList.add('hidden');
        toggleEmbedBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
          <span>Mini Player</span>
        `;
      }
    });
  }

  // Interactive 3D Card Glare Mouse Effect
  document.querySelectorAll('.liquid-glass').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // Run initial fetch and WS
  fetchRestStatus();
  initWebSocket();
})();

// Audio Player, Video Loop & Typewriter Controller
(function () {
  // 1. Playlists Configuration
  const playlist = [
    {
      title: "Tek It (I Watch the Moon)",
      artist: "Cafuné",
      src: "assets/track1.mp3",
      cover: "assets/cover1.jpg"
    },
    {
      title: "Royalty",
      artist: "Egzod, Maestro Chives",
      src: "assets/track2.mp3",
      cover: "assets/cover2.jpg"
    }
  ];

  let currentTrackIdx = 0;
  const audio = new Audio();
  audio.preload = "auto";
  let isPlaying = false;
  let isMuted = false;

  // DOM Elements
  const enterOverlay = document.getElementById('enter-overlay');
  const video1 = document.getElementById('bg-video-1');
  const video2 = document.getElementById('bg-video-2');

  const playerCover = document.getElementById('player-cover');
  const playerTitle = document.getElementById('player-title');
  const playerArtist = document.getElementById('player-artist');
  const playPauseBtn = document.getElementById('player-play-btn');
  const prevBtn = document.getElementById('player-prev-btn');
  const nextBtn = document.getElementById('player-next-btn');
  const progressBar = document.getElementById('player-progress');
  const timeCurrent = document.getElementById('player-time-current');
  const timeTotal = document.getElementById('player-time-total');
  const audioBars = document.getElementById('player-audio-bars');
  const volumeToggleBtn = document.getElementById('top-volume-btn');

  // Format MM:SS
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Load Track
  function loadTrack(index) {
    currentTrackIdx = (index + playlist.length) % playlist.length;
    const track = playlist[currentTrackIdx];
    audio.src = track.src;
    if (playerTitle) playerTitle.textContent = track.title;
    if (playerArtist) playerArtist.textContent = track.artist;
    if (playerCover) playerCover.src = track.cover;
    if (progressBar) progressBar.value = 0;
    if (timeCurrent) timeCurrent.textContent = "0:00";
  }

  function playTrack() {
    audio.play().then(() => {
      isPlaying = true;
      updatePlayBtnState();
      if (audioBars) audioBars.classList.remove('audio-bar-paused');
    }).catch(e => console.log('Autoplay prevented:', e));
  }

  function pauseTrack() {
    audio.pause();
    isPlaying = false;
    updatePlayBtnState();
    if (audioBars) audioBars.classList.add('audio-bar-paused');
  }

  function updatePlayBtnState() {
    if (!playPauseBtn) return;
    playPauseBtn.innerHTML = isPlaying
      ? `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  }

  // Audio Events
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    if (progressBar) progressBar.value = pct;
    if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    // Auto next track
    loadTrack(currentTrackIdx + 1);
    playTrack();
  });

  // Controls
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) pauseTrack();
      else playTrack();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      loadTrack(currentTrackIdx - 1);
      playTrack();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      loadTrack(currentTrackIdx + 1);
      playTrack();
    });
  }

  if (progressBar) {
    progressBar.addEventListener('input', () => {
      if (!audio.duration) return;
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
  }

  // Master Volume Toggle
  if (volumeToggleBtn) {
    volumeToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      audio.muted = isMuted;
      volumeToggleBtn.innerHTML = isMuted
        ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>`
        : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>`;
    });
  }

  // 2. Continuous Background Video Looper
  function initVideoLoop() {
    if (!video1 || !video2) return;

    video1.addEventListener('ended', () => {
      video2.currentTime = 0;
      video2.play().then(() => {
        video2.classList.add('active-video');
        video1.classList.remove('active-video');
      }).catch(e => console.log('Video 2 play err:', e));
    });

    video2.addEventListener('ended', () => {
      video1.currentTime = 0;
      video1.play().then(() => {
        video1.classList.add('active-video');
        video2.classList.remove('active-video');
      }).catch(e => console.log('Video 1 play err:', e));
    });
  }

  // 3. Click to Enter
  if (enterOverlay) {
    enterOverlay.addEventListener('click', () => {
      enterOverlay.classList.add('hidden-overlay');
      // Start Video
      if (video1) {
        video1.play().catch(e => console.log('Video play err:', e));
        video1.classList.add('active-video');
      }
      // Start Music
      loadTrack(0);
      playTrack();
    });
  }

  // 4. Typewriter with selection & deletion
  const typewriterTextEl = document.getElementById('typewriter-text');
  const phrases = [
    "DEVELOPER ✦ EDIT",
    "MUSIC ENTHUSIAST ✦ VIBE",
    "DIGITAL CREATOR ✦ SIMIIUS"
  ];
  let phraseIdx = 0;

  function typePhrase() {
    if (!typewriterTextEl) return;
    const currentPhrase = phrases[phraseIdx];
    let charIdx = 0;
    typewriterTextEl.textContent = "";
    typewriterTextEl.classList.remove('selecting');

    const typeInterval = setInterval(() => {
      if (charIdx < currentPhrase.length) {
        typewriterTextEl.textContent += currentPhrase.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typeInterval);
        // Pause, then select all text
        setTimeout(() => {
          typewriterTextEl.classList.add('selecting');
          // Hold selection briefly, then wipe and move to next phrase
          setTimeout(() => {
            typewriterTextEl.textContent = "";
            typewriterTextEl.classList.remove('selecting');
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(typePhrase, 300);
          }, 450);
        }, 2200);
      }
    }, 75);
  }

  // 5. Bio Accordion
  const bioToggleBtn = document.getElementById('bio-toggle-btn');
  const bioContent = document.getElementById('bio-content');
  const bioChevron = document.getElementById('bio-chevron');

  if (bioToggleBtn && bioContent) {
    bioToggleBtn.addEventListener('click', () => {
      const isClosed = bioContent.classList.contains('hidden');
      if (isClosed) {
        bioContent.classList.remove('hidden');
        if (bioChevron) bioChevron.style.transform = 'rotate(180deg)';
      } else {
        bioContent.classList.add('hidden');
        if (bioChevron) bioChevron.style.transform = 'rotate(0deg)';
      }
    });
  }

  // 6. View Counter
  const viewsEl = document.getElementById('views-counter');
  if (viewsEl) {
    let views = parseInt(localStorage.getItem('simiius_views') || '529', 10);
    views += 1;
    localStorage.setItem('simiius_views', views.toString());
    viewsEl.textContent = views;
  }

  // Init
  initVideoLoop();
  typePhrase();
  loadTrack(0);
})();

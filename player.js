// Audio Player, Video Loop, Asset Preloader & Typewriter Controller
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
  let currentVolume = 0.8;
  audio.volume = currentVolume;

  // DOM Elements
  const loaderOverlay = document.getElementById('loader-overlay');
  const loaderBar = document.getElementById('loader-progress-bar');
  const loaderPercent = document.getElementById('loader-percentage');
  const loaderStatus = document.getElementById('loader-status-text');

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
  const trackIndexEl = document.getElementById('player-track-index');

  // Player Volume Controls
  const playerVolSlider = document.getElementById('player-volume-slider');
  const playerVolBtn = document.getElementById('player-volume-icon-btn');
  const playerVolSvg = document.getElementById('player-volume-svg');

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
    if (trackIndexEl) trackIndexEl.textContent = `${currentTrackIdx + 1} / ${playlist.length}`;
  }

  function playTrack() {
    audio.play().then(() => {
      isPlaying = true;
      updatePlayBtnState();
      if (audioBars) audioBars.classList.remove('audio-bar-paused');
    }).catch(e => {
      console.log('Autoplay policy caught, will play on next interaction:', e);
      // Fallback listener for first user interaction
      const playOnInteraction = () => {
        audio.play().then(() => {
          isPlaying = true;
          updatePlayBtnState();
          if (audioBars) audioBars.classList.remove('audio-bar-paused');
        }).catch(err => console.log(err));
        window.removeEventListener('click', playOnInteraction);
        window.removeEventListener('touchstart', playOnInteraction);
      };
      window.addEventListener('click', playOnInteraction, { once: true });
      window.addEventListener('touchstart', playOnInteraction, { once: true });
    });
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
      ? `<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg class="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  }

  // Update Volume Icon & States with Pure Bloom
  function updateVolumeUI(vol, muted) {
    const effectiveVol = muted ? 0 : vol;
    
    // Pure speaker SVG paths
    const muteSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>`;
    const lowVolSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;
    const highVolSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;

    const chosenSvg = effectiveVol === 0 ? muteSvg : (effectiveVol < 0.5 ? lowVolSvg : highVolSvg);

    if (playerVolSvg) playerVolSvg.innerHTML = chosenSvg;
    if (volumeToggleBtn) {
      volumeToggleBtn.innerHTML = `<svg class="w-5 h-5 bloom-icon text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">${chosenSvg}</svg>`;
    }
    if (playerVolSlider && !muted) {
      playerVolSlider.value = Math.round(vol * 100);
    }
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

  // Volume Slider in Player
  if (playerVolSlider) {
    playerVolSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100;
      currentVolume = val;
      audio.volume = currentVolume;
      isMuted = (currentVolume === 0);
      audio.muted = isMuted;
      updateVolumeUI(currentVolume, isMuted);
    });
  }

  // Volume Mute/Unmute Toggles
  function toggleMute() {
    isMuted = !isMuted;
    audio.muted = isMuted;
    if (!isMuted && audio.volume === 0) {
      audio.volume = 0.5;
      currentVolume = 0.5;
    }
    updateVolumeUI(currentVolume, isMuted);
  }

  if (playerVolBtn) playerVolBtn.addEventListener('click', toggleMute);
  if (volumeToggleBtn) volumeToggleBtn.addEventListener('click', toggleMute);

  // 2. Continuous Background Video Looper
  function initVideoLoop() {
    if (!video1 || !video2) return;

    video1.addEventListener('ended', () => {
      video2.currentTime = 0;
      video2.play().then(() => {
        video2.classList.add('active-video');
        video1.classList.remove('active-video');
      }).catch(e => console.log('Video 2 err:', e));
    });

    video2.addEventListener('ended', () => {
      video1.currentTime = 0;
      video1.play().then(() => {
        video1.classList.add('active-video');
        video2.classList.remove('active-video');
      }).catch(e => console.log('Video 1 err:', e));
    });
  }

  // 3. Preloader Progress System
  let progress = 0;
  let assetsReady = false;

  function updateLoader() {
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderPercent) loaderPercent.textContent = `${Math.floor(progress)}%`;

    if (progress < 40) {
      if (loaderStatus) loaderStatus.textContent = "Loading audio tracks...";
    } else if (progress < 80) {
      if (loaderStatus) loaderStatus.textContent = "Buffering video stream...";
    } else if (progress < 100) {
      if (loaderStatus) loaderStatus.textContent = "Finalizing experience...";
    } else {
      if (loaderStatus) loaderStatus.textContent = "Ready";
      setTimeout(finishLoading, 400);
      return;
    }

    // Step progress
    const step = assetsReady ? 4 : (progress < 85 ? 1.5 : 0.4);
    progress = Math.min(progress + step, 100);
    requestAnimationFrame(updateLoader);
  }

  function finishLoading() {
    if (!loaderOverlay) return;
    loaderOverlay.classList.add('hidden-loader');
    
    // Start Background Video
    if (video1) {
      video1.play().catch(e => console.log('Video autoplay err:', e));
      video1.classList.add('active-video');
    }

    // Start Audio
    playTrack();
  }

  // Preload Assets Listener
  function monitorAssets() {
    let loadedCount = 0;
    const totalAssets = 3;

    function onItemLoaded() {
      loadedCount++;
      if (loadedCount >= totalAssets) {
        assetsReady = true;
      }
    }

    if (video1) {
      if (video1.readyState >= 3) onItemLoaded();
      else video1.addEventListener('canplay', onItemLoaded, { once: true });
    } else onItemLoaded();

    if (video2) {
      if (video2.readyState >= 3) onItemLoaded();
      else video2.addEventListener('canplay', onItemLoaded, { once: true });
    } else onItemLoaded();

    audio.addEventListener('canplay', onItemLoaded, { once: true });

    // Fallback safety timeout (ensure loader completes in 3.5s max)
    setTimeout(() => {
      assetsReady = true;
    }, 3200);
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
        setTimeout(() => {
          typewriterTextEl.classList.add('selecting');
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

  // Initialization
  initVideoLoop();
  typePhrase();
  loadTrack(0);
  updateVolumeUI(currentVolume, false);
  monitorAssets();
  requestAnimationFrame(updateLoader);
})();

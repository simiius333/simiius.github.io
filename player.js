/**
 * SIMIIUS Cyberpunk Personal Bio - Player & Interactions Controller
 * Handles Preloader, Dual Video Looper, Typewriter with Blue Selection,
 * Custom Audio Player with Waveform Equalizer, Spicy Lyrics (Synced Karaoke),
 * and Live Visitor Counter.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. PLAYLIST & SYNCED LYRICS CONFIGURATION
     ========================================================================== */
  const playlist = [
    {
      title: 'Tek It',
      artist: 'Cafuné',
      src: 'assets/tek-it.mp3',
      cover: 'assets/cover1.jpg',
    },
    {
      title: 'Royalty (ft. Neoni)',
      artist: 'Egzod & Maestro Chives',
      src: 'assets/royalty.mp3',
      cover: 'assets/cover2.jpg',
    }
  ];

  const tekItLyrics = [
  {
    "time": 0.1,
    "text": "Where did you learn what it means to reciprocate?"
  },
  {
    "time": 6.29,
    "text": "And how much can I be expected to tolerate? Uh"
  },
  {
    "time": 12.41,
    "text": "So I started to think 'bout the plans I made"
  },
  {
    "time": 15.52,
    "text": "The debt unpaid"
  },
  {
    "time": 19.08,
    "text": "And you just can't call a spade a spade"
  },
  {
    "time": 24.23,
    "text": "♪"
  },
  {
    "time": 25.73,
    "text": "I watch the moon"
  },
  {
    "time": 30.61,
    "text": "Let it run my mood"
  },
  {
    "time": 33.78,
    "text": "Can't stop thinking of you"
  },
  {
    "time": 39.11,
    "text": "I watch you (Now I let it go)"
  },
  {
    "time": 43.3,
    "text": "(And I watch as things play out like)"
  },
  {
    "time": 47.38,
    "text": "So long, nice to know you, I'll be moving on"
  },
  {
    "time": 54.0,
    "text": "♪"
  },
  {
    "time": 54.6,
    "text": "We started off in such a nice place"
  },
  {
    "time": 58.82,
    "text": "We were talking the same language"
  },
  {
    "time": 62.9,
    "text": "I o-open and I'm closing"
  },
  {
    "time": 67.13,
    "text": "You can't stand the thought"
  },
  {
    "time": 69.91,
    "text": "Of a real beating heart"
  },
  {
    "time": 71.96,
    "text": "You'd be holding, having trouble"
  },
  {
    "time": 76.14,
    "text": "O-o-owning and admit that I am hoping"
  },
  {
    "time": 83.7,
    "text": "♪"
  },
  {
    "time": 84.5,
    "text": "I watch the moon"
  },
  {
    "time": 89.17,
    "text": "Let it run my mood"
  },
  {
    "time": 92.41,
    "text": "Can't stop thinking of you"
  },
  {
    "time": 97.66,
    "text": "I watch you (Now I let it go)"
  },
  {
    "time": 101.87,
    "text": "(And I watch as things play out like)"
  },
  {
    "time": 105.92,
    "text": "So long, nice to know you, I'll be moving on"
  },
  {
    "time": 112.5,
    "text": "Moving on"
  },
  {
    "time": 118.0,
    "text": "♪ Guitar Solo ♪"
  },
  {
    "time": 142.25,
    "text": "You"
  },
  {
    "time": 144.41,
    "text": "Yeah, I always know the truth"
  },
  {
    "time": 148.51,
    "text": "But I can't just say it to you"
  },
  {
    "time": 153.06,
    "text": "Yeah, I know the truth"
  },
  {
    "time": 158.72,
    "text": "I knew"
  },
  {
    "time": 160.87,
    "text": "Yeah, I always know the truth"
  },
  {
    "time": 164.86,
    "text": "But I can't just say it to you"
  },
  {
    "time": 169.46,
    "text": "Yeah, I know the truth"
  },
  {
    "time": 175.7,
    "text": "I never thought we'd see it through"
  },
  {
    "time": 178.7,
    "text": "I never could rely on you"
  },
  {
    "time": 181.8,
    "text": "And few times your face came into view"
  },
  {
    "time": 185.1,
    "text": "Into view, I'm not into you"
  },
  {
    "time": 188.0,
    "text": "Into you..."
  }
];

  const royaltyLyrics = [
  {
    "time": 0.0,
    "text": "♪ Instrumental Intro ♪"
  },
  {
    "time": 11.98,
    "text": "Say I'm cold-hearted"
  },
  {
    "time": 14.92,
    "text": "But I'm just gettin' started"
  },
  {
    "time": 17.92,
    "text": "Got my eyes on the target"
  },
  {
    "time": 20.94,
    "text": "Now, now"
  },
  {
    "time": 23.77,
    "text": "Oooh, oooh, oooh"
  },
  {
    "time": 26.54,
    "text": "'Til the battle's won"
  },
  {
    "time": 29.56,
    "text": "'Til kingdom come"
  },
  {
    "time": 32.4,
    "text": "Oooh, oooh, oooh"
  },
  {
    "time": 35.48,
    "text": "I'll never run"
  },
  {
    "time": 37.49,
    "text": "Best to give me your loyalty"
  },
  {
    "time": 41.34,
    "text": "'Cause I'm takin' the world, you'll see"
  },
  {
    "time": 44.2,
    "text": "They'll be callin' me, callin' me"
  },
  {
    "time": 47.45,
    "text": "They'll be callin' me royalty"
  },
  {
    "time": 49.88,
    "text": "Best to give me your loyalty"
  },
  {
    "time": 53.11,
    "text": "'Cause I'm takin' the world, you'll see"
  },
  {
    "time": 55.97,
    "text": "They'll be callin' me, callin' me"
  },
  {
    "time": 59.21,
    "text": "They'll be callin' me royalty"
  },
  {
    "time": 62.82,
    "text": "♪ Drop ♪ They'll be callin' me royalty"
  },
  {
    "time": 72.0,
    "text": "♪"
  },
  {
    "time": 73.79,
    "text": "They say I'm dangerous, 'cause I"
  },
  {
    "time": 76.89,
    "text": "Broke all the cages"
  },
  {
    "time": 79.78,
    "text": "No I, won't sit and take it"
  },
  {
    "time": 83.01,
    "text": "Now, now"
  },
  {
    "time": 85.7,
    "text": "They left me for dead, I guess they'll never learn"
  },
  {
    "time": 91.57,
    "text": "Every time I break there's just more pain to burn"
  },
  {
    "time": 96.19,
    "text": "They'll never, never, never learn"
  },
  {
    "time": 99.56,
    "text": "Oooh, oooh, oooh"
  },
  {
    "time": 102.5,
    "text": "'Til the battle's won"
  },
  {
    "time": 105.47,
    "text": "'Til kingdom come"
  },
  {
    "time": 108.33,
    "text": "Oooh, oooh, oooh"
  },
  {
    "time": 111.35,
    "text": "I'll never run"
  },
  {
    "time": 113.48,
    "text": "Best to give me your loyalty"
  },
  {
    "time": 117.3,
    "text": "'Cause I'm takin' the world, you'll see"
  },
  {
    "time": 120.12,
    "text": "They'll be callin' me, callin' me"
  },
  {
    "time": 123.44,
    "text": "They'll be callin' me royalty"
  }
];

  const lyricsData = [
    tekItLyrics,
    royaltyLyrics
  ];

  let currentTrackIndex = 0;
  let isAudioPlaying = false;
  let lastVolume = 0.8;

  // Audio element
  const audio = new Audio();
  audio.preload = 'auto';
  audio.volume = lastVolume;

  /* ==========================================================================
     2. DOM ELEMENTS
     ========================================================================== */
  // Preloader
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');
  const preloaderStatus = document.getElementById('preloader-status');

  // Background Videos
  const bgVideo1 = document.getElementById('bg-video-1');
  const bgVideo2 = document.getElementById('bg-video-2');

  // Top Floating Audio Button
  const topAudioBtn = document.getElementById('top-audio-btn');
  const topAudioIcon = document.getElementById('top-audio-icon');

  // Typewriter
  const typewriterText = document.getElementById('typewriter-text');

  // BIO Accordion
  const bioToggleBtn = document.getElementById('bio-accordion-toggle');
  const bioContent = document.getElementById('bio-accordion-content');
  const bioChevron = document.getElementById('bio-chevron');

  // Audio Player UI
  const playerCard = document.getElementById('audio-player-card');
  const trackCover = document.getElementById('player-cover');
  const trackTitle = document.getElementById('player-track-title');
  const trackArtist = document.getElementById('player-track-artist');
  const trackIndexDisplay = document.getElementById('player-track-index');
  const playPauseBtn = document.getElementById('player-play-btn');
  const playPauseIcon = document.getElementById('player-play-icon');
  const prevTrackBtn = document.getElementById('player-prev-btn');
  const nextTrackBtn = document.getElementById('player-next-btn');
  const scrubber = document.getElementById('player-scrubber');
  const currentTimeDisplay = document.getElementById('player-current-time');
  const totalDurationDisplay = document.getElementById('player-total-time');
  const volumeSlider = document.getElementById('player-volume-slider');
  const volumeMuteBtn = document.getElementById('player-volume-btn');
  const volumeIcon = document.getElementById('player-volume-icon');

  // Spicy Lyrics UI
  const lyricsWindow = document.getElementById('spicy-lyrics-window');
  const lyricsContainer = document.getElementById('spicy-lyrics-container');
  const lyricsSongTitle = document.getElementById('lyrics-song-title');
  const lyricsSyncBadge = document.getElementById('lyrics-sync-badge');
  const lyricsResyncBtn = document.getElementById('lyrics-resync-btn');
  const lyricsToggleBtn = document.getElementById('player-lyrics-toggle');

  // Visitor Counter
  const visitorCountDisplay = document.getElementById('visitor-count-display') || document.getElementById('visitor-count-value');

  /* ==========================================================================
     3. DYNAMIC ASSET PRELOADER (Tracks video & audio buffering + readiness)
     ========================================================================== */
  let simulatedProgress = 0;
  let assetsReady = false;

  function updatePreloader(val, statusText) {
    simulatedProgress = Math.min(100, Math.max(simulatedProgress, Math.round(val)));
    if (preloaderBar) preloaderBar.style.width = `${simulatedProgress}%`;
    if (preloaderPercent) preloaderPercent.textContent = `${simulatedProgress}%`;
    if (preloaderStatus && statusText) preloaderStatus.textContent = statusText;

    if (simulatedProgress >= 100 && !assetsReady) {
      assetsReady = true;
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('loaded');
          initPostLoad();
        }
      }, 350);
    }
  }

  // Set initial audio source
  audio.src = playlist[currentTrackIndex].src;
  updateTrackUI();

  // Progress simulation combined with real readiness events
  const preloadInterval = setInterval(() => {
    let targetProgress = 15;

    // Check DOM readiness
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      targetProgress += 25;
    }
    if (document.readyState === 'complete') {
      targetProgress += 15;
    }

    // Check Audio buffered
    if (audio.readyState >= 2) {
      targetProgress += 20;
    }

    // Check Video 1 buffered
    if (bgVideo1 && bgVideo1.readyState >= 2) {
      targetProgress += 15;
    }

    // Check Video 2 buffered
    if (bgVideo2 && bgVideo2.readyState >= 2) {
      targetProgress += 10;
    }

    // Incremental step
    if (simulatedProgress < targetProgress) {
      simulatedProgress += 4;
    } else if (simulatedProgress < 95) {
      simulatedProgress += 2;
    }

    let status = 'CONNECTING TO NEURAL MESH...';
    if (simulatedProgress > 30) status = 'BUFFERING AMBIENT VIDEO STREAMS...';
    if (simulatedProgress > 60) status = 'SYNCHRONIZING AUDIO CHANNELS...';
    if (simulatedProgress > 85) status = 'INITIALIZING INTERFACE...';
    if (simulatedProgress >= 100) status = 'SYSTEM ONLINE';

    updatePreloader(simulatedProgress, status);

    if (simulatedProgress >= 100) {
      clearInterval(preloadInterval);
    }
  }, 30);

  // Fallback safety timeout (maximum 2.2s loading)
  setTimeout(() => {
    clearInterval(preloadInterval);
    updatePreloader(100, 'SYSTEM ONLINE');
  }, 2200);

  /* ==========================================================================
     4. DUAL BACKGROUND VIDEO LOOPER (Seamless crossfade loop)
     ========================================================================== */
  let activeVideo = 1;
  let isCrossfading = false;

  function initVideoLooper() {
    if (!bgVideo1 || !bgVideo2) return;

    bgVideo1.muted = true;
    bgVideo1.volume = 0;
    bgVideo2.muted = true;
    bgVideo2.volume = 0;

    bgVideo1.setAttribute('muted', '');
    bgVideo1.setAttribute('loop', '');
    bgVideo1.setAttribute('playsinline', '');
    bgVideo1.setAttribute('webkit-playsinline', '');

    bgVideo2.setAttribute('muted', '');
    bgVideo2.setAttribute('loop', '');
    bgVideo2.setAttribute('playsinline', '');
    bgVideo2.setAttribute('webkit-playsinline', '');

    const playPromise1 = bgVideo1.play();
    if (playPromise1 !== undefined) {
      playPromise1.catch(() => {});
    }

    bgVideo1.addEventListener('timeupdate', () => {
      if (activeVideo === 1 && !isCrossfading && bgVideo1.duration) {
        if (bgVideo1.duration - bgVideo1.currentTime <= 1.2) {
          crossfadeToVideo(2);
        }
      }
    });

    bgVideo2.addEventListener('timeupdate', () => {
      if (activeVideo === 2 && !isCrossfading && bgVideo2.duration) {
        if (bgVideo2.duration - bgVideo2.currentTime <= 1.2) {
          crossfadeToVideo(1);
        }
      }
    });
  }

  function crossfadeToVideo(target) {
    isCrossfading = true;

    if (target === 2) {
      bgVideo2.currentTime = 0;
      const p = bgVideo2.play();
      if (p !== undefined) p.catch(() => {});

      bgVideo2.classList.add('active');
      bgVideo1.classList.remove('active');
      activeVideo = 2;

      setTimeout(() => {
        bgVideo1.pause();
        isCrossfading = false;
      }, 1000);
    } else {
      bgVideo1.currentTime = 0;
      const p = bgVideo1.play();
      if (p !== undefined) p.catch(() => {});

      bgVideo1.classList.add('active');
      bgVideo2.classList.remove('active');
      activeVideo = 1;

      setTimeout(() => {
        bgVideo2.pause();
        isCrossfading = false;
      }, 1000);
    }
  }

  /* ==========================================================================
     5. TYPEWRITER WITH BLUE SELECTION ANIMATION
     ========================================================================== */
  const phrases = [
    'DEVELOPER ✦ EDIT',
    'VISIONOS ✦ CYBERPUNK',
    'AUDIO ✦ IMMERSION',
    'SIMIIUS ✦ OFFICIAL'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isSelecting = false;
  let typewriterTimeout = null;

  function initTypewriter() {
    if (!typewriterText) return;
    typeChar();
  }

  function typeChar() {
    const currentPhrase = phrases[phraseIndex];

    if (charIndex < currentPhrase.length) {
      typewriterText.textContent += currentPhrase.charAt(charIndex);
      charIndex++;
      typewriterTimeout = setTimeout(typeChar, 80 + Math.random() * 40);
    } else {
      typewriterTimeout = setTimeout(selectPhrase, 2200);
    }
  }

  function selectPhrase() {
    const currentPhrase = phrases[phraseIndex];
    let selectedCount = 0;

    function stepSelection() {
      if (selectedCount <= currentPhrase.length) {
        const unselected = currentPhrase.slice(0, currentPhrase.length - selectedCount);
        const selected = currentPhrase.slice(currentPhrase.length - selectedCount);
        typewriterText.innerHTML = `${escapeHtml(unselected)}<span class="typewriter-selection">${escapeHtml(selected)}</span>`;
        selectedCount++;
        typewriterTimeout = setTimeout(stepSelection, 45);
      } else {
        typewriterTimeout = setTimeout(deletePhrase, 400);
      }
    }

    stepSelection();
  }

  function deletePhrase() {
    typewriterText.innerHTML = '';
    charIndex = 0;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typewriterTimeout = setTimeout(typeChar, 500);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     6. BIO ACCORDION CONTROLLER
     ========================================================================== */
  function initBioAccordion() {
    if (!bioToggleBtn || !bioContent) return;

    bioToggleBtn.addEventListener('click', () => {
      const isOpen = bioContent.classList.contains('open');

      if (isOpen) {
        bioContent.classList.remove('open');
        bioToggleBtn.setAttribute('aria-expanded', 'false');
        if (bioChevron) bioChevron.style.transform = 'rotate(0deg)';
      } else {
        bioContent.classList.add('open');
        bioToggleBtn.setAttribute('aria-expanded', 'true');
        if (bioChevron) bioChevron.style.transform = 'rotate(180deg)';
      }
    });
  }

  /* ==========================================================================
     7. CUSTOM AUDIO PLAYER & WAVEFORM CONTROLLER
     ========================================================================== */
  function updateTrackUI() {
    const track = playlist[currentTrackIndex];
    if (!track) return;

    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (trackCover) trackCover.src = track.cover;
    if (trackIndexDisplay) trackIndexDisplay.textContent = `${currentTrackIndex + 1} / ${playlist.length}`;

    if (scrubber) {
      scrubber.value = 0;
      scrubber.style.setProperty('--seek-before-width', '0%');
    }
    if (currentTimeDisplay) currentTimeDisplay.textContent = '00:00';
    if (totalDurationDisplay) totalDurationDisplay.textContent = '00:00';
  }

  function loadTrack(index, autoPlay = false) {
    currentTrackIndex = (index + playlist.length) % playlist.length;
    audio.src = playlist[currentTrackIndex].src;
    updateTrackUI();
    renderLyrics(currentTrackIndex);

    if (autoPlay) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function playAudio() {
    audio.play().then(() => {
      isAudioPlaying = true;
      updatePlayStateUI(true);
    }).catch(err => {
      console.log('Audio playback waiting for user click:', err);
      isAudioPlaying = false;
      updatePlayStateUI(false);
    });
  }

  function pauseAudio() {
    audio.pause();
    isAudioPlaying = false;
    updatePlayStateUI(false);
  }

  function togglePlayPause() {
    if (audio.paused || !isAudioPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function updatePlayStateUI(playing) {
    if (playerCard) {
      if (playing) {
        playerCard.classList.add('is-playing');
      } else {
        playerCard.classList.remove('is-playing');
      }
    }

    if (playPauseIcon) {
      if (playing) {
        playPauseIcon.innerHTML = `
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        `;
      } else {
        playPauseIcon.innerHTML = `
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        `;
      }
    }

    updateTopAudioIcon();
  }

  function updateTopAudioIcon() {
    if (!topAudioIcon) return;

    if (isAudioPlaying && !audio.muted && audio.volume > 0) {
      topAudioIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      `;
    } else {
      topAudioIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
        <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
        <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
      `;
    }
  }

  function updateVolumeIcon() {
    if (!volumeIcon) return;

    if (audio.muted || audio.volume === 0) {
      volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
        <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
        <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
      `;
    } else if (audio.volume < 0.5) {
      volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      `;
    } else {
      volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      `;
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /* ==========================================================================
     8. SPICY LYRICS (VISIONOS / SPICETIFY INSPIRED DYNAMIC KARAOKE)
     ========================================================================== */
  let currentLineIndex = -1;
  let userIsScrolling = false;
  let scrollTimeout = null;

  function renderLyrics(trackIndex) {
    if (!lyricsContainer) return;
    lyricsContainer.innerHTML = '';
    currentLineIndex = -1;
    userIsScrolling = false;
    hideResyncButton();

    const track = playlist[trackIndex];
    if (lyricsSongTitle && track) {
      lyricsSongTitle.textContent = `${track.title} — ${track.artist}`;
    }

    const lines = lyricsData[trackIndex] || [];
    lines.forEach((item, index) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'spicy-line';
      lineEl.dataset.index = index;
      lineEl.dataset.time = item.time;
      lineEl.textContent = item.text;

      lineEl.addEventListener('click', () => {
        const targetTime = parseFloat(item.time);
        if (!isNaN(targetTime)) {
          audio.currentTime = targetTime;
          if (audio.paused) {
            playAudio();
          }
          userIsScrolling = false;
          hideResyncButton();
          setActiveLine(index, true);
        }
      });

      lyricsContainer.appendChild(lineEl);
    });

    lyricsContainer.scrollTop = 0;
  }

  function setActiveLine(index, smoothScroll = true) {
    if (!lyricsContainer) return;
    const children = lyricsContainer.children;
    if (!children || children.length === 0) return;

    if (index !== currentLineIndex) {
      currentLineIndex = index;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (i === index) {
          child.classList.add('active');
          child.classList.remove('passed');
        } else if (i < index) {
          child.classList.remove('active');
          child.classList.add('passed');
        } else {
          child.classList.remove('active', 'passed');
        }
      }
    }

    if (!userIsScrolling && smoothScroll && children[index]) {
      const targetEl = children[index];
      const containerHeight = lyricsContainer.clientHeight;
      const targetTop = targetEl.offsetTop - (containerHeight * 0.38) + (targetEl.clientHeight / 2);
      lyricsContainer.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
    }
  }

  function syncLyricsWithTime(currentTime) {
    if (!lyricsContainer) return;
    const lines = lyricsData[currentTrackIndex] || [];
    if (lines.length === 0) return;

    let activeIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (currentTime >= lines[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }

    if (activeIdx !== -1 && activeIdx !== currentLineIndex) {
      setActiveLine(activeIdx, true);
    }
  }

  function showResyncButton() {
    if (lyricsResyncBtn) lyricsResyncBtn.classList.remove('hidden');
    if (lyricsSyncBadge) {
      lyricsSyncBadge.textContent = '○ MANUAL';
      lyricsSyncBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  }

  function hideResyncButton() {
    if (lyricsResyncBtn) lyricsResyncBtn.classList.add('hidden');
    if (lyricsSyncBadge) {
      lyricsSyncBadge.textContent = '● SYNCED';
      lyricsSyncBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  }

  if (lyricsContainer) {
    const handleManualScroll = () => {
      userIsScrolling = true;
      showResyncButton();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        userIsScrolling = false;
        hideResyncButton();
        if (currentLineIndex >= 0) {
          setActiveLine(currentLineIndex, true);
        }
      }, 3500);
    };

    lyricsContainer.addEventListener('wheel', handleManualScroll, { passive: true });
    lyricsContainer.addEventListener('touchmove', handleManualScroll, { passive: true });
  }

  if (lyricsResyncBtn) {
    lyricsResyncBtn.addEventListener('click', () => {
      userIsScrolling = false;
      hideResyncButton();
      if (currentLineIndex >= 0) {
        setActiveLine(currentLineIndex, true);
      }
    });
  }

  if (lyricsToggleBtn) {
    lyricsToggleBtn.addEventListener('click', () => {
      if (lyricsWindow) {
        lyricsWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Audio event listeners
  audio.addEventListener('timeupdate', () => {
    syncLyricsWithTime(audio.currentTime);

    if (audio.duration && !scrubber.matches(':active')) {
      const current = audio.currentTime;
      const duration = audio.duration;
      const percent = (current / duration) * 100;
      scrubber.value = percent;
      scrubber.style.setProperty('--seek-before-width', `${percent}%`);
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(current);
      }
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (totalDurationDisplay && audio.duration) {
      totalDurationDisplay.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('ended', () => {
    loadTrack(currentTrackIndex + 1, true);
  });

  // Scrubber seeking
  if (scrubber) {
    scrubber.addEventListener('input', () => {
      if (audio.duration) {
        const seekTo = (scrubber.value / 100) * audio.duration;
        audio.currentTime = seekTo;
        if (currentTimeDisplay) {
          currentTimeDisplay.textContent = formatTime(seekTo);
        }
        scrubber.style.setProperty('--seek-before-width', `${scrubber.value}%`);
      }
    });
  }

  // Player Controls Click Handlers
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }

  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', () => {
      loadTrack(currentTrackIndex - 1, isAudioPlaying);
    });
  }

  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', () => {
      loadTrack(currentTrackIndex + 1, isAudioPlaying);
    });
  }

  if (topAudioBtn) {
    topAudioBtn.addEventListener('click', togglePlayPause);
  }

  // Volume Handlers
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const val = parseFloat(volumeSlider.value) / 100;
      audio.volume = val;
      audio.muted = false;
      lastVolume = val;
      volumeSlider.style.setProperty('--seek-before-width', `${volumeSlider.value}%`);
      updateVolumeIcon();
      updateTopAudioIcon();
    });
  }

  if (volumeMuteBtn) {
    volumeMuteBtn.addEventListener('click', () => {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = lastVolume > 0 ? lastVolume : 0.8;
        if (volumeSlider) {
          volumeSlider.value = audio.volume * 100;
          volumeSlider.style.setProperty('--seek-before-width', `${volumeSlider.value}%`);
        }
      } else {
        lastVolume = audio.volume;
        audio.muted = true;
        audio.volume = 0;
        if (volumeSlider) {
          volumeSlider.value = 0;
          volumeSlider.style.setProperty('--seek-before-width', '0%');
        }
      }
      updateVolumeIcon();
      updateTopAudioIcon();
    });
  }

  /* ==========================================================================
     9. LIVE VISITOR COUNTER
     ========================================================================== */
  async function initVisitorCounter() {
    if (!visitorCountDisplay) return;

    const storageKey = 'simiius_visitor_count';
    const cachedCount = parseInt(localStorage.getItem(storageKey) || '1', 10);
    let targetCount = cachedCount;

    visitorCountDisplay.textContent = targetCount.toLocaleString();

    try {
      const url = 'https://api.visitorbadge.io/api/visitors?path=simiius.github.io.official.page';
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const svgText = await res.text();
        const matches = [...svgText.matchAll(/<text[^>]*>([0-9,]+)<\/text>/gi)];
        if (matches && matches.length > 0) {
          const rawNum = matches[matches.length - 1][1].replace(/,/g, '');
          const parsed = parseInt(rawNum, 10);
          if (!isNaN(parsed) && parsed > 0) {
            targetCount = parsed;
            localStorage.setItem(storageKey, targetCount.toString());
          }
        }
      }
    } catch (e) {
      targetCount = cachedCount + 1;
      localStorage.setItem(storageKey, targetCount.toString());
    }

    animateCount(cachedCount, targetCount);
  }

  function animateCount(start, end) {
    if (start === end || !visitorCountDisplay) {
      if (visitorCountDisplay) visitorCountDisplay.textContent = end.toLocaleString();
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * ease);

      if (visitorCountDisplay) {
        visitorCountDisplay.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (visitorCountDisplay) visitorCountDisplay.textContent = end.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  /* ==========================================================================
     10. POST-LOAD INITIALIZATION (Called immediately after preloader finishes)
     ========================================================================== */
  function initPostLoad() {
    initVideoLooper();
    initTypewriter();
    initBioAccordion();
    loadTrack(0, false);
    renderLyrics(0);
    initVisitorCounter();

    const unlockAudio = () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
  }
});

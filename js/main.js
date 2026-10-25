/**
 * Main Application Orchestrator
 * - Manages Chapter Transitions (1 to 5)
 * - Browser History & URL Hash Sync
 * - Floating Navigation Dock
 * - Sound Engine Toggle
 * - Mobile Touch & Keyboard Accessibility
 * - Global Event Delegation (Guaranteed button clicks on file:// and http://)
 */

(function() {
  const chapterMap = {
    'welcome': 1,
    'cake': 2,
    'wall': 3,
    'game': 4,
    'letter': 5
  };

  const reverseMap = {
    1: 'welcome',
    2: 'cake',
    3: 'wall',
    4: 'game',
    5: 'letter'
  };

  let currentChapterIndex = 1;

  // Global navigation function available everywhere immediately
  window.navigateToChapter = function(target, pushHistory = true) {
    const chapterNum = Math.max(1, Math.min(5, Number(target)));
    
    // Play subtle audio tap
    if (window.soundEngine && typeof window.soundEngine.playTap === 'function') {
      window.soundEngine.playTap();
    }

    const allChapters = document.querySelectorAll('.chapter');
    allChapters.forEach(chap => {
      const idx = Number(chap.dataset.chapter);
      if (idx === chapterNum) {
        chap.classList.add('active');
        chap.setAttribute('aria-hidden', 'false');
        chap.scrollTop = 0;
      } else {
        chap.classList.remove('active');
        chap.setAttribute('aria-hidden', 'true');
      }
    });

    window.scrollTo(0, 0);
    currentChapterIndex = chapterNum;

    // Update Dock Navigation Buttons
    const dockButtons = document.querySelectorAll('.dock-nav-btn');
    dockButtons.forEach(btn => {
      const btnChapter = Number(btn.dataset.chapter);
      if (btnChapter === chapterNum) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });

    // Sync URL hash if allowed
    try {
      const hashSlug = reverseMap[chapterNum];
      if (pushHistory) {
        history.pushState({ chapter: chapterNum }, '', `#${hashSlug}`);
      } else {
        history.replaceState({ chapter: chapterNum }, '', `#${hashSlug}`);
      }
    } catch (e) {
      // Ignore origin issues on file:// protocol
    }
  };

  // Robust global event delegation: Ensures every button click works even if clicked before full load
  document.addEventListener('click', function(e) {
    const enterBtn = e.target.closest('#welcome-enter-btn');
    if (enterBtn) {
      e.preventDefault();
      window.navigateToChapter(2);
      return;
    }

    const dockBtn = e.target.closest('.dock-nav-btn');
    if (dockBtn && dockBtn.dataset.chapter) {
      e.preventDefault();
      window.navigateToChapter(Number(dockBtn.dataset.chapter));
      return;
    }

    const toPhotosBtn = e.target.closest('#to-photos-btn');
    if (toPhotosBtn) {
      e.preventDefault();
      window.navigateToChapter(3);
      return;
    }

    const toGameBtn = e.target.closest('#to-game-btn');
    if (toGameBtn) {
      e.preventDefault();
      window.navigateToChapter(4);
      return;
    }

    const toLetterBtn = e.target.closest('#to-letter-btn');
    if (toLetterBtn) {
      e.preventDefault();
      window.navigateToChapter(5);
      return;
    }

    const backToStart = e.target.closest('#back-to-start-btn');
    if (backToStart) {
      e.preventDefault();
      window.navigateToChapter(1);
      return;
    }
  });

  // Main initializer
  function initializeApp() {
    // Instantiate module experiences
    if (window.CakeExperience) {
      window.cakeApp = new window.CakeExperience();
    }
    if (window.MemoryWallExperience) {
      window.wallApp = new window.MemoryWallExperience();
    }
    if (window.MemoryGameExperience) {
      window.gameApp = new window.MemoryGameExperience();
    }
    if (window.LetterExperience) {
      window.letterApp = new window.LetterExperience();
    }

    // Sound toggle button
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn && window.soundEngine) {
      const updateSoundBtnUI = (isMuted) => {
        soundToggleBtn.setAttribute('aria-label', isMuted ? 'Unmute sounds' : 'Mute sounds');
        const icon = soundToggleBtn.querySelector('.sound-icon');
        const text = soundToggleBtn.querySelector('.sound-label');
        if (icon) icon.textContent = isMuted ? '🔇' : '🔔';
        if (text) text.textContent = isMuted ? 'Muted' : 'Sound On';
        soundToggleBtn.classList.toggle('muted', isMuted);
      };

      updateSoundBtnUI(window.soundEngine.isMuted());

      soundToggleBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        updateSoundBtnUI(isMuted);
      });
    }

    // Ambient floating particles
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const container = document.getElementById('ambient-particles');
      if (container && container.children.length === 0) {
        for (let i = 0; i < 14; i++) {
          const p = document.createElement('div');
          p.className = 'ambient-particle';
          const size = Math.random() * 8 + 4;
          p.style.width = `${size}px`;
          p.style.height = `${size}px`;
          p.style.left = `${Math.random() * 100}vw`;
          p.style.animationDuration = `${Math.random() * 12 + 10}s`;
          p.style.animationDelay = `${Math.random() * 8}s`;
          p.style.opacity = (Math.random() * 0.35 + 0.15).toFixed(2);
          container.appendChild(p);
        }
      }
    }

    // Browser back/forward navigation
    window.addEventListener('popstate', () => {
      try {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        const chapterNum = chapterMap[hash] || 1;
        window.navigateToChapter(chapterNum, false);
      } catch (e) {}
    });

    // Check initial hash route
    try {
      const initialHash = window.location.hash.replace('#', '').toLowerCase();
      if (chapterMap[initialHash]) {
        window.navigateToChapter(chapterMap[initialHash], false);
      } else {
        window.navigateToChapter(1, false);
      }
    } catch (e) {
      window.navigateToChapter(1, false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();

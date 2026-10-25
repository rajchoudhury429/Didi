/**
 * Personal Birthday Letter Module (Page 5)
 * Handles:
 * - Tactile envelope opening animation (seal breaking, flap opening, paper sliding out)
 * - Smooth transition into full reading surface
 * - Return to top of letter interaction
 * - Back to home navigation
 */

class LetterExperience {
  constructor() {
    this.envelopeWrapper = document.getElementById('letter-envelope-wrapper');
    this.envelope = document.getElementById('letter-envelope');
    this.openBtn = document.getElementById('open-letter-btn');
    this.letterPaper = document.getElementById('letter-paper-content');
    this.readAgainBtn = document.getElementById('read-again-btn');
    this.backToStartBtn = document.getElementById('back-to-start-btn');
    this.isOpened = false;

    this.bindEvents();
  }

  bindEvents() {
    // Open envelope via button or envelope click
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openEnvelope());
    }
    if (this.envelope) {
      this.envelope.addEventListener('click', () => this.openEnvelope());
      this.envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openEnvelope();
        }
      });
    }

    // Scroll back to top of letter
    if (this.readAgainBtn) {
      this.readAgainBtn.addEventListener('click', () => {
        if (this.letterPaper) {
          this.letterPaper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (window.soundEngine) window.soundEngine.playTap();
      });
    }

    // Return to beginning (Chapter 1)
    if (this.backToStartBtn) {
      this.backToStartBtn.addEventListener('click', () => {
        if (window.navigateToChapter) {
          window.navigateToChapter(1);
        }
      });
    }
  }

  openEnvelope() {
    if (this.isOpened) return;
    this.isOpened = true;

    if (window.soundEngine) {
      window.soundEngine.playEnvelopeOpen();
    }

    // Step 1: Animate wax seal pop and flap open
    if (this.envelope) {
      this.envelope.classList.add('flap-open');
    }

    // Step 2: Paper slides up
    setTimeout(() => {
      if (this.envelope) {
        this.envelope.classList.add('paper-slides-out');
      }
    }, 400);

    // Step 3: Transition to full reading view
    setTimeout(() => {
      if (this.envelopeWrapper) {
        this.envelopeWrapper.classList.add('letter-expanded');
      }
      if (this.letterPaper) {
        this.letterPaper.classList.remove('hidden');
        this.letterPaper.classList.add('unfolded');
      }

      // Gentle celebratory confetti for reaching the personal letter
      if (window.confetti) {
        window.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.3, 40);
      }

      // Smooth scroll to top of parchment
      setTimeout(() => {
        if (this.letterPaper) {
          this.letterPaper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }, 850);
  }

  reset() {
    this.isOpened = false;
    if (this.envelope) {
      this.envelope.classList.remove('flap-open', 'paper-slides-out');
    }
    if (this.envelopeWrapper) {
      this.envelopeWrapper.classList.remove('letter-expanded');
    }
    if (this.letterPaper) {
      this.letterPaper.classList.add('hidden');
      this.letterPaper.classList.remove('unfolded');
    }
  }
}

window.LetterExperience = LetterExperience;

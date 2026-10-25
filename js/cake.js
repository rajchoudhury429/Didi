/**
 * Birthday Cake Interactive Module (Page 2)
 * Handles:
 * - Candle lighting (individually clickable with glow)
 * - Make a wish trigger (extinguishes flames, bursts confetti, displays message)
 * - Cake cutting animation (slice separates cleanly)
 * - Gift box surprise reveal
 * - Navigation to Page 3
 */

class CakeExperience {
  constructor() {
    this.candlesLit = 0;
    this.totalCandles = 4;
    this.wishMade = false;
    this.cakeCut = false;
    this.giftOpened = false;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.candles = document.querySelectorAll('.cake-candle');
    this.instruction = document.getElementById('cake-instruction');
    this.wishBtn = document.getElementById('make-wish-btn');
    this.wishCard = document.getElementById('wish-message-card');
    this.cutCakeBtn = document.getElementById('cut-cake-btn');
    this.cakeContainer = document.getElementById('cake-display-wrapper');
    this.cakeSlice = document.getElementById('cut-slice-display');
    this.giftBox = document.getElementById('surprise-gift-box');
    this.giftMessage = document.getElementById('gift-message-bubble');
    this.toPhotosBtn = document.getElementById('to-photos-btn');
  }

  bindEvents() {
    // Candle clicks
    this.candles.forEach((candle, index) => {
      candle.addEventListener('click', () => this.lightCandle(candle, index));
      candle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.lightCandle(candle, index);
        }
      });
    });

    // Make a wish button
    if (this.wishBtn) {
      this.wishBtn.addEventListener('click', () => this.makeWish());
    }

    // Cut cake button
    if (this.cutCakeBtn) {
      this.cutCakeBtn.addEventListener('click', () => this.cutTheCake());
    }

    // Gift box interaction
    if (this.giftBox) {
      this.giftBox.addEventListener('click', () => this.openGiftBox());
      this.giftBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openGiftBox();
        }
      });
    }

    // Navigation to photos
    if (this.toPhotosBtn) {
      this.toPhotosBtn.addEventListener('click', () => {
        if (window.navigateToChapter) {
          window.navigateToChapter(3);
        }
      });
    }
  }

  lightCandle(candle, index) {
    if (candle.classList.contains('lit') || this.wishMade) return;

    candle.classList.add('lit');
    candle.setAttribute('aria-label', `Candle ${index + 1} lit`);
    this.candlesLit++;

    if (window.soundEngine) {
      window.soundEngine.playCandleLit();
    }

    // Update instruction text
    if (this.candlesLit < this.totalCandles) {
      if (this.instruction) {
        this.instruction.textContent = `Chal, baaki ke ${this.totalCandles - this.candlesLit} candles bhi light kar! 🕯️`;
      }
    } else {
      // All candles lit!
      this.allCandlesLit();
    }
  }

  allCandlesLit() {
    if (this.instruction) {
      this.instruction.innerHTML = 'Ab ek wish maang le, <strong>Dr. Hena</strong> banne wali hai aakhir! 🩺';
      this.instruction.classList.add('highlight-text');
    }

    if (this.wishBtn) {
      this.wishBtn.classList.remove('disabled');
      this.wishBtn.removeAttribute('disabled');
      this.wishBtn.classList.add('pulse-glow');
      this.wishBtn.focus();
    }
  }

  makeWish() {
    if (this.wishMade || this.candlesLit < this.totalCandles) return;
    this.wishMade = true;

    if (window.soundEngine) {
      window.soundEngine.playCandleBlow();
    }

    // Extinguish flames with puff animation
    this.candles.forEach(candle => {
      candle.classList.remove('lit');
      candle.classList.add('extinguished');
    });

    // Small delay for smoke then celebration
    setTimeout(() => {
      if (window.soundEngine) {
        window.soundEngine.playWishCelebration();
      }

      if (window.confetti) {
        window.confetti.burstSideCannons();
      }

      // Reveal wish message
      if (this.wishCard) {
        this.wishCard.classList.remove('hidden');
        this.wishCard.classList.add('revealed');
        this.wishCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Hide make a wish button, reveal cut cake button
      if (this.wishBtn) {
        this.wishBtn.classList.add('hidden');
      }
      if (this.cutCakeBtn) {
        this.cutCakeBtn.classList.remove('hidden');
        this.cutCakeBtn.classList.add('appear-pop');
      }
    }, 400);
  }

  cutTheCake() {
    if (this.cakeCut) return;
    this.cakeCut = true;

    if (window.soundEngine) {
      window.soundEngine.playCakeCut();
    }

    // Animate cake slice
    if (this.cakeContainer) {
      this.cakeContainer.classList.add('cake-is-cut');
    }
    if (this.cakeSlice) {
      this.cakeSlice.classList.remove('hidden');
      this.cakeSlice.classList.add('slice-served');
    }

    // Confetti burst for cutting
    if (window.confetti) {
      window.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 60);
    }

    // Update button
    if (this.cutCakeBtn) {
      this.cutCakeBtn.textContent = 'CAKE CUT HO GAYA! 🍰😋';
      this.cutCakeBtn.disabled = true;
      this.cutCakeBtn.classList.add('btn-secondary');
    }

    // Reveal gift box prompt if not already noticed
    if (this.giftBox) {
      this.giftBox.classList.add('bounce-attention');
    }
  }

  openGiftBox() {
    if (this.giftOpened) return;
    this.giftOpened = true;

    if (window.soundEngine) {
      window.soundEngine.playGiftOpen();
    }

    this.giftBox.classList.add('box-open');
    this.giftBox.classList.remove('bounce-attention');

    if (this.giftMessage) {
      this.giftMessage.classList.remove('hidden');
      this.giftMessage.classList.add('pop-in');
    }

    if (window.confetti) {
      const rect = this.giftBox.getBoundingClientRect();
      window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }
  }

  reset() {
    this.candlesLit = 0;
    this.wishMade = false;
    this.cakeCut = false;
    this.giftOpened = false;

    this.candles.forEach((c, idx) => {
      c.classList.remove('lit', 'extinguished');
      c.setAttribute('aria-label', `Candle ${idx + 1} unlit`);
    });

    if (this.instruction) {
      this.instruction.textContent = 'Chal, candles light kar!';
      this.instruction.classList.remove('highlight-text');
    }

    if (this.wishBtn) {
      this.wishBtn.classList.add('disabled');
      this.wishBtn.setAttribute('disabled', 'true');
      this.wishBtn.classList.remove('pulse-glow', 'hidden');
    }

    if (this.wishCard) {
      this.wishCard.classList.add('hidden');
      this.wishCard.classList.remove('revealed');
    }

    if (this.cutCakeBtn) {
      this.cutCakeBtn.classList.add('hidden');
      this.cutCakeBtn.classList.remove('appear-pop', 'btn-secondary');
      this.cutCakeBtn.disabled = false;
      this.cutCakeBtn.textContent = 'PEHLE EK SLICE KAAT LEIN 🔪';
    }

    if (this.cakeContainer) {
      this.cakeContainer.classList.remove('cake-is-cut');
    }
    if (this.cakeSlice) {
      this.cakeSlice.classList.add('hidden');
      this.cakeSlice.classList.remove('slice-served');
    }

    if (this.giftBox) {
      this.giftBox.classList.remove('box-open', 'bounce-attention');
    }
    if (this.giftMessage) {
      this.giftMessage.classList.add('hidden');
      this.giftMessage.classList.remove('pop-in');
    }
  }
}

window.CakeExperience = CakeExperience;

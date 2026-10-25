/**
 * Our Little Memory Game Controller (Page 4)
 * - 3 Difficulty levels: 4 pairs (8 cards), 6 pairs (12 cards), 8 pairs (16 cards)
 * - 3D card flip animations
 * - Safe state lock during evaluation
 * - Move counter, pairs counter, elapsed timer
 * - Celebration victory modal with sibling banter & stats
 * - Transition to personal letter
 */

class MemoryGameExperience {
  constructor() {
    this.board = document.getElementById('memory-game-board');
    this.movesEl = document.getElementById('game-moves-count');
    this.pairsEl = document.getElementById('game-pairs-count');
    this.timerEl = document.getElementById('game-timer-display');
    this.restartBtn = document.getElementById('game-restart-btn');
    this.newGameBtn = document.getElementById('game-new-btn');
    this.diffButtons = document.querySelectorAll('.diff-btn');
    this.winModal = document.getElementById('game-win-modal');
    this.playAgainBtn = document.getElementById('game-play-again-btn');
    this.toLetterBtn = document.getElementById('to-letter-btn');
    this.winTimeEl = document.getElementById('win-time-stat');
    this.winMovesEl = document.getElementById('win-moves-stat');

    this.symbols = [
      { id: 'momos', icon: '🥟', name: 'Street Momos' },
      { id: 'steth', icon: '🩺', name: 'Dr. Hena' },
      { id: 'gamepad', icon: '🎮', name: 'Midnight Games' },
      { id: 'cake', icon: '🎂', name: 'Birthday Cake' },
      { id: 'books', icon: '📚', name: 'Med Studies' },
      { id: 'laptop', icon: '💻', name: 'Code & Tech' },
      { id: 'chai', icon: '☕', name: 'Gup-Shup Chai' },
      { id: 'plane', icon: '✈️', name: 'Abroad Flights' }
    ];

    this.difficultyLevels = {
      easy: 4,    // 4 pairs = 8 cards
      medium: 6,  // 6 pairs = 12 cards
      hard: 8     // 8 pairs = 16 cards
    };

    this.currentDifficulty = 'medium';
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isLocked = false;
    this.timerInterval = null;
    this.secondsElapsed = 0;
    this.gameStarted = false;

    this.initGame();
    this.bindEvents();
  }

  bindEvents() {
    // Difficulty switches
    this.diffButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const diff = btn.dataset.diff;
        if (this.currentDifficulty === diff) return;
        this.diffButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDifficulty = diff;
        this.initGame();
      });
    });

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.initGame());
    }
    if (this.newGameBtn) {
      this.newGameBtn.addEventListener('click', () => this.initGame());
    }
    if (this.playAgainBtn) {
      this.playAgainBtn.addEventListener('click', () => {
        this.hideWinModal();
        this.initGame();
      });
    }

    // Transition to letter
    if (this.toLetterBtn) {
      this.toLetterBtn.addEventListener('click', () => {
        this.hideWinModal();
        if (window.navigateToChapter) {
          window.navigateToChapter(5);
        }
      });
    }
  }

  initGame() {
    this.stopTimer();
    this.secondsElapsed = 0;
    this.moves = 0;
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.isLocked = false;
    this.gameStarted = false;

    this.updateStats();
    this.buildBoard();
  }

  buildBoard() {
    if (!this.board) return;
    this.board.innerHTML = '';

    const pairCount = this.difficultyLevels[this.currentDifficulty];
    const selectedSymbols = this.symbols.slice(0, pairCount);

    // Duplicate each symbol to make pairs
    let cardDeck = [];
    selectedSymbols.forEach(sym => {
      cardDeck.push({ ...sym, uid: `${sym.id}-a` });
      cardDeck.push({ ...sym, uid: `${sym.id}-b` });
    });

    // Fisher-Yates shuffle
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }

    this.board.dataset.difficulty = this.currentDifficulty;

    cardDeck.forEach((cardData, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.dataset.symbolId = cardData.id;
      cardEl.dataset.uid = cardData.uid;
      cardEl.dataset.index = idx;
      cardEl.tabIndex = 0;
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('aria-label', `Memory card ${idx + 1}`);

      cardEl.innerHTML = `
        <div class="card-inner">
          <div class="card-front" aria-hidden="true">
            <div class="card-pattern">
              <span class="card-back-icon">✨</span>
              <span class="card-back-text">DIDI ❤️</span>
            </div>
          </div>
          <div class="card-back">
            <span class="card-symbol-icon">${cardData.icon}</span>
            <span class="card-symbol-name">${cardData.name}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => this.handleCardClick(cardEl, cardData));
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(cardEl, cardData);
        }
      });

      this.board.appendChild(cardEl);
    });
  }

  handleCardClick(cardEl, cardData) {
    if (this.isLocked) return;
    if (cardEl.classList.contains('revealed') || cardEl.classList.contains('matched')) return;

    // Start timer on first flip
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTimer();
    }

    // Play card flip sound
    if (window.soundEngine) {
      window.soundEngine.playCardFlip();
    }

    cardEl.classList.add('revealed');
    this.flippedCards.push({ element: cardEl, data: cardData });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateStats();
      this.checkMatch();
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.data.id === card2.data.id;

    if (isMatch) {
      // Match found!
      this.isLocked = true;
      setTimeout(() => {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');

        if (window.soundEngine) {
          window.soundEngine.playMatch();
        }

        this.matchedPairs++;
        this.updateStats();
        this.flippedCards = [];
        this.isLocked = false;

        const totalPairs = this.difficultyLevels[this.currentDifficulty];
        if (this.matchedPairs === totalPairs) {
          this.handleGameWin();
        }
      }, 350);
    } else {
      // Mismatch - lock board and flip back after 850ms
      this.isLocked = true;
      setTimeout(() => {
        card1.element.classList.remove('revealed');
        card2.element.classList.remove('revealed');
        this.flippedCards = [];
        this.isLocked = false;
      }, 850);
    }
  }

  handleGameWin() {
    this.stopTimer();

    setTimeout(() => {
      if (window.soundEngine) {
        window.soundEngine.playVictory();
      }

      if (window.confetti) {
        window.confetti.burstSideCannons();
      }

      if (this.winTimeEl) {
        this.winTimeEl.textContent = this.formatTime(this.secondsElapsed);
      }
      if (this.winMovesEl) {
        this.winMovesEl.textContent = `${this.moves} moves`;
      }

      this.showWinModal();
    }, 500);
  }

  showWinModal() {
    if (!this.winModal) return;
    this.winModal.classList.remove('hidden');
    this.winModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (this.playAgainBtn) this.playAgainBtn.focus();
  }

  hideWinModal() {
    if (!this.winModal) return;
    this.winModal.classList.add('hidden');
    this.winModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.secondsElapsed++;
      this.updateStats();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  updateStats() {
    if (this.movesEl) {
      this.movesEl.textContent = this.moves;
    }
    if (this.pairsEl) {
      const total = this.difficultyLevels[this.currentDifficulty];
      this.pairsEl.textContent = `${this.matchedPairs} / ${total}`;
    }
    if (this.timerEl) {
      this.timerEl.textContent = this.formatTime(this.secondsElapsed);
    }
  }
}

window.MemoryGameExperience = MemoryGameExperience;

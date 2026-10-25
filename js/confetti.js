/**
 * Confetti Canvas Engine
 * Lightweight, 60fps canvas confetti physics with warm celebratory color palette
 */

class ConfettiEngine {
  constructor(canvasId = 'confetti-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.colors = [
      '#e07a5f', '#f4a261', '#e76f51', '#2a9d8f', '#e9c46a',
      '#d4a373', '#f3c68f', '#b388eb', '#ffb703', '#f28482'
    ];

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 100) {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: Math.random() * 8 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 90 + 90,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  burstSideCannons() {
    this.burst(window.innerWidth * 0.15, window.innerHeight * 0.7, 75);
    setTimeout(() => {
      this.burst(window.innerWidth * 0.85, window.innerHeight * 0.7, 75);
    }, 200);
    setTimeout(() => {
      this.burst(window.innerWidth * 0.5, window.innerHeight * 0.5, 90);
    }, 450);
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.vx *= 0.985; // drag
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;

      const scaleX = Math.cos(p.wobble);

      if (p.life > p.maxLife - 30) {
        p.opacity = Math.max(0, (p.maxLife - p.life) / 30);
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.scale(scaleX, 1);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();

      if (p.y > this.height + 20 || p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(this.loop);
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  clear() {
    this.particles = [];
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

window.confetti = new ConfettiEngine('confetti-canvas');

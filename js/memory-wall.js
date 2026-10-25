/**
 * ==============================================================================
 * Memory Wall Controller (Chapter 3)
 * ==============================================================================
 * Decorative wall gallery displaying curated framed photographs of Hena.
 * Features:
 * - Natural physical photo frames (polaroid, vintage-wood, modern-cream, gold-accent, taped, feature-large, feature-tall)
 * - Automatic frame-to-photo dimension matching with smart cropping and face preservation
 * - Subtle desktop hover lift & mobile tap feedback
 * - Non-clickable decorative wall (no lightbox, modal, or zoom popups)
 * - Transition button to Chapter 4 (Memory Game)
 * ==============================================================================
 */

class MemoryWallExperience {
  constructor() {
    this.wallGrid = document.getElementById('photo-wall-grid');
    this.toGameBtn = document.getElementById('to-game-btn');
    this.photos = window.HENA_PHOTOS || [];

    this.initWall();
    this.bindEvents();
  }

  initWall() {
    if (!this.wallGrid) return;
    this.wallGrid.innerHTML = '';
    this.photos = window.HENA_PHOTOS || [];

    this.photos.forEach((photo, index) => {
      const frameEl = document.createElement('div');
      frameEl.className = `photo-frame-wrapper frame-${photo.frame || 'polaroid'}`;
      frameEl.dataset.index = index;
      frameEl.dataset.id = photo.id;
      frameEl.dataset.slot = photo.slot || `hena-${String(photo.id).padStart(2, '0')}`;
      frameEl.setAttribute('aria-label', `Photograph ${photo.id} of ${this.photos.length}`);

      // Apply natural tilt, staggered reveal, aspect ratio, and object-fit/position
      frameEl.style.setProperty('--frame-tilt', photo.tilt || '0deg');
      frameEl.style.setProperty('--frame-delay', `${(index % 10) * 0.05}s`);
      frameEl.style.setProperty('--photo-aspect', photo.aspectRatio || '3/4');
      frameEl.style.setProperty('--photo-fit', photo.objectFit || 'cover');
      frameEl.style.setProperty('--photo-pos', photo.objectPosition || 'center center');

      // Decorative frame accents
      let accentHtml = '';
      if (photo.frame === 'polaroid' || photo.frame === 'taped') {
        accentHtml = '<div class="washi-tape washi-tape-top" aria-hidden="true"></div>';
      } else if (photo.frame === 'vintage-wood' || photo.frame === 'gold-accent' || photo.frame === 'feature-large' || photo.frame === 'feature-tall') {
        accentHtml = '<div class="frame-hanger" aria-hidden="true"></div>';
      }

      frameEl.innerHTML = `
        ${accentHtml}
        <div class="photo-inner-mat">
          <div class="photo-img-container">
            <img 
              src="${photo.src}" 
              alt="${photo.alt || `Memory with Hena ${photo.id}`}"
              loading="lazy"
              class="wall-photo-img"
            />
            <div class="photo-fallback-card hidden">
              <span class="fallback-icon">🖼️</span>
              <span class="fallback-hint">Put ${photo.src} in assets/photos</span>
            </div>
          </div>
        </div>
      `;

      // Graceful image fallback
      const img = frameEl.querySelector('.wall-photo-img');
      const fallback = frameEl.querySelector('.photo-fallback-card');
      if (img && fallback) {
        img.addEventListener('error', () => {
          img.style.display = 'none';
          fallback.classList.remove('hidden');
        });
      }

      this.wallGrid.appendChild(frameEl);
    });
  }

  bindEvents() {
    // Navigation to game
    if (this.toGameBtn) {
      this.toGameBtn.addEventListener('click', () => {
        if (window.navigateToChapter) {
          window.navigateToChapter(4);
        }
      });
    }
  }
}

window.MemoryWallExperience = MemoryWallExperience;

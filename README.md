# A LITTLE WORLD FOR HENA 🎂❤️
### An Interactive Birthday Website created by Raj Choudhury for his elder sister, Hena

A handcrafted digital birthday experience inspired by sibling memories, food outings, late-night game matches, playful teasing, and a personal verbatim Hinglish birthday letter.

---

## 🌟 The Five Chapters

1. **Chapter 1: Birthday Welcome**  
   - Cozy, naturally lit warm atmosphere with an illustrated house, warm greeting, and storybook entrance.
2. **Chapter 2: Birthday Cake Celebration**  
   - Interactive tiered birthday cake where you can click to light all 4 candles.
   - "MAKE A WISH ✨" blows out flames with smoke puffs and confetti burst.
   - Cake slicing interaction that serves a delicious slice on a plate.
   - Surprise gift box pop with sibling humor: *"Gift toh digital hi hai, kyunki paise abhi bhi Papa ke hain. 😭😂"*
3. **Chapter 3: The Memory Wall**  
   - A warm room gallery with realistic framed photographs (Polaroids with tape, vintage wood frames, gold trims).
   - Clean, pure photo presentation — all pictures displayed without caption bars or text lines.
   - Permanent decorative display with automatic frame fitting and subtle hover/tap feedback (no click-to-open lightbox).
4. **Chapter 4: Our Little Memory Game**  
   - Functional memory matching card game with 3 difficulty levels:
     - **Little Challenge** (4 pairs / 8 cards)
     - **Just Like Old Times** (6 pairs / 12 cards)
     - **Didi, Let's See!** (8 pairs / 16 cards)
   - Cute memory symbols (🥟 Momos, 🩺 Dr. Hena, 🎮 Gaming, 🎂 Cake, 📚 Med books, 💻 Tech, ☕ Chai, ✈️ Flights).
   - Live timer, move counter, and celebratory victory modal with banter: *"Jeet gayi ya haar gayi, woh alag baat hai... Par cheating mat bolna! 😂😂"*
5. **Chapter 5: The Personal Birthday Letter**  
   - 3D tactile envelope with wax seal monogram.
   - Clicking unfolds into a full, comfortable, vertically scrollable parchment document.
   - Contains Raj's complete, unedited, verbatim Hinglish letter with all jokes, emojis, memories, and dreams.
   - Handwritten signature: **"TERA KALLU ❤️"**.

---

## 📸 Photo Guide

The memory wall displays real photographs of Hena from `assets/photos/`.

### 1. Where to put the photos
Place photo files inside the folder:
```
assets/photos/
```
Filenames are:
- `hena-01.jpg`
- `hena-02.jpg`
- `hena-03.jpg`
...
- `hena-35.jpg`

### 2. Supported Image Formats
- `.jpg` / `.jpeg` (Recommended)
- `.png`
- `.webp`

### 3. How to Replace a Photo
To replace any photo:
1. Save your photo into `assets/photos/` with the corresponding filename (e.g. `assets/photos/hena-01.jpg`).
2. In `js/photos.js`, frame styles, aspect ratios, object-fit, and face positions can be adjusted:
```javascript
{
  id: 1,
  slot: "hena-01",
  src: "assets/photos/hena-01.jpg",
  alt: "Hena photograph 01",
  frame: "feature-large",
  aspectRatio: "4/3",
  objectFit: "cover",
  objectPosition: "center center",
  tilt: "-1deg"
}
```
3. Save `js/photos.js` and refresh your browser! All 35 frames update instantly.

### 4. Available Frame Styles for the 35 Photos
In `js/photos.js`, you can assign any of these styles to each photo:
- `'polaroid'` — Clean white Polaroid frame with washi tape accent.
- `'vintage-wood'` — Warm dark wood frame with beveled border and wall hanger.
- `'modern-cream'` — Minimalist gallery frame with warm cream matting.
- `'gold-accent'` — Champagne-gold trimmed frame with warm matting.
- `'taped'` — Cozy photo with realistic decorative washi-tape corners.
- `'feature-large'` — Prominent hero frame (spans 2 columns on desktop).
- `'feature-tall'` — Elegant tall portrait feature frame.

### 6. Available Frame Styles
You can set `frame:` to any of the following:
- `'polaroid'` — White Polaroid frame with washi tape and handwritten title.
- `'vintage-wood'` — Warm dark wood frame with beveled border and hanger.
- `'gold-accent'` — Champagne-gold trimmed frame with warm matting.
- `'modern-cream'` — Minimalist gallery mat frame.
- `'taped'` — Photo taped directly onto the gallery wall.

### 7. Focal Point Adjustments
If an image crops unexpectedly, set `objectPosition`:
- `"center"` (default)
- `"top"` (ideal for portrait headshots)
- `"center 20%"`

---

## 💻 How to Run Locally

You can run this website on any computer:

### Option A: Using Python (Recommended)
Open a terminal in this project folder and run:
```bash
python -m http.server 8000
```
Then open your browser at:
```
http://localhost:8000
```

### Option B: Using Node.js
```bash
npx serve .
```

### Option C: Direct File Opening
You can double-click `index.html` to open it in Chrome, Safari, Edge, or Firefox. (Using a local server like Option A is recommended for smooth ES module loading).

---

## 🚀 How to Deploy on Netlify (Free Hosting in 1 Minute)

### Method 1: Netlify Drop (Fastest, No Git required)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the entire `DIDI` folder onto the page.
3. In 10 seconds, Netlify will generate a live URL (e.g., `https://little-world-for-hena.netlify.app`).
4. Share the link with Didi!

### Method 2: Via GitHub
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "A Little World For Hena"
   git branch -M main
   git remote add origin https://github.com/your-username/didi-birthday.git
   git push -u origin main
   ```
2. Log in to [Netlify](https://www.netlify.com/), click **Add new site** → **Import an existing project** → **GitHub**.
3. Select your repository.
4. Leave build command empty and publish directory as `./` or empty.
5. Click **Deploy Site**.

---

## 🎨 Creative Architecture

- **HTML5 & Vanilla CSS3**: No Tailwind or external frameworks required. Highly optimized and responsive.
- **Vanilla JavaScript (ES Modules)**: Modular structure (`cake.js`, `memory-wall.js`, `memory-game.js`, `letter.js`, `photos.js`, `audio.js`, `confetti.js`).
- **Web Audio API**: Real-time synthesized audio effects (candle chime, flame breath, card snap, victory fanfare, envelope slide) without external mp3 downloads. Includes a toggleable sound button in the top navigation.
- **Zero-Dependency Confetti Canvas Engine**: 60fps high-performance celebratory bursts.
- **Full Mobile Responsiveness**: Works seamlessly across iPhones, Android devices, tablets, laptops, and large screens.
- **Accessibility**: ARIA labels, semantic markup, focus traps in modals, keyboard shortcuts (Esc, arrow keys), and respects `prefers-reduced-motion`.

---

**PROJECT CREDIT:**  
*Created with love by Raj Choudhury for Hena. ❤️*

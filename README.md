# 📷 CozyCam

> A modern, vintage-inspired photo booth web app with beautiful film filters and instant collage generation.

![CozyCam Banner](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📸 Camera Capture
- **Live camera feed** with square 1:1 aspect ratio
- **Countdown timer** with visual flash effect
- **Pause/Resume** functionality during capture sessions
- **Multiple photo layouts**: 3, 4, 6, or 8 photos per session
- **Bright camera flash** animation for authentic photo booth feel

### 🎨 Vintage Film Filters
8 carefully crafted film-inspired filters with authentic grain and vignette effects:

- **Original** - Clean, unfiltered look
- **Dramatic Warm** - Sunset tones with warm nostalgic feel
- **Old Film** - Faded 1970s print aesthetic
- **Soft Photobooth B&W** - Black-and-white with cool-blue tint
- **Film Flash Strip** - Direct-flash camera look with center glow
- **Studio Contact Sheet** - Retro beige/sepia scan style
- **Disposable Camera 1998** - Late-90s yellow-green cast
- **Everyday Film** - Natural real-film warmth
- **Moody Elevator Film** - Cinematic with green shadows

### 🖼️ Collage Customization
- **3 Layout Options**:
  - Classic Strip (vertical photo strip)
  - Grid 2×2 (square grid)
  - Grid 3×1 (horizontal panorama)
- **8 Frame Colors**: From classic black to soft pastels
- **LED-Style Timestamps** on each photo
- **Preserve original quality** - Square 1:1 ratio maintained

### 🔄 Interactive Preview
- **Swipe between photos** to preview filters on all captures
- **Touch-friendly navigation** with arrow buttons
- **Live filter preview** with CSS filters
- **Real-time collage generation** with Canvas API

### 💾 Export & Share
- **High-quality JPEG download** (0.95 quality)
- **Instant collage generation** with all effects baked in
- **Film grain overlay** applied to final export
- **Mobile-optimized** for easy sharing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cozycam.git
cd cozycam
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

1. **Start Session** - Click "Start Photobooth" on the landing page
2. **Choose Layout** - Select 3, 4, 6, or 8 photos
3. **Capture Photos** - Smile! The countdown will guide you
4. **Pick Filter** - Swipe through your photos and choose a vintage filter
5. **Customize** - Select layout style and frame color
6. **Download** - Save your collage and share with friends!

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Canvas API**: For image processing and collage generation
- **Context API**: For global state management
- **Media Capture**: WebRTC getUserMedia API

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page
│   ├── capture/           # Camera capture flow
│   ├── filters/           # Filter selection with preview
│   ├── collage/           # Layout & color customization
│   └── download/          # Final collage download
├── config/
│   └── filters.ts         # Filter definitions with CSS values
├── context/
│   └── PhotoContext.tsx   # Global state management
└── utils/
    ├── canvasFilters.ts   # Grain & vignette utilities
    └── collageLayouts.ts  # Layout generation logic
```

## 🎨 Filter Technical Details

Each filter includes:
- **CSS filter stack** for real-time preview
- **Grain intensity** (0.0 - 0.5) applied via Canvas
- **Vignette strength** (0.0 - 0.5) radial gradient overlay
- **Exact color grading** matching film stock characteristics

Filters are applied in two stages:
1. **Preview**: CSS filters for instant visual feedback
2. **Export**: Canvas-based rendering with grain overlay

## 🌟 Key Features Implementation

### Camera Flash Effect
```css
@keyframes flash {
  0% { opacity: 0; filter: brightness(1); }
  50% { opacity: 1; filter: brightness(5); }
  100% { opacity: 0; filter: brightness(1); }
}
```

### Square Crop
Images are captured from the center of the video feed and cropped to 1:1 aspect ratio, ensuring consistent dimensions across all layouts.

### Swipe Navigation
Touch events detect horizontal swipes (50px threshold) to navigate between photos in the filter preview.

## 🎭 Design Philosophy

CozyCam embraces **vintage film aesthetics** while providing a modern, intuitive user experience:

- **Pink gradient theme** - Playful and welcoming
- **Glass-morphism UI** - Subtle depth and elegance  
- **Smooth animations** - Delightful micro-interactions
- **Mobile-first** - Touch-optimized for modern devices

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 💖 Credits

**Made with ❤️ by Kush**

Special thanks to:
- Film photography community for filter inspiration
- Next.js team for the amazing framework
- Vercel for hosting and deployment

---

**Enjoy creating memories with CozyCam! 📸✨**

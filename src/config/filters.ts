export interface PhotoFilter {
  id: string;
  name: string;
  description: string;
  css: string;
  grainIntensity: number;
  vignetteStrength: number;
}

export const FILTERS: PhotoFilter[] = [
  {
    id: 'none',
    name: 'Original',
    description: 'Clean, unfiltered photo',
    css: '',
    grainIntensity: 0,
    vignetteStrength: 0,
  },
  {
    id: 'dramatic-warm',
    name: 'Dramatic Warm',
    description: 'Warm nostalgic look with sunset tones',
    css: 'contrast(0.9) brightness(0.98) sepia(0.55) saturate(0.95) hue-rotate(-8deg)',
    grainIntensity: 0.32,
    vignetteStrength: 0.32,
  },
  {
    id: 'old-film',
    name: 'Old Film',
    description: 'Faded 1970s print, washed-out and soft',
    css: 'contrast(0.78) brightness(1.08) saturate(0.75) sepia(0.5)',
    grainIntensity: 0.38,
    vignetteStrength: 0.28,
  },
  {
    id: 'soft-photobooth-bw',
    name: 'Soft Photobooth B&W',
    description: 'Black-and-white, soft contrast, slightly cool-blue tint',
    css: 'grayscale(1) brightness(1.02) contrast(0.88) sepia(0.1) hue-rotate(6deg)',
    grainIntensity: 0.28,
    vignetteStrength: 0.28,
  },
  {
    id: 'film-flash-strip',
    name: 'Film Flash Strip',
    description: 'Film camera direct-flash with center glow',
    css: 'contrast(0.92) brightness(1.05) saturate(0.9) sepia(0.2)',
    grainIntensity: 0.30,
    vignetteStrength: 0.35,
  },
  {
    id: 'studio-contact-sheet',
    name: 'Studio Contact Sheet',
    description: 'Retro contact sheet scan, beige/sepia tint',
    css: 'contrast(0.8) brightness(1.04) saturate(0.82) sepia(0.55) hue-rotate(-4deg)',
    grainIntensity: 0.40,
    vignetteStrength: 0.22,
  },
  {
    id: 'disposable-camera-1998',
    name: 'Disposable Camera 1998',
    description: 'Late-90s disposable camera, yellow-green cast',
    css: 'contrast(0.84) brightness(1.06) saturate(0.9) sepia(0.45) hue-rotate(-10deg)',
    grainIntensity: 0.42,
    vignetteStrength: 0.18,
  },
  {
    id: 'everyday-film',
    name: 'Everyday Film',
    description: 'Natural real-film feel, warm and gentle',
    css: 'contrast(0.9) brightness(1.02) saturate(0.95) sepia(0.25) hue-rotate(-6deg)',
    grainIntensity: 0.32,
    vignetteStrength: 0.14,
  },
  {
    id: 'moody-elevator-film',
    name: 'Moody Elevator Film',
    description: 'Cinematic, slightly green shadows, lifted blacks',
    css: 'contrast(0.88) brightness(0.95) saturate(0.85) sepia(0.3) hue-rotate(14deg)',
    grainIntensity: 0.40,
    vignetteStrength: 0.36,
  },
];

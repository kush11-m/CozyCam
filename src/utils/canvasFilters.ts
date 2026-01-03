import { PhotoFilter } from '@/config/filters';

/**
 * Apply CSS filter effects to canvas context
 * This translates CSS filter string into canvas operations
 */
export function applyCSSFilterToCanvas(
  ctx: CanvasRenderingContext2D,
  filterCSS: string
): void {
  ctx.filter = filterCSS || 'none';
}

/**
 * Apply film grain effect to canvas
 * Creates a realistic film grain by adding random noise pixels
 */
export function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  if (intensity === 0) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Add grain to each pixel
  for (let i = 0; i < data.length; i += 4) {
    // Random noise value between -intensity and +intensity
    const noise = (Math.random() - 0.5) * intensity * 255;
    
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
    // Don't modify alpha (i + 3)
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply vignette effect to canvas
 * Creates a soft darkening around the edges
 * Supports inverted vignette (brighter edges) with negative strength values
 */
export function applyVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number
): void {
  if (strength === 0) return;

  // Create radial gradient from center
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.sqrt(centerX * centerX + centerY * centerY);

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.3,
    centerX,
    centerY,
    radius
  );

  // Support inverted vignette for Film Burn effect (negative strength)
  const isInverted = strength < 0;
  const absStrength = Math.abs(strength);

  if (isInverted) {
    // Inverted: darker center, brighter edges (light leak effect)
    gradient.addColorStop(0, `rgba(255, 255, 255, ${absStrength * 0.3})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${absStrength * 0.15})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
  } else {
    // Normal: transparent center, dark edges
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${absStrength * 0.2})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${absStrength})`);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Apply complete filter with effects to an image on canvas
 * This is the main function to use when rendering filtered images
 */
export function applyCompleteFilter(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  filter: PhotoFilter
): void {
  // 1. Apply CSS filter and draw image
  applyCSSFilterToCanvas(ctx, filter.css);
  ctx.drawImage(image, x, y, width, height);
  
  // 2. Reset filter for effects
  ctx.filter = 'none';
  
  // 3. Apply grain
  applyGrain(ctx, width, height, filter.grainIntensity);
  
  // 4. Apply vignette
  applyVignette(ctx, width, height, filter.vignetteStrength);
}

/**
 * Parse CSS filter string and apply individual operations
 * Alternative approach for more precise control
 */
export function parseCSSFilter(filterString: string): Map<string, number> {
  const filters = new Map<string, number>();
  
  if (!filterString) return filters;
  
  // Match patterns like: contrast(0.9) brightness(1.1) etc.
  const regex = /(\w+)\(([^)]+)\)/g;
  let match;
  
  while ((match = regex.exec(filterString)) !== null) {
    const [, name, value] = match;
    filters.set(name, parseFloat(value));
  }
  
  return filters;
}

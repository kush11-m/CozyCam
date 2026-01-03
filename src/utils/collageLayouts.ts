import { CollageLayout } from '@/context/PhotoContext';
import { PhotoFilter } from '@/config/filters';
import { applyVignette } from './canvasFilters';

interface LayoutConfig {
  width: number;
  height: number;
  positions: { x: number; y: number; width: number; height: number }[];
}

export function getLayoutConfig(
  layout: CollageLayout,
  imageCount: number,
  images: HTMLImageElement[]
): LayoutConfig {
  const firstImg = images[0];
  const aspectRatio = firstImg.width / firstImg.height;

  switch (layout) {
    case 'classic-strip':
      return getClassicStripLayout(imageCount, aspectRatio);
    case 'grid-2x2':
      return getGridLayout(imageCount, 2); // 2 columns
    case 'grid-2x3':
      return getGridLayout(imageCount, 2); // 2 columns (will result in 3 rows for 6 items)
    case 'grid-2x4':
      return getGridLayout(imageCount, 2); // 2 columns (will result in 4 rows for 8 items)
    case 'grid-3x1':
      return getGrid3x1Layout(imageCount);
    default:
      return getClassicStripLayout(imageCount, aspectRatio);
  }
}

function getClassicStripLayout(count: number, aspectRatio: number): LayoutConfig {
  // Use square 1:1 ratio
  const PHOTO_SIZE = 480;  // Square photos (reduced from 560)
  const PADDING_SIDE = 80;
  const PADDING_TOP = 40;
  const GAP = 60;  // Increased from 45
  const BOTTOM_SPACE = 120;

  const STRIP_WIDTH = PHOTO_SIZE + (PADDING_SIDE * 2);
  const STRIP_HEIGHT = PADDING_TOP + (PHOTO_SIZE * count) + (GAP * (count - 1)) + BOTTOM_SPACE + GAP;

  const positions = [];
  const x = PADDING_SIDE;

  for (let i = 0; i < count; i++) {
    const y = PADDING_TOP + i * (PHOTO_SIZE + GAP);
    positions.push({ x, y, width: PHOTO_SIZE, height: PHOTO_SIZE });
  }

  return { width: STRIP_WIDTH, height: STRIP_HEIGHT, positions };
}

function getGridLayout(count: number, columns: number): LayoutConfig {
  const PHOTO_SIZE = 480;
  const GAP = 60;
  const PADDING = 60;
  const BOTTOM_SPACE = 100;

  const rows = Math.ceil(count / columns);

  const CANVAS_WIDTH = PADDING * 2 + (PHOTO_SIZE * columns) + (GAP * (columns - 1));
  const CANVAS_HEIGHT = PADDING + (PHOTO_SIZE * rows) + (GAP * (rows - 1)) + BOTTOM_SPACE;

  const positions = [];
  const startX = PADDING;
  const startY = PADDING;

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;
    positions.push({
      x: startX + col * (PHOTO_SIZE + GAP),
      y: startY + row * (PHOTO_SIZE + GAP),
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
    });
  }

  return { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, positions };
}

function getGrid3x1Layout(count: number): LayoutConfig {
  // Use square 1:1 ratio
  const PHOTO_SIZE = 480;  // Square photos (reduced from 560)
  const GAP = 60;  // Increased from 45
  const PADDING = 60;
  const BOTTOM_SPACE = 100;

  const CANVAS_WIDTH = PADDING * 2 + (PHOTO_SIZE * 3) + (GAP * 2);
  const CANVAS_HEIGHT = PADDING + PHOTO_SIZE + BOTTOM_SPACE;

  const positions = [];
  const startX = PADDING;
  const startY = PADDING;

  for (let i = 0; i < Math.min(count, 3); i++) {
    positions.push({
      x: startX + i * (PHOTO_SIZE + GAP),
      y: startY,
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
    });
  }

  return { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, positions };
}

export function drawCollage(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  layout: CollageLayout,
  frameColor: string,
  filter: PhotoFilter
): void {
  const config = getLayoutConfig(layout, images.length, images);

  // Set canvas size
  ctx.canvas.width = config.width;
  ctx.canvas.height = config.height;

  // Draw background/frame
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, config.width, config.height);

  // Apply filter
  ctx.filter = filter.css || 'none';

  // Draw images
  images.forEach((img, i) => {
    if (i < config.positions.length) {
      const pos = config.positions[i];

      // For polaroid layout, draw white frame
      if (layout === 'polaroid-stack') {
        ctx.filter = 'none';
        ctx.fillStyle = '#ffffff';
        const padding = 15;
        const bottomPadding = 60;
        ctx.fillRect(
          pos.x - padding,
          pos.y - padding,
          pos.width + padding * 2,
          pos.height + padding + bottomPadding
        );
        ctx.filter = filter.css || 'none';
      }

      // For filmstrip, draw sprocket holes
      if (layout === 'filmstrip') {
        ctx.filter = 'none';
        drawFilmSprockets(ctx, pos.y, pos.height, config.width);
        ctx.filter = filter.css || 'none';
      }

      ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);

      // Reset filter for timestamp
      ctx.filter = 'none';

      // Draw timestamp on each photo
      drawTimestamp(ctx, pos, i);

      // Restore filter for next image
      ctx.filter = filter.css || 'none';
    }
  });

  // Reset filter
  ctx.filter = 'none';

  // Draw branding
  drawBranding(ctx, config.width, config.height, layout);
}

function drawTimestamp(
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number; width: number; height: number },
  photoIndex: number
): void {
  const now = new Date();

  // Add seconds based on photo index to simulate different capture times
  const captureTime = new Date(now.getTime() + (photoIndex * 3000));

  // Format: DD MM YY or HH MM SS style
  const day = String(captureTime.getDate()).padStart(2, '0');
  const month = String(captureTime.getMonth() + 1).padStart(2, '0');
  const year = String(captureTime.getFullYear()).slice(-2);
  const timestamp = `${day} ${month} ${year}`;

  // Position at bottom right of each photo
  const x = position.x + position.width - 10;
  const y = position.y + position.height - 10;

  // Draw LED-style text with glow effect
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.font = 'bold 24px "Courier New", monospace';

  // Outer glow
  ctx.shadowColor = '#ff8800';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#ff8800';
  ctx.fillText(timestamp, x - 5, y - 4);

  // Inner bright text
  ctx.shadowBlur = 4;
  ctx.fillStyle = '#ffaa33';
  ctx.fillText(timestamp, x - 5, y - 4);

  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

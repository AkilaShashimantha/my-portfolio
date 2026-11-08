const fs = require("fs");
const path = require("path");

// 32x32 icon pixel generator
const width = 32;
const height = 32;

// RGBA grid: [y][x] = [r, g, b, a]
const grid = Array.from({ length: height }, () =>
  Array.from({ length: width }, () => [0, 0, 0, 0])
);

// Colors
const INK = [0x16, 0x16, 0x15, 0xff];
const PAPER = [0xf6, 0xf4, 0xf0, 0xff];
const TERRACOTTA = [0xc8, 0x4b, 0x31, 0xff];

// Fill rounded rect in grid
const radius = 6;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    // Check corner distance
    let inside = true;
    if (x < radius && y < radius) {
      inside = Math.hypot(x - radius, y - radius) <= radius;
    } else if (x >= width - radius && y < radius) {
      inside = Math.hypot(x - (width - 1 - radius), y - radius) <= radius;
    } else if (x < radius && y >= height - radius) {
      inside = Math.hypot(x - radius, y - (height - 1 - radius)) <= radius;
    } else if (x >= width - radius && y >= height - radius) {
      inside = Math.hypot(x - (width - 1 - radius), y - (height - 1 - radius)) <= radius;
    }

    if (inside) {
      grid[y][x] = [...INK];
    }
  }
}

// Draw Serif "A" in center (around x: 8 to 22, y: 6 to 25)
// Simple rasterized crisp "A"
const A_BITMAP = [
  "   ######   ",
  "   ######   ",
  "  ###  ###  ",
  "  ###  ###  ",
  " ####  #### ",
  " ####  #### ",
  " ####  #### ",
  "########### ",
  "########### ",
  "####   #### ",
  "####   #### ",
  "####   #### ",
  "####   #### ",
  "####   #### ",
  "####   #### ",
  "####   #### ",
];

const startX = 10;
const startY = 7;
for (let r = 0; r < A_BITMAP.length; r++) {
  const line = A_BITMAP[r];
  for (let c = 0; c < line.length; c++) {
    if (line[c] === "#") {
      const px = startX + c;
      const py = startY + r;
      if (px >= 0 && px < width && py >= 0 && py < height) {
        grid[py][px] = [...PAPER];
      }
    }
  }
}

// Draw Terracotta dot at bottom right (x: 24..27, y: 23..26)
for (let dy = -2; dy <= 2; dy++) {
  for (let dx = -2; dx <= 2; dx++) {
    if (Math.hypot(dx, dy) <= 2.2) {
      const px = 25 + dx;
      const py = 24 + dy;
      if (px >= 0 && px < width && py >= 0 && py < height) {
        grid[py][px] = [...TERRACOTTA];
      }
    }
  }
}

// Build ICO binary buffer
const xorSize = width * height * 4;
const andRowSize = Math.floor((width + 31) / 32) * 4; // 4 bytes per row
const andSize = andRowSize * height;
const bmpHeaderSize = 40;
const imageSize = bmpHeaderSize + xorSize + andSize;

const totalSize = 6 + 16 + imageSize;
const buf = Buffer.alloc(totalSize);

// 1. ICONDIR
buf.writeUInt16LE(0, 0); // reserved
buf.writeUInt16LE(1, 2); // 1 = icon
buf.writeUInt16LE(1, 4); // 1 image

// 2. ICONDIRENTRY
buf.writeUInt8(width, 6); // width
buf.writeUInt8(height, 7); // height
buf.writeUInt8(0, 8); // color count
buf.writeUInt8(0, 9); // reserved
buf.writeUInt16LE(1, 10); // color planes
buf.writeUInt16LE(32, 12); // bits per pixel
buf.writeUInt32LE(imageSize, 14); // image data size
buf.writeUInt32LE(22, 18); // offset of image data

// 3. BITMAPINFOHEADER (offset 22)
let offset = 22;
buf.writeUInt32LE(bmpHeaderSize, offset); // biSize
buf.writeInt32LE(width, offset + 4); // biWidth
buf.writeInt32LE(height * 2, offset + 8); // biHeight (doubled for mask)
buf.writeUInt16LE(1, offset + 12); // biPlanes
buf.writeUInt16LE(32, offset + 14); // biBitCount
buf.writeUInt32LE(0, offset + 16); // biCompression = BI_RGB
buf.writeUInt32LE(xorSize + andSize, offset + 20); // biSizeImage
buf.writeInt32LE(0, offset + 24); // biXPelsPerMeter
buf.writeInt32LE(0, offset + 28); // biYPelsPerMeter
buf.writeUInt32LE(0, offset + 32); // biClrUsed
buf.writeUInt32LE(0, offset + 36); // biClrImportant
offset += bmpHeaderSize;

// 4. XOR Mask (pixels, bottom-up order, BGRA)
for (let y = height - 1; y >= 0; y--) {
  for (let x = 0; x < width; x++) {
    const [r, g, b, a] = grid[y][x];
    buf.writeUInt8(b, offset++);
    buf.writeUInt8(g, offset++);
    buf.writeUInt8(r, offset++);
    buf.writeUInt8(a, offset++);
  }
}

// 5. AND Mask (1 bit per pixel, bottom-up order: 0 = opaque, 1 = transparent)
for (let y = height - 1; y >= 0; y--) {
  let rowMask = 0;
  for (let x = 0; x < width; x++) {
    const a = grid[y][x][3];
    if (a < 128) {
      rowMask |= 1 << (7 - (x % 8));
    }
    if ((x + 1) % 8 === 0 || x === width - 1) {
      const byteIdx = Math.floor(x / 8);
      buf.writeUInt8(rowMask, offset + byteIdx);
      rowMask = 0;
    }
  }
  offset += andRowSize;
}

const outPath = path.join("D:", "Coding_Projects", "My_Portfolio", "public", "favicon.ico");
fs.writeFileSync(outPath, buf);
console.log("Successfully wrote favicon.ico to " + outPath + " (" + buf.length + " bytes)");

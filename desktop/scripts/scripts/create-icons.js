const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const svg = path.join(root, 'assets', 'icon.svg');
const build = path.join(root, 'build');
const icoSizes = [16, 32, 48, 256];

function makeBitmapIcoEntry({ width, height, rgba }) {
  const rowBytes = width * 4;
  const xorSize = rowBytes * height;
  const maskStride = Math.ceil(width / 32) * 4;
  const maskSize = maskStride * height;
  const dibSize = 40 + xorSize + maskSize;
  const dib = Buffer.alloc(dibSize);

  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(width, 4);
  dib.writeInt32LE(height * 2, 8);
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  dib.writeUInt32LE(0, 16);
  dib.writeUInt32LE(xorSize + maskSize, 20);
  dib.writeInt32LE(0, 24);
  dib.writeInt32LE(0, 28);
  dib.writeUInt32LE(0, 32);
  dib.writeUInt32LE(0, 36);

  let offset = 40;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      dib[offset++] = rgba[src + 2];
      dib[offset++] = rgba[src + 1];
      dib[offset++] = rgba[src];
      dib[offset++] = rgba[src + 3];
    }
  }

  return dib;
}

async function createIco() {
  const images = [];

  for (const size of icoSizes) {
    const { data, info } = await sharp(svg)
      .resize(size, size)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    images.push({
      width: info.width,
      height: info.height,
      dib: makeBitmapIcoEntry({ width: info.width, height: info.height, rgba: data })
    });
  }

  const headerSize = 6;
  const dirSize = images.length * 16;
  let imageOffset = headerSize + dirSize;
  const header = Buffer.alloc(headerSize + dirSize);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  images.forEach((image, index) => {
    const offset = headerSize + index * 16;
    header.writeUInt8(image.width === 256 ? 0 : image.width, offset);
    header.writeUInt8(image.height === 256 ? 0 : image.height, offset + 1);
    header.writeUInt8(0, offset + 2);
    header.writeUInt8(0, offset + 3);
    header.writeUInt16LE(1, offset + 4);
    header.writeUInt16LE(32, offset + 6);
    header.writeUInt32LE(image.dib.length, offset + 8);
    header.writeUInt32LE(imageOffset, offset + 12);
    imageOffset += image.dib.length;
  });

  return Buffer.concat([header, ...images.map((image) => image.dib)]);
}

async function run() {
  await fs.mkdir(build, { recursive: true });

  for (const size of icoSizes) {
    await sharp(svg).resize(size, size).png().toFile(path.join(build, `icon-${size}.png`));
  }

  await sharp(svg).resize(512, 512).png().toFile(path.join(build, 'icon.png'));
  await fs.writeFile(path.join(build, 'icon.ico'), await createIco());

  console.log('Iconos generados en desktop/build');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

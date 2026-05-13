const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const root = path.join(__dirname, '..');
const svg = path.join(root, 'assets', 'icon.svg');
const build = path.join(root, 'build');
const sizes = [16, 24, 32, 48, 64, 128, 256, 512];

async function run() {
  await fs.mkdir(build, { recursive: true });

  const pngs = [];
  for (const size of sizes) {
    const out = path.join(build, `icon-${size}.png`);
    await sharp(svg).resize(size, size).png().toFile(out);
    pngs.push(out);
  }

  await sharp(svg).resize(512, 512).png().toFile(path.join(build, 'icon.png'));
  const ico = await pngToIco(pngs);
  await fs.writeFile(path.join(build, 'icon.ico'), ico);

  console.log('Iconos generados en desktop/build');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

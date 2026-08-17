const fs = require('fs');
const path = require('path');

const apps = [
  { id: 'korlen', url: 'https://play.google.com/store/apps/details?id=com.mdsoft.korlen&hl=en', name: 'KORLEN' },
  { id: 'tok_tok_taxi_user', url: 'https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_user&hl=en', name: 'Tok Tok Taxi User' },
  { id: 'tok_tok_taxi_driver', url: 'https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_drivers&hl=en', name: 'Tok Tok Taxi Driver' },
  { id: 'tok_tok_taxi_agent', url: 'https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_agent&hl=en', name: 'Tok Tok Taxi Agent' },
  { id: 'gbghadir', url: 'https://play.google.com/store/apps/details?id=com.mdsoft.gbghadir&hl=en', name: 'Gb Ghadir' },
  { id: 'vanote', url: 'https://play.google.com/store/apps/details?id=com.mdsoft.vanotesclinic&hl=en', name: 'VA Note' },
  { id: 'taxi_beirut_customer', url: 'https://play.google.com/store/apps/details?id=com.taxi.md_soft.taxi_customer_app&hl=en', name: 'Taxi Beirut Customer' },
  { id: 'taxi_beirut_agent', url: 'https://play.google.com/store/apps/details?id=com.mdsoft.taxibeirutagent&hl=en', name: 'Taxi Beirut Agent' }
];

const imgDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message);
    return false;
  }
}

async function run() {
  const resultData = {};

  for (const app of apps) {
    console.log(`Fetching ${app.name}...`);
    try {
      const res = await fetch(app.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const html = await res.text();

      // Find icon (usually itemprop="image" or meta tag og:image or googleusercontent image)
      const ogImgMatch = html.match(/meta property="og:image" content="([^"]+)"/);
      let iconUrl = ogImgMatch ? ogImgMatch[1] : null;

      // Screenshot images on Google Play store are usually found in img tags with srcset or src matching play-lh.googleusercontent.com
      const imgMatches = [...html.matchAll(/(https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9_-]+)/g)].map(m => m[1]);
      const uniqueImgs = [...new Set(imgMatches)];

      resultData[app.id] = {
        name: app.name,
        iconUrl: iconUrl,
        allImages: uniqueImgs
      };

      // Download icon if present
      if (iconUrl) {
        const iconPath = path.join(imgDir, `${app.id}-icon.png`);
        await downloadFile(iconUrl, iconPath);
        resultData[app.id].localIcon = `assets/images/${app.id}-icon.png`;
      }

      // Download top screenshots (up to 4 per app)
      resultData[app.id].localScreenshots = [];
      let shotIdx = 1;
      for (const imgUrl of uniqueImgs) {
        // filter out small icons or duplicate paths if needed
        if (imgUrl === iconUrl) continue;
        const shotUrl = `${imgUrl}=w1024-h768-rw`; // high res format
        const shotPath = path.join(imgDir, `${app.id}-ss-${shotIdx}.png`);
        const ok = await downloadFile(shotUrl, shotPath);
        if (ok) {
          resultData[app.id].localScreenshots.push(`assets/images/${app.id}-ss-${shotIdx}.png`);
          shotIdx++;
          if (shotIdx > 4) break;
        }
      }

    } catch (e) {
      console.error(`Error scraping ${app.name}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'app_media.json'), JSON.stringify(resultData, null, 2));
  console.log('Finished scraping app media!');
}

run();

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BOOK_NAME_TO_ABBREV = {
  'genesis': 'GEN', 'exodus': 'EXO', 'leviticus': 'LEV', 'numbers': 'NUM',
  'deuteronomy': 'DEU', 'joshua': 'JOS', 'judges': 'JDG', 'ruth': 'RUT',
  '1 samuel': '1SA', '2 samuel': '2SA', '1 kings': '1KI', '2 kings': '2KI',
  '1 chronicles': '1CH', '2 chronicles': '2CH', 'ezra': 'EZR', 'nehemiah': 'NEH',
  'esther': 'EST', 'job': 'JOB', 'psalms': 'PSA', 'proverbs': 'PRO',
  'ecclesiastes': 'ECC', 'song of solomon': 'SOS', 'isaiah': 'ISA', 'jeremiah': 'JER',
  'lamentations': 'LAM', 'ezekiel': 'EZE', 'daniel': 'DAN', 'hosea': 'HOS',
  'joel': 'JOE', 'amos': 'AMO', 'obadiah': 'OBA', 'jonah': 'JON',
  'micah': 'MIC', 'nahum': 'NAH', 'habakkuk': 'HAB', 'zephaniah': 'ZEP',
  'haggai': 'HAG', 'zechariah': 'ZEC', 'malachi': 'MAL', 'matthew': 'MAT',
  'mark': 'MRK', 'luke': 'LUK', 'john': 'JHN', 'acts': 'ACT', 'romans': 'ROM',
  '1 corinthians': '1CO', '2 corinthians': '2CO', 'galatians': 'GAL',
  'ephesians': 'EPH', 'philippians': 'PHP', 'colossians': 'COL',
  '1 thessalonians': '1TH', '2 thessalonians': '2TH', '1 timothy': '1TI',
  '2 timothy': '2TI', 'titus': 'TIT', 'philemon': 'PHM', 'hebrews': 'HEB',
  'james': 'JAS', '1 peter': '1PE', '2 peter': '2PE', '1 john': '1JN',
  '2 john': '2JN', '3 john': '3JN', 'jude': 'JDE', 'revelation': 'REV',
  // Roman numeral mappings from ESV.json
  'i samuel': '1SA', 'ii samuel': '2SA', 'i kings': '1KI', 'ii kings': '2KI',
  'i chronicles': '1CH', 'ii chronicles': '2CH', 'i corinthians': '1CO', 'ii corinthians': '2CO',
  'i thessalonians': '1TH', 'ii thessalonians': '2TH', 'i timothy': '1TI', 'ii timothy': '2TI',
  'i peter': '1PE', 'ii peter': '2PE', 'i john': '1JN', 'ii john': '2JN', 'iii john': '3JN',
  'revelation of john': 'REV'
};

async function processEsv() {
  const sourcePath = join(__dirname, 'mdbible/json/ESV.json');
  const targetPath = join(__dirname, '../../public/data/bibles/esv.json');

  console.log(`Reading source ESV.json from ${sourcePath}...`);
  const rawData = readFileSync(sourcePath, 'utf8');
  const esvJson = JSON.parse(rawData);

  const esvData = {
    version: 'ESV',
    books: {}
  };

  console.log('Compiling ESV text data...');
  let totalChapters = 0;
  let totalVerses = 0;

  for (const [bookName, chaptersArray] of Object.entries(esvJson.books)) {
    const abbrev = BOOK_NAME_TO_ABBREV[bookName.toLowerCase()];
    if (!abbrev) {
      console.warn(`⚠️ Unknown book name: ${bookName}`);
      continue;
    }

    esvData.books[abbrev] = {
      name: bookName,
      abbrev: abbrev,
      chapters: {}
    };

    const bookChapters = chaptersArray;
    bookChapters.forEach((versesArray, chIdx) => {
      const chapterNum = chIdx + 1;
      esvData.books[abbrev].chapters[chapterNum] = {};
      totalChapters++;

      versesArray.forEach((wordArrays, vIdx) => {
        const verseNum = vIdx + 1;
        totalVerses++;

        // Clean and join words
        let text = wordArrays
          .map(w => w[0])
          .join(' ')
          // Standard punctuation & typography cleanups
          .replace(/\s+([.,;:!?])/g, '$1')
          .replace(/\s+(’s)\b/g, "$1")
          .replace(/\b(’)\s+/g, "$1")
          .replace(/\b\s+(’)\b/g, "$1")
          .replace(/\s+(’)\b/g, "$1")
          .replace(/\( /g, '(')
          .replace(/ \)/g, ')')
          .replace(/“\s+/g, '“')
          .replace(/\s+”/g, '”')
          .replace(/\s+—\s+/g, '—')
          .replace(/\s+-\s+/g, '-')
          .trim();

        esvData.books[abbrev].chapters[chapterNum][verseNum] = text;
      });
    });
  }

  console.log(`Saving compiled ESV to ${targetPath}...`);
  writeFileSync(targetPath, JSON.stringify(esvData), 'utf8');
  console.log(`🎉 Compile complete! Processed ${Object.keys(esvData.books).length} books, ${totalChapters} chapters, ${totalVerses} verses.`);
}

processEsv().catch(console.error);

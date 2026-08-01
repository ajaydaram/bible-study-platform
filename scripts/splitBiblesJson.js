import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const biblesJsonPath = path.join(__dirname, '../bibles.json')
const outputDir = path.join(__dirname, '../public/data/bibles')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('Reading bibles.json...')
const rawData = fs.readFileSync(biblesJsonPath, 'utf8')
const records = JSON.parse(rawData)

// Extract header keys (translations)
const metadataHeader = records[0]
const translations = Object.keys(metadataHeader)

console.log('Detected translations:', translations)

// Standard book name to 3-letter abbreviation map
const BOOK_ABBREVIATIONS = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
  'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
  '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
  'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
  'Psalm': 'PSA', 'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SOS',
  'Song of Songs': 'SOS', 'Isaiah': 'ISA', 'Jeremiah': 'JER', 'Lamentations': 'LAM',
  'Ezekiel': 'EZE', 'Daniel': 'DAN', 'Hosea': 'HOS', 'Joel': 'JOE', 'Amos': 'AMO',
  'Obadiah': 'OBA', 'Jonah': 'JON', 'Micah': 'MIC', 'Nahum': 'NAH', 'Habakkuk': 'HAB',
  'Zephaniah': 'ZEP', 'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL',
  'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT',
  'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO', 'Galatians': 'GAL',
  'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL', '1 Thessalonians': '1TH',
  '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI', 'Titus': 'TIT',
  'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE',
  '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JDE', 'Revelation': 'REV'
}

// Build translation structures
const translationData = {}
translations.forEach(trKey => {
  const cleanId = trKey.toLowerCase().replace(/[^a-z0-9]/g, '')
  translationData[trKey] = {
    version: cleanId.toUpperCase(),
    books: {}
  }
})

// Iterate verses (skip header at index 0)
for (let i = 1; i < records.length; i++) {
  const row = records[i]
  const verseRef = row['__EMPTY'] // e.g. "Genesis 1:1"
  if (!verseRef) continue

  const lastSpaceIdx = verseRef.lastIndexOf(' ')
  if (lastSpaceIdx === -1) continue

  const bookName = verseRef.substring(0, lastSpaceIdx).trim()
  const chapterVerse = verseRef.substring(lastSpaceIdx + 1).trim()
  const [chapStr, verseStr] = chapterVerse.split(':')
  if (!chapStr || !verseStr) continue

  const chapter = parseInt(chapStr, 10)
  const verse = parseInt(verseStr, 10)
  const abbrev = BOOK_ABBREVIATIONS[bookName] || bookName.substring(0, 3).toUpperCase()

  translations.forEach(trKey => {
    const verseText = row[trKey]
    if (!verseText) return

    const tObj = translationData[trKey]
    if (!tObj.books[abbrev]) {
      tObj.books[abbrev] = {
        name: bookName,
        abbrev,
        chapters: {}
      }
    }

    if (!tObj.books[abbrev].chapters[chapter]) {
      tObj.books[abbrev].chapters[chapter] = {}
    }

    tObj.books[abbrev].chapters[chapter][verse] = verseText.trim()
  })
}

// Save output files
translations.forEach(trKey => {
  const cleanId = trKey.toLowerCase().replace(/[^a-z0-9]/g, '')
  const fileName = `${cleanId}.json`
  const filePath = path.join(outputDir, fileName)

  console.log(`Writing ${fileName}...`)
  fs.writeFileSync(filePath, JSON.stringify(translationData[trKey]))
})

console.log('Processing complete!')

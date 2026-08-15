// Original Language Vocabulary & Frequency Dataset
// Top Greek & Hebrew words with frequencies, transliterations, and exegetical insights

export interface VocabCard {
  id: string
  language: 'hebrew' | 'greek'
  strongs: string
  word: string
  transliteration: string
  pronunciation: string
  partOfSpeech: string
  gloss: string
  occurrences: number
  category: 'frequency' | 'theological' | 'verbs' | 'nouns'
  distribution: {
    pentateuchOrGospels: number
    historyOrActs: number
    poetryOrPauline: number
    prophetsOrGeneral: number
  }
  theologicalNote: string
  keyVerseRef: string
}

export const GREEK_VOCAB_DECK: VocabCard[] = [
  {
    id: 'g2316',
    language: 'greek',
    strongs: 'G2316',
    word: 'θεός',
    transliteration: 'theos',
    pronunciation: 'theh-OS',
    partOfSpeech: 'Noun (Masculine)',
    gloss: 'God, deity, the one true God',
    occurrences: 1317,
    category: 'frequency',
    distribution: {
      pentateuchOrGospels: 420,
      historyOrActs: 165,
      poetryOrPauline: 548,
      prophetsOrGeneral: 184
    },
    theologicalNote: 'Used throughout the Septuagint and New Testament for the sovereign Creator, covenant Father, and Supreme Sovereign.',
    keyVerseRef: 'John 1:1'
  },
  {
    id: 'g2962',
    language: 'greek',
    strongs: 'G2962',
    word: 'κύριος',
    transliteration: 'kyrios',
    pronunciation: 'KOO-ree-os',
    partOfSpeech: 'Noun (Masculine)',
    gloss: 'Lord, Master, Yahweh (in LXX quotes)',
    occurrences: 717,
    category: 'frequency',
    distribution: {
      pentateuchOrGospels: 220,
      historyOrActs: 110,
      poetryOrPauline: 275,
      prophetsOrGeneral: 112
    },
    theologicalNote: 'The supreme title applied to Jesus in the NT, identifying Him as the Yahweh of the Hebrew Scriptures.',
    keyVerseRef: 'Romans 10:9'
  },
  {
    id: 'g3056',
    language: 'greek',
    strongs: 'G3056',
    word: 'λόγος',
    transliteration: 'logos',
    pronunciation: 'LAH-gos',
    partOfSpeech: 'Noun (Masculine)',
    gloss: 'Word, message, divine reason, divine expression',
    occurrences: 330,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 135,
      historyOrActs: 65,
      poetryOrPauline: 85,
      prophetsOrGeneral: 45
    },
    theologicalNote: 'In John 1:1, logos defines the eternal, uncreated Second Person of the Trinity incarnate in Jesus Christ.',
    keyVerseRef: 'John 1:14'
  },
  {
    id: 'g4102',
    language: 'greek',
    strongs: 'G4102',
    word: 'πίστις',
    transliteration: 'pistis',
    pronunciation: 'PIS-tis',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Faith, belief, trust, faithfulness',
    occurrences: 243,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 38,
      historyOrActs: 16,
      poetryOrPauline: 142,
      prophetsOrGeneral: 47
    },
    theologicalNote: 'Not mere intellectual assent, but personal self-surrender and reliance upon Christ as the sole instrument of justification.',
    keyVerseRef: 'Ephesians 2:8-9'
  },
  {
    id: 'g0026',
    language: 'greek',
    strongs: 'G0026',
    word: 'ἀγάπη',
    transliteration: 'agape',
    pronunciation: 'ah-GAH-pay',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Unconditional covenant love, benevolence',
    occurrences: 116,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 9,
      historyOrActs: 0,
      poetryOrPauline: 75,
      prophetsOrGeneral: 32
    },
    theologicalNote: 'Self-sacrificial, non-merited love demonstrated decisively at Calvary (Rom 5:8; 1 John 4:8).',
    keyVerseRef: '1 Corinthians 13:13'
  },
  {
    id: 'g5485',
    language: 'greek',
    strongs: 'G5485',
    word: 'χάρις',
    transliteration: 'charis',
    pronunciation: 'KHAH-ris',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Grace, unmerited favor, kindness',
    occurrences: 155,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 12,
      historyOrActs: 17,
      poetryOrPauline: 100,
      prophetsOrGeneral: 26
    },
    theologicalNote: 'God’s free, unconstrained goodwill toward ill-deserving sinners providing salvation and sanctifying power.',
    keyVerseRef: 'Titus 2:11'
  },
  {
    id: 'g4151',
    language: 'greek',
    strongs: 'G4151',
    word: 'πνεῦμα',
    transliteration: 'pneuma',
    pronunciation: 'PNEV-mah',
    partOfSpeech: 'Noun (Neuter)',
    gloss: 'Spirit, breath, wind, the Holy Spirit',
    occurrences: 379,
    category: 'frequency',
    distribution: {
      pentateuchOrGospels: 105,
      historyOrActs: 70,
      poetryOrPauline: 145,
      prophetsOrGeneral: 59
    },
    theologicalNote: 'The third person of the Triune Godhead who regenerates, indwells, seals, and sanctifies believers.',
    keyVerseRef: 'Romans 8:9'
  },
  {
    id: 'g1343',
    language: 'greek',
    strongs: 'G1343',
    word: 'δικαιοσύνη',
    transliteration: 'dikaiosyne',
    pronunciation: 'dih-kai-oh-SOO-nay',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Righteousness, justice, right-standing',
    occurrences: 92,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 10,
      historyOrActs: 4,
      poetryOrPauline: 58,
      prophetsOrGeneral: 20
    },
    theologicalNote: 'The perfect moral rectitude of God imputed to sinners through faith in the active and passive obedience of Jesus Christ.',
    keyVerseRef: '2 Corinthians 5:21'
  },
  {
    id: 'g2424',
    language: 'greek',
    strongs: 'G2424',
    word: 'Ἰησοῦς',
    transliteration: 'Iesous',
    pronunciation: 'ee-ay-SOOS',
    partOfSpeech: 'Proper Noun',
    gloss: 'Jesus, Joshua ("Yahweh is Salvation")',
    occurrences: 917,
    category: 'frequency',
    distribution: {
      pentateuchOrGospels: 605,
      historyOrActs: 68,
      poetryOrPauline: 185,
      prophetsOrGeneral: 59
    },
    theologicalNote: 'Given by the angel because "He shall save His people from their sins" (Matt 1:21).',
    keyVerseRef: 'Philippians 2:9-11'
  },
  {
    id: 'g5547',
    language: 'greek',
    strongs: 'G5547',
    word: 'Χριστός',
    transliteration: 'Christos',
    pronunciation: 'khris-TOS',
    partOfSpeech: 'Proper Noun / Adjective',
    gloss: 'Christ, the Anointed One, Messiah',
    occurrences: 529,
    category: 'frequency',
    distribution: {
      pentateuchOrGospels: 65,
      historyOrActs: 32,
      poetryOrPauline: 380,
      prophetsOrGeneral: 52
    },
    theologicalNote: 'Greek equivalent of the Hebrew Mashiach (Messiah), anointed as Prophet, Priest, and King.',
    keyVerseRef: 'Matthew 16:16'
  },
  {
    id: 'g0204',
    language: 'greek',
    strongs: 'G0204',
    word: 'ἀκροβυστία',
    transliteration: 'akrobystia',
    pronunciation: 'ah-kroh-boos-TEE-ah',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Uncircumcision, Gentile status',
    occurrences: 20,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 0,
      historyOrActs: 1,
      poetryOrPauline: 19,
      prophetsOrGeneral: 0
    },
    theologicalNote: 'Signifies the Gentiles once excluded but now brought near by the blood of Christ in the New Covenant.',
    keyVerseRef: 'Galatians 5:6'
  },
  {
    id: 'g2064',
    language: 'greek',
    strongs: 'G2064',
    word: 'ἔρχομαι',
    transliteration: 'erchomai',
    pronunciation: 'ER-khoh-my',
    partOfSpeech: 'Verb (Deponent)',
    gloss: 'To come, to go',
    occurrences: 632,
    category: 'verbs',
    distribution: {
      pentateuchOrGospels: 450,
      historyOrActs: 52,
      poetryOrPauline: 78,
      prophetsOrGeneral: 52
    },
    theologicalNote: 'Used frequently for the First and Second Advents of Christ.',
    keyVerseRef: 'Revelation 22:20'
  }
]

export const HEBREW_VOCAB_DECK: VocabCard[] = [
  {
    id: 'h0430',
    language: 'hebrew',
    strongs: 'H0430',
    word: 'אֱלֹהִים',
    transliteration: 'elohim',
    pronunciation: 'el-oh-HEEM',
    partOfSpeech: 'Noun (Masculine Plural)',
    gloss: 'God, Supreme God, judges',
    occurrences: 2602,
    category: 'frequency',
    distribution: {
      pentateuchOrGospels: 680,
      historyOrActs: 530,
      poetryOrPauline: 820,
      prophetsOrGeneral: 572
    },
    theologicalNote: 'Plural of majesty indicating infinite majesty, fullness of divine power, and triune nature in creation.',
    keyVerseRef: 'Genesis 1:1'
  },
  {
    id: 'h3068',
    language: 'hebrew',
    strongs: 'H3068',
    word: 'יְהוָה',
    transliteration: 'YHWH / Yahweh',
    pronunciation: 'yah-WEH (Adonai)',
    partOfSpeech: 'Proper Noun',
    gloss: 'The LORD, Yahweh, the Self-Existent Covenant God',
    occurrences: 6828,
    category: 'frequency',
    distribution: {
      pentateuchOrGospels: 1820,
      historyOrActs: 1750,
      poetryOrPauline: 1250,
      prophetsOrGeneral: 2008
    },
    theologicalNote: 'The sacred Tetragrammaton revealed in Exodus 3:14: "I AM WHO I AM", expressing unchangeable covenant fidelity.',
    keyVerseRef: 'Exodus 3:14'
  },
  {
    id: 'h2617',
    language: 'hebrew',
    strongs: 'H2617',
    word: 'חֶסֶד',
    transliteration: 'hesed',
    pronunciation: 'KHEH-sed',
    partOfSpeech: 'Noun (Masculine)',
    gloss: 'Steadfast covenant love, mercy, loyalty, lovingkindness',
    occurrences: 248,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 38,
      historyOrActs: 45,
      poetryOrPauline: 128,
      prophetsOrGeneral: 37
    },
    theologicalNote: 'The foundational Old Testament term for God’s unwavering, loyal covenant love that will never abandon His people.',
    keyVerseRef: 'Psalm 136:1'
  },
  {
    id: 'h7307',
    language: 'hebrew',
    strongs: 'H7307',
    word: 'רוּחַ',
    transliteration: 'ruach',
    pronunciation: 'ROO-akh',
    partOfSpeech: 'Noun (Feminine/Masculine)',
    gloss: 'Spirit, breath, wind',
    occurrences: 378,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 65,
      historyOrActs: 70,
      poetryOrPauline: 105,
      prophetsOrGeneral: 138
    },
    theologicalNote: 'The divine breath animating creation in Genesis 1:2 and regenerating human hearts in Ezekiel 36:26.',
    keyVerseRef: 'Ezekiel 37:9'
  },
  {
    id: 'h8451',
    language: 'hebrew',
    strongs: 'H8451',
    word: 'תּוֹרָה',
    transliteration: 'torah',
    pronunciation: 'toh-RAH',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Law, instruction, teaching, guidance',
    occurrences: 220,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 55,
      historyOrActs: 36,
      poetryOrPauline: 68,
      prophetsOrGeneral: 61
    },
    theologicalNote: 'Not mere legalism, but divine fatherly instruction and revealed covenant standard for flourishing under God.',
    keyVerseRef: 'Psalm 1:2'
  },
  {
    id: 'h7965',
    language: 'hebrew',
    strongs: 'H7965',
    word: 'שָׁלוֹם',
    transliteration: 'shalom',
    pronunciation: 'shah-LOHM',
    partOfSpeech: 'Noun (Masculine)',
    gloss: 'Peace, wholeness, completeness, welfare',
    occurrences: 237,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 32,
      historyOrActs: 65,
      poetryOrPauline: 48,
      prophetsOrGeneral: 92
    },
    theologicalNote: 'Total cosmic harmony and right-relationship with God, neighbor, and creation under messianic reign.',
    keyVerseRef: 'Isaiah 9:6'
  },
  {
    id: 'h1285',
    language: 'hebrew',
    strongs: 'H1285',
    word: 'בְּרִית',
    transliteration: 'berith',
    pronunciation: 'beh-REETH',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Covenant, solemn binding alliance',
    occurrences: 284,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 82,
      historyOrActs: 60,
      poetryOrPauline: 45,
      prophetsOrGeneral: 97
    },
    theologicalNote: 'The architectural framework of biblical theology: God binding Himself by oath to redeem a people.',
    keyVerseRef: 'Genesis 15:18'
  },
  {
    id: 'h1350',
    language: 'hebrew',
    strongs: 'H1350',
    word: 'גָּאַל',
    transliteration: 'ga’al',
    pronunciation: 'gah-AHL',
    partOfSpeech: 'Verb',
    gloss: 'To redeem, act as kinsman-redeemer',
    occurrences: 104,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 24,
      historyOrActs: 22,
      poetryOrPauline: 18,
      prophetsOrGeneral: 40
    },
    theologicalNote: 'The legal right of a near-kinsman to buy back enslaved family members or lost property (Boaz / Christ).',
    keyVerseRef: 'Ruth 4:14'
  },
  {
    id: 'h3722',
    language: 'hebrew',
    strongs: 'H3722',
    word: 'כָּפַר',
    transliteration: 'kaphar',
    pronunciation: 'kah-FAR',
    partOfSpeech: 'Verb (Piel)',
    gloss: 'To make atonement, expiate, cover sin',
    occurrences: 102,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 68,
      historyOrActs: 4,
      poetryOrPauline: 6,
      prophetsOrGeneral: 24
    },
    theologicalNote: 'The root of Yom Kippur (Day of Atonement) and Kapporeth (Mercy Seat); propitiating divine wrath through blood.',
    keyVerseRef: 'Leviticus 17:11'
  },
  {
    id: 'h6666',
    language: 'hebrew',
    strongs: 'H6666',
    word: 'צְדָקָה',
    transliteration: 'tsedaqah',
    pronunciation: 'tseh-dah-KAH',
    partOfSpeech: 'Noun (Feminine)',
    gloss: 'Righteousness, justice, moral integrity',
    occurrences: 157,
    category: 'theological',
    distribution: {
      pentateuchOrGospels: 18,
      historyOrActs: 15,
      poetryOrPauline: 52,
      prophetsOrGeneral: 72
    },
    theologicalNote: 'Living in accordance with God’s holy covenant character and defending the vulnerable.',
    keyVerseRef: 'Genesis 15:6'
  }
]

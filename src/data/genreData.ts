// Biblical Genre Data & Hermeneutical Rules Framework

export interface BiblicalGenre {
  id: string
  name: string
  icon: string
  accentColor: string
  description: string
  hermeneuticalRules: string[]
  keyPassages: { reference: string; title: string; focus: string }[]
  structuralQuestion: string
  literaryTraits: string[]
}

export const BIBLICAL_GENRES: BiblicalGenre[] = [
  {
    id: 'torah',
    name: 'Torah & Law',
    icon: '📜',
    accentColor: '#10B981',
    description: 'Covenant laws, moral ordinances, and civil regulations establishing Israel as God’s holy nation.',
    hermeneuticalRules: [
      'Interpret law within its Mosaic Covenant historical context.',
      'Distinguish moral law (abiding) from ceremonial and civil law (fulfilled in Christ).',
      'Look for the character of God revealed behind every commandment.'
    ],
    keyPassages: [
      { reference: 'Exodus 20:1–17', title: 'The Ten Commandments', focus: 'Moral Law & Covenant Duty' },
      { reference: 'Deuteronomy 6:1–9', title: 'The Shema', focus: 'Total Devotion to the One Lord' },
      { reference: 'Leviticus 19:1–18', title: 'Holiness Code', focus: 'Love Your Neighbor as Yourself' }
    ],
    structuralQuestion: 'How does this commandment reflect God’s holy character and point to Christ’s perfect law-keeping?',
    literaryTraits: ['Imperative statements', 'Conditional legal formulas ("If... then...")', 'Covenant prologue']
  },
  {
    id: 'history',
    name: 'Narrative & History',
    icon: '👑',
    accentColor: '#F59E0B',
    description: 'Historical accounts of God acting in human time through patriarchs, kings, and nations.',
    hermeneuticalRules: [
      'Narratives report what happened, not necessarily what ought to happen (descriptive vs. prescriptive).',
      'God is the ultimate hero of every biblical story, not human characters.',
      'Trace how human failure highlights God’s relentless covenant grace.'
    ],
    keyPassages: [
      { reference: 'Genesis 22:1–19', title: 'Mount Moriah', focus: 'Abraham’s Faith & Divine Substitution' },
      { reference: '1 Samuel 17:1–58', title: 'David and Goliath', focus: 'The Lord’s Salvation Through His Anointed' },
      { reference: 'Ruth 2:1–23', title: 'Ruth & Boaz', focus: 'Providence & Kinsman Redeemer' }
    ],
    structuralQuestion: 'Where is God working behind the scenes in this narrative to advance His redemptive kingdom?',
    literaryTraits: ['Scene changes & dialogue', 'Character flaws & conflicts', 'Divine intervention']
  },
  {
    id: 'poetry',
    name: 'Wisdom & Poetry',
    icon: '🪕',
    accentColor: '#EC4899',
    description: 'Hebrew verse, Psalms of lament & praise, and proverbial wisdom for living in the fear of the Lord.',
    hermeneuticalRules: [
      'Pay attention to Hebrew poetic parallelism (synonymous, antithetical, synthetic).',
      'Proverbs are inspired general truths, not ironclad guaranteed promises for every circumstance.',
      'Psalms express honest human emotions brought into the presence of God.'
    ],
    keyPassages: [
      { reference: 'Psalm 23:1–6', title: 'The Lord is My Shepherd', focus: 'Trust & Covenant Provision' },
      { reference: 'Proverbs 3:1–12', title: 'Trust in the Lord', focus: 'Wisdom & Wholehearted Faith' },
      { reference: 'Job 38:1–41', title: 'God’s Voice from the Whirlwind', focus: 'Sovereignty in Suffering' }
    ],
    structuralQuestion: 'What emotion or wisdom is being expressed through Hebrew poetic parallelism?',
    literaryTraits: ['Hebrew Parallelism', 'Metaphors & Imagery', 'Chiasm & Acrostic structures']
  },
  {
    id: 'prophecy',
    name: 'Prophecy',
    icon: '🗣️',
    accentColor: '#8B5CF6',
    description: 'Covenant enforcement declarations calling Israel back to God and announcing Messianic hope.',
    hermeneuticalRules: [
      'Prophets are primarily forthtellers (covenant messengers) rather than just foretellers.',
      'Distinguish near historical fulfillments (Assyria/Babylon) from far Messianic fulfillments.',
      'Look for the "telescoping" nature of prophetic visions.'
    ],
    keyPassages: [
      { reference: 'Isaiah 53:1–12', title: 'The Suffering Servant', focus: 'Substitutionary Atonement' },
      { reference: 'Jeremiah 31:31–34', title: 'The New Covenant Promise', focus: 'Law Written on Hearts' },
      { reference: 'Amos 5:14–24', title: 'Seek Good and Not Evil', focus: 'Justice & Righteousness' }
    ],
    structuralQuestion: 'What covenant violation is being rebuked, and what Messianic promise offers future hope?',
    literaryTraits: ['Covenant lawsuit (Rib)', 'Oracles of woe & salvation', 'Symbolic actions']
  },
  {
    id: 'gospels',
    name: 'Gospels & Parables',
    icon: '🕊️',
    accentColor: '#3B82F6',
    description: 'The theological biographies of Jesus Christ and His subversive Kingdom parables.',
    hermeneuticalRules: [
      'Read Gospels vertically (within the book’s context) and horizontally (comparing Gospel accounts).',
      'Parables demand a verdict—look for the main central point of kingdom truth.',
      'Observe how Jesus fulfills Old Testament types and prophecies.'
    ],
    keyPassages: [
      { reference: 'Matthew 5:1–12', title: 'The Beatitudes', focus: 'Kingdom Citizen Character' },
      { reference: 'Luke 15:11–32', title: 'The Prodigal Son', focus: 'The Father’s Prodigal Grace' },
      { reference: 'John 1:1–14', title: 'The Incarnate Word', focus: 'Deity & Incarnation of Christ' }
    ],
    structuralQuestion: 'How does Jesus reveal the Kingdom of God and demand a personal decision from the reader?',
    literaryTraits: ['Parables & miracles', 'Kingdom announcements', 'Discipleship dialogues']
  },
  {
    id: 'epistles',
    name: 'Epistles & Letters',
    icon: '✉️',
    accentColor: '#6366F1',
    description: 'Apostolic letters written to local churches establishing Gospel doctrine and practical holy living.',
    hermeneuticalRules: [
      'Understand the historical situation of the original author and recipient church.',
      'Follow logical argument flow and conjunctions ("therefore", "for", "so that").',
      'Distinguish timeless theological principles from first-century cultural applications.'
    ],
    keyPassages: [
      { reference: 'Romans 8:1–17', title: 'Life in the Spirit', focus: 'No Condemnation & Adoption' },
      { reference: 'Ephesians 2:1–10', title: 'By Grace Through Faith', focus: 'Salvation & Good Works' },
      { reference: 'Philippians 2:1–11', title: 'The Mind of Christ', focus: 'Humility & Exaltation' }
    ],
    structuralQuestion: 'What is the logical connection between the theological truth (indicative) and practical duty (imperative)?',
    literaryTraits: ['Salutation & Thanksgiving', 'Doctrinal exposition (Indicative)', 'Ethical exhortation (Imperative)']
  },
  {
    id: 'apocalyptic',
    name: 'Apocalyptic',
    icon: '⚡',
    accentColor: '#EF4444',
    description: 'Cosmic apocalyptic visions unveiling heaven’s perspective on earthly trials and Christ’s final victory.',
    hermeneuticalRules: [
      'Interpret symbols figuratively according to Old Testament apocalyptic imagery (Daniel, Ezekiel, Zechariah).',
      'Focus on the main message: God is sovereign, Christ wins, and believers must remain faithful.',
      'Avoid hyper-literalism with numbers and symbolic beasts.'
    ],
    keyPassages: [
      { reference: 'Revelation 1:9–20', title: 'Vision of Exalted Christ', focus: 'Lord of the Church & Keys of Death' },
      { reference: 'Daniel 7:9–14', title: 'Son of Man Before Ancient of Days', focus: 'Everlasting Kingdom Given to Son' },
      { reference: 'Revelation 21:1–8', title: 'New Heavens & New Earth', focus: 'Consummation & Eternal Dwelling' }
    ],
    structuralQuestion: 'What cosmic reality is unveiled to comfort suffering saints in their present trial?',
    literaryTraits: ['Symbolic imagery & numbers', 'Angelic interpreters', 'Heavenly throne-room scenes']
  }
]

export function getGenreById(id: string): BiblicalGenre {
  return BIBLICAL_GENRES.find((g) => g.id === id) || BIBLICAL_GENRES[0]
}

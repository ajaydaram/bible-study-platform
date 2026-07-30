export interface EpochSummary {
  id: string
  number: number
  title: string
  subtitle: string
  timeline: string
  description: string
  vosianInsight: string
  keyCovenants: string[]
  primaryPassages: { title: string; reference: string }[]
  keyThemes: string[]
  shadowsAndTypes: string[]
  color: {
    bg: string
    border: string
    text: string
    badge: string
    gradient: string
  }
  icon: string
}

export const redemptiveEpochs: EpochSummary[] = [
  {
    id: 'pre-fall',
    number: 1,
    title: 'Pre-Fall (Edenic)',
    subtitle: 'The Covenant of Creation & Pristine Divine Communion',
    timeline: 'Genesis 1:1 – 2:25',
    description: 'God creates the cosmos as His cosmic sanctuary and places humanity as royal priest-kings in Eden. Eschatology was already latent in Eden: Adam was offered eternal, confirmed life through obedience in the Covenant of Works.',
    vosianInsight: 'Eden was not merely a starting point, but a sanctuary oriented toward a higher heavenly glory. Adam was created with a destiny to pass probation into unchangeable life.',
    keyCovenants: ['Covenant of Creation / Works'],
    primaryPassages: [
      { title: 'The Cosmic Sanctuary Created', reference: 'Genesis 1:1-31' },
      { title: 'Eden as God’s Dwelling Place', reference: 'Genesis 2:7-25' },
      { title: 'Man in God’s Image as King-Priest', reference: 'Psalm 8:1-9' }
    ],
    keyThemes: ['Imago Dei', 'Cosmic Temple', 'Edenic Sabbath', 'Covenant Probation'],
    shadowsAndTypes: ['Eden as the original Sanctuary', 'Adam as federal head and type of Christ', 'Tree of Life as eternal communion'],
    color: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-300',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
      gradient: 'from-emerald-600 to-teal-700'
    },
    icon: '🌱'
  },
  {
    id: 'patriarchal',
    number: 2,
    title: 'Patriarchal Era',
    subtitle: 'Fall, Promise & The Covenant of Grace Initiated',
    timeline: 'Genesis 3:1 – Exodus 2:25',
    description: 'Following the Fall and the Protoevangelium (Gen 3:15), God elects a family line through Abraham. Through altars, circumcision, and sovereign promises, grace breaks into a fallen world.',
    vosianInsight: 'Special revelation here focuses on election, the Seed promise, and pilgrim faith. Abraham lived as a stranger looking for a city whose architect is God.',
    keyCovenants: ['Noahic Covenant of Preservation', 'Abrahamic Covenant of Promise'],
    primaryPassages: [
      { title: 'The Protoevangelium (First Promise)', reference: 'Genesis 3:14-19' },
      { title: 'Covenant Sealed with Abraham', reference: 'Genesis 15:1-21' },
      { title: 'The Binding of Isaac (Substitution)', reference: 'Genesis 22:1-19' }
    ],
    keyThemes: ['Promised Seed', 'Pilgrim Faith', 'Justification by Faith', 'Substitutionary Sacrifice'],
    shadowsAndTypes: ['Noah’s Ark as salvation through judgment', 'Melchizedek’s eternal priesthood', 'Ram in the thicket replacing Isaac'],
    color: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
      gradient: 'from-amber-600 to-orange-700'
    },
    icon: '⛺'
  },
  {
    id: 'mosaic',
    number: 3,
    title: 'Mosaic & Kingdom Era',
    subtitle: 'Redemption, Tabernacle, Law & The Davidic Throne',
    timeline: 'Exodus 3:1 – 2 Kings 25:30',
    description: 'God redeems Israel from bondage, establishes the Levitical sacrificial system, orders the Tabernacle/Temple, and covenants with King David for an eternal royal dynasty.',
    vosianInsight: 'The Mosaic economy is a pedagogical administration of pedagogical types. The earthly Tabernacle was a copy/shadow of the heavenly sanctuary shown on Mount Sinai.',
    keyCovenants: ['Mosaic (Sinai) Covenant', 'Davidic Covenant'],
    primaryPassages: [
      { title: 'The Exodus Deliverance & Passover', reference: 'Exodus 12:1-28' },
      { title: 'The Tabernacle Pattern Revealed', reference: 'Exodus 25:1-9' },
      { title: 'The Davidic Kingdom Covenant', reference: '2 Samuel 7:8-17' }
    ],
    keyThemes: ['Passover Redemption', 'Holy Law', 'Levitical Priesthood', 'Davidic Dynasty'],
    shadowsAndTypes: ['Passover Lamb', 'Day of Atonement (Yom Kippur)', 'The Tabernacle/Temple', 'King David as the Anointed King'],
    color: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
      gradient: 'from-blue-600 to-indigo-700'
    },
    icon: '🏛️'
  },
  {
    id: 'prophetic',
    number: 4,
    title: 'Prophetic Era',
    subtitle: 'Exile, Crisis & The Promise of the New Covenant',
    timeline: 'Isaiah – Malachi',
    description: 'During Israel’s infidelity and exile, the prophets looked beyond judgment to the New Covenant, the Suffering Servant of Yahweh, and the outpouring of the Holy Spirit.',
    vosianInsight: 'Prophecy projected the redemptive goal onto the eschatological horizon, revealing that the true sanctuary, kingdom, and heart transformation were yet to come.',
    keyCovenants: ['New Covenant Promised'],
    primaryPassages: [
      { title: 'The Suffering Servant Prophecy', reference: 'Isaiah 53:1-12' },
      { title: 'The New Covenant Promised', reference: 'Jeremiah 31:31-34' },
      { title: 'The Son of Man Coming in Glory', reference: 'Daniel 7:13-14' }
    ],
    keyThemes: ['New Covenant', 'Suffering Servant', 'New Heart & Inward Law', 'Day of the Lord'],
    shadowsAndTypes: ['The Branch from Jesse’s roots', 'The Heavenly Son of Man', 'The New Temple of Ezekiel'],
    color: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
      gradient: 'from-purple-600 to-violet-700'
    },
    icon: '📜'
  },
  {
    id: 'messianic',
    number: 5,
    title: 'Messianic Realization',
    subtitle: 'Christ, Resurrected Life & Inaugurated Eschatology',
    timeline: 'Gospels – Revelation',
    description: 'The eternal Word becomes flesh, accomplishes redemption on the cross, rises in resurrection power, pours out the Holy Spirit, and reigns at the Father’s right hand in the Age to Come.',
    vosianInsight: 'Eschatology has entered history! In Christ’s resurrection, the Age to Come has broken into this present evil age ("Already"), while we await the final consummation ("Not Yet").',
    keyCovenants: ['New Covenant Enacted & Fulfilled'],
    primaryPassages: [
      { title: 'The Word Made Flesh & True Temple', reference: 'John 1:1-18' },
      { title: 'Resurrection as Firstfruits of New Creation', reference: '1 Corinthians 15:12-28' },
      { title: 'Citizenship in the Heavenly Jerusalem', reference: 'Hebrews 12:18-24' }
    ],
    keyThemes: ['Inaugurated Eschatology', 'Resurrection Power', 'True High Priest & Temple', 'Already / Not Yet'],
    shadowsAndTypes: ['Christ as the Antitype of Temple, Priest, Sacrifice, King, and Sabbath'],
    color: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-300',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
      gradient: 'from-rose-600 to-crimson-700'
    },
    icon: '👑'
  }
]

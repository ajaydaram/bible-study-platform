// Story of Scripture Master Curriculum Dataset
// Extracted from "The Story of Scripture (Theme Pictures and Verses)"

export interface BiblicalBookTheme {
  book: string
  division: 'Pentateuch' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Pauline' | 'General' | 'Prophecy'
  subdivision: string
  theme: string
  keyVerse: string
  date: string
  icon: string
  color: string
}

export interface WalkThruMilestone {
  step: number
  era: string
  title: string
  scriptureRef: string
  description?: string
  icon?: string
}

export const BOOK_THEMES: BiblicalBookTheme[] = [
  // Pentateuch (5)
  { book: 'Genesis', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Beginnings & Promise', keyVerse: 'Genesis 12:1-3', date: 'c. 1446-1406 B.C.', icon: '🌿', color: 'emerald' },
  { book: 'Exodus', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Redemption & Divine Presence', keyVerse: 'Exodus 19:4-6', date: 'c. 1446-1406 B.C.', icon: '🔥', color: 'amber' },
  { book: 'Leviticus', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Holiness of God & Atonement', keyVerse: 'Leviticus 19:2', date: 'c. 1445 B.C.', icon: '🕊️', color: 'purple' },
  { book: 'Numbers', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Wilderness Faithfulness', keyVerse: 'Numbers 14:22-23', date: 'c. 1445-1406 B.C.', icon: '⛺', color: 'orange' },
  { book: 'Deuteronomy', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Covenant Love & Obedience', keyVerse: 'Deuteronomy 6:4-5', date: 'c. 1406 B.C.', icon: '📜', color: 'blue' },

  // Historical Books (12)
  { book: 'Joshua', division: 'History', subdivision: 'Conquest & Settlement', theme: 'Promise Fulfilled & Conquest', keyVerse: 'Joshua 21:43-45', date: 'c. 1400-1375 B.C.', icon: '⚔️', color: 'red' },
  { book: 'Judges', division: 'History', subdivision: 'Conquest & Settlement', theme: 'Cycle of Sin & Deliverance', keyVerse: 'Judges 21:25', date: 'c. 1375-1050 B.C.', icon: '🔄', color: 'stone' },
  { book: 'Ruth', division: 'History', subdivision: 'Conquest & Settlement', theme: 'Redeeming Love & Kinsman Redeemer', keyVerse: 'Ruth 4:14-15', date: 'c. 1100 B.C.', icon: '🌾', color: 'amber' },
  { book: '1 Samuel', division: 'History', subdivision: 'United Kingdom', theme: 'Rise of Kingship', keyVerse: '1 Samuel 13:14', date: 'c. 1050-1010 B.C.', icon: '👑', color: 'indigo' },
  { book: '2 Samuel', division: 'History', subdivision: 'United Kingdom', theme: 'Davidic Covenant & Kingdom', keyVerse: '2 Samuel 7:12-16', date: 'c. 1010-970 B.C.', icon: '🏰', color: 'blue' },
  { book: '1 Kings', division: 'History', subdivision: 'Divided Kingdom', theme: 'Divided Kingdom & Prophecy', keyVerse: '1 Kings 11:11', date: 'c. 970-850 B.C.', icon: '⚡', color: 'amber' },
  { book: '2 Kings', division: 'History', subdivision: 'Divided Kingdom & Exile', theme: 'Exile & Covenant Curse', keyVerse: '2 Kings 17:7-23', date: 'c. 850-586 B.C.', icon: '⛓️', color: 'gray' },
  { book: '1 Chronicles', division: 'History', subdivision: 'Davidic Hope', theme: 'Davidic Hope & True Worship', keyVerse: '1 Chronicles 17:11-14', date: 'c. 450-400 B.C.', icon: '🏛️', color: 'sky' },
  { book: '2 Chronicles', division: 'History', subdivision: 'Davidic Hope', theme: 'Temple & Call to Repentance', keyVerse: '2 Chronicles 7:14', date: 'c. 450-400 B.C.', icon: '🕯️', color: 'yellow' },
  { book: 'Ezra', division: 'History', subdivision: 'Restoration', theme: 'Restoration of the Temple', keyVerse: 'Ezra 7:10', date: 'c. 538-450 B.C.', icon: '🧱', color: 'teal' },
  { book: 'Nehemiah', division: 'History', subdivision: 'Restoration', theme: 'Restoration of the People & Wall', keyVerse: 'Nehemiah 8:10', date: 'c. 445-420 B.C.', icon: '🛡️', color: 'cyan' },
  { book: 'Esther', division: 'History', subdivision: 'Restoration', theme: 'God’s Sovereign Providence', keyVerse: 'Esther 4:14', date: 'c. 483-473 B.C.', icon: '👸', color: 'rose' },

  // Poetry & Wisdom (5)
  { book: 'Job', division: 'Poetry', subdivision: 'Wisdom Literature', theme: 'Sovereign Wisdom in Suffering', keyVerse: 'Job 42:2', date: 'Patriarchal Era', icon: '🌪️', color: 'slate' },
  { book: 'Psalms', division: 'Poetry', subdivision: 'Worship & Hymns', theme: 'Worship & Messianic Kingship', keyVerse: 'Psalm 2:7', date: 'c. 1000-450 B.C.', icon: '🎵', color: 'violet' },
  { book: 'Proverbs', division: 'Poetry', subdivision: 'Wisdom Literature', theme: 'Wise Living in the Fear of the Lord', keyVerse: 'Proverbs 1:7', date: 'c. 970-700 B.C.', icon: '💎', color: 'amber' },
  { book: 'Ecclesiastes', division: 'Poetry', subdivision: 'Wisdom Literature', theme: 'Meaning Under the Sun & Fear God', keyVerse: 'Ecclesiastes 12:13', date: 'c. 935 B.C.', icon: '⏳', color: 'stone' },
  { book: 'Song of Solomon', division: 'Poetry', subdivision: 'Covenant Love', theme: 'Covenant Love & Holy Passion', keyVerse: 'Song of Solomon 8:6-7', date: 'c. 965 B.C.', icon: '🌹', color: 'pink' },

  // Major & Minor Prophets (17)
  { book: 'Isaiah', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'Salvation Through the Suffering Servant', keyVerse: 'Isaiah 53:5', date: 'c. 740-681 B.C.', icon: '☀️', color: 'orange' },
  { book: 'Jeremiah', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'The Promised New Covenant', keyVerse: 'Jeremiah 31:31-34', date: 'c. 627-586 B.C.', icon: '💧', color: 'blue' },
  { book: 'Lamentations', division: 'Prophets', subdivision: 'Exilic Period', theme: 'Hope in the Midst of Judgment', keyVerse: 'Lamentations 3:22-23', date: 'c. 586 B.C.', icon: '🖤', color: 'gray' },
  { book: 'Ezekiel', division: 'Prophets', subdivision: 'Exilic Period', theme: 'New Heart & God’s Radiant Glory', keyVerse: 'Ezekiel 36:26-27', date: 'c. 593-571 B.C.', icon: '🔥', color: 'emerald' },
  { book: 'Daniel', division: 'Prophets', subdivision: 'Exilic Period', theme: 'God’s Sovereign Everlasting Kingdom', keyVerse: 'Daniel 7:13-14', date: 'c. 605-536 B.C.', icon: '🦁', color: 'yellow' },
  { book: 'Hosea', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'God’s Unfailing Faithful Love', keyVerse: 'Hosea 11:1-4', date: 'c. 755-715 B.C.', icon: '💍', color: 'rose' },
  { book: 'Joel', division: 'Prophets', subdivision: 'Undated / Pre-Exilic', theme: 'The Outpouring Day of the Lord', keyVerse: 'Joel 2:28-32', date: 'c. 835 B.C.', icon: '🌾', color: 'purple' },
  { book: 'Amos', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'Social Justice & Righteousness', keyVerse: 'Amos 5:24', date: 'c. 760-753 B.C.', icon: '⚖️', color: 'red' },
  { book: 'Obadiah', division: 'Prophets', subdivision: 'Pre-Exilic', theme: 'Judgment on Pride & Zion Deliverance', keyVerse: 'Obadiah 1:15', date: 'c. 845 / 586 B.C.', icon: '🦅', color: 'stone' },
  { book: 'Jonah', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'God’s Boundless Mercy to the Nations', keyVerse: 'Jonah 4:2', date: 'c. 760 B.C.', icon: '🐋', color: 'teal' },
  { book: 'Micah', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'The Coming Shepherd-King of Bethlehem', keyVerse: 'Micah 5:2', date: 'c. 735-700 B.C.', icon: '🌟', color: 'amber' },
  { book: 'Nahum', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'Vindication & Judgment on Nineveh', keyVerse: 'Nahum 1:7-8', date: 'c. 663-612 B.C.', icon: '⚡', color: 'orange' },
  { book: 'Habakkuk', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'The Just Shall Live by Faith', keyVerse: 'Habakkuk 2:4', date: 'c. 607-605 B.C.', icon: '🛡️', color: 'blue' },
  { book: 'Zephaniah', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'Purifying Judgment & Joyful Restoration', keyVerse: 'Zephaniah 3:17', date: 'c. 622 B.C.', icon: '🎺', color: 'violet' },
  { book: 'Haggai', division: 'Prophets', subdivision: 'Post-Exilic (Persian)', theme: 'Rebuilding God’s Temple', keyVerse: 'Haggai 1:8', date: 'c. 520 B.C.', icon: '🔨', color: 'emerald' },
  { book: 'Zechariah', division: 'Prophets', subdivision: 'Post-Exilic (Persian)', theme: 'The Coming Humble King & Pierced Messiah', keyVerse: 'Zechariah 9:9', date: 'c. 520-480 B.C.', icon: '👑', color: 'sky' },
  { book: 'Malachi', division: 'Prophets', subdivision: 'Post-Exilic (Persian)', theme: 'Covenant Renewal & Sun of Righteousness', keyVerse: 'Malachi 3:1', date: 'c. 430 B.C.', icon: '☀️', color: 'yellow' },

  // Gospels & Acts (5)
  { book: 'Matthew', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Promised King & Kingdom', keyVerse: 'Matthew 28:18-20', date: 'c. A.D. 50-70', icon: '👑', color: 'amber' },
  { book: 'Mark', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Suffering Servant of the Lord', keyVerse: 'Mark 10:45', date: 'c. A.D. 55-65', icon: '🦁', color: 'red' },
  { book: 'Luke', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Compassionate Savior for All', keyVerse: 'Luke 19:10', date: 'c. A.D. 60-62', icon: '🕊️', color: 'blue' },
  { book: 'John', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Eternal Son of God', keyVerse: 'John 20:31', date: 'c. A.D. 85-95', icon: '🦅', color: 'purple' },
  { book: 'Acts', division: 'History', subdivision: 'Early Church', theme: 'The Holy Spirit & Global Mission', keyVerse: 'Acts 1:8', date: 'c. A.D. 62-64', icon: '🔥', color: 'emerald' },

  // Pauline Epistles (13)
  { book: 'Romans', division: 'Pauline', subdivision: '3rd Journey', theme: 'Justification by Faith in Christ', keyVerse: 'Romans 1:16-17', date: 'c. A.D. 57', icon: '⚖️', color: 'indigo' },
  { book: '1 Corinthians', division: 'Pauline', subdivision: '3rd Journey', theme: 'Church Holiness & Crucified Wisdom', keyVerse: '1 Corinthians 1:18', date: 'c. A.D. 55', icon: '🏛️', color: 'violet' },
  { book: '2 Corinthians', division: 'Pauline', subdivision: '3rd Journey', theme: 'Power Made Perfect in Weakness', keyVerse: '2 Corinthians 12:9', date: 'c. A.D. 56', icon: '🏺', color: 'pink' },
  { book: 'Galatians', division: 'Pauline', subdivision: '1st Journey', theme: 'Freedom in Christ & Grace Alone', keyVerse: 'Galatians 2:16', date: 'c. A.D. 48-49', icon: '🕊️', color: 'teal' },
  { book: 'Ephesians', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'Cosmic Unity in Christ (Sit, Walk, Stand)', keyVerse: 'Ephesians 2:14', date: 'c. A.D. 60-62', icon: '🛡️', color: 'blue' },
  { book: 'Philippians', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'Unshakable Joy in Christ', keyVerse: 'Philippians 4:4', date: 'c. A.D. 61', icon: '✨', color: 'yellow' },
  { book: 'Colossians', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'The Absolute Supremacy of Christ', keyVerse: 'Colossians 1:15-18', date: 'c. A.D. 60-62', icon: '👑', color: 'purple' },
  { book: '1 Thessalonians', division: 'Pauline', subdivision: '2nd Journey', theme: 'The Blessed Hope of Christ’s Return', keyVerse: '1 Thessalonians 4:16-17', date: 'c. A.D. 50-51', icon: '🎺', color: 'sky' },
  { book: '2 Thessalonians', division: 'Pauline', subdivision: '2nd Journey', theme: 'Standing Firm in the Truth', keyVerse: '2 Thessalonians 2:15', date: 'c. A.D. 51-52', icon: '⚓', color: 'cyan' },
  { book: '1 Timothy', division: 'Pauline', subdivision: 'Pastoral Epistles', theme: 'Church Order & Sound Doctrine', keyVerse: '1 Timothy 3:15', date: 'c. A.D. 62-64', icon: '📜', color: 'emerald' },
  { book: '2 Timothy', division: 'Pauline', subdivision: 'Pastoral Epistles', theme: 'Enduring Faithfulness to the End', keyVerse: '2 Timothy 4:7', date: 'c. A.D. 66-67', icon: '🏆', color: 'amber' },
  { book: 'Titus', division: 'Pauline', subdivision: 'Pastoral Epistles', theme: 'Good Works & Godly Living', keyVerse: 'Titus 2:11-12', date: 'c. A.D. 63-65', icon: '🌿', color: 'teal' },
  { book: 'Philemon', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'Reconciliation & Brotherly Love', keyVerse: 'Philemon 1:16', date: 'c. A.D. 60-62', icon: '🤝', color: 'rose' },

  // General Epistles & Revelation (9)
  { book: 'Hebrews', division: 'General', subdivision: 'General Epistles', theme: 'The Absolute Superiority of Christ', keyVerse: 'Hebrews 4:14-16', date: 'c. A.D. 64-68', icon: '✝️', color: 'indigo' },
  { book: 'James', division: 'General', subdivision: 'General Epistles', theme: 'Living Faith That Works', keyVerse: 'James 2:17', date: 'c. A.D. 45-48', icon: '🌱', color: 'emerald' },
  { book: '1 Peter', division: 'General', subdivision: 'Petrine Epistles', theme: 'Living Hope in the Midst of Suffering', keyVerse: '1 Peter 1:3', date: 'c. A.D. 62-64', icon: '⚓', color: 'blue' },
  { book: '2 Peter', division: 'General', subdivision: 'Petrine Epistles', theme: 'Guarding Truth Against False Teachers', keyVerse: '2 Peter 1:3', date: 'c. A.D. 64-67', icon: '🛡️', color: 'red' },
  { book: '1 John', division: 'General', subdivision: 'Johannine Epistles', theme: 'Assurance in Truth, Light, and Love', keyVerse: '1 John 5:13', date: 'c. A.D. 85-95', icon: '❤️', color: 'rose' },
  { book: '2 John', division: 'General', subdivision: 'Johannine Epistles', theme: 'Walking in Truth and Love', keyVerse: '2 John 1:6', date: 'c. A.D. 85-95', icon: '🚶', color: 'amber' },
  { book: '3 John', division: 'General', subdivision: 'Johannine Epistles', theme: 'Hospitality & Supporting Gospel Truth', keyVerse: '3 John 1:5-6', date: 'c. A.D. 85-95', icon: '🏠', color: 'teal' },
  { book: 'Jude', division: 'General', subdivision: 'General Epistles', theme: 'Contending Earnestly for the Faith', keyVerse: 'Jude 1:3', date: 'c. A.D. 65-80', icon: '⚔️', color: 'stone' },
  { book: 'Revelation', division: 'Prophecy', subdivision: 'New Creation', theme: 'The Triumphant Christ & New Creation', keyVerse: 'Revelation 21:1-5', date: 'c. A.D. 95-96', icon: '👑', color: 'purple' },
]

export function getBookTheme(bookName: string): BiblicalBookTheme | undefined {
  const norm = bookName.trim().toLowerCase()
  return BOOK_THEMES.find(
    b => b.book.toLowerCase() === norm || b.book.toLowerCase().replace(/\s+/g, '') === norm.replace(/\s+/g, '')
  )
}

// 91 Milestones - Walk Thru the Old Testament
export const OT_WALK_THRU: WalkThruMilestone[] = [
  // 1. Beginnings (1–5)
  { step: 1, era: 'Beginnings', title: 'Creation', scriptureRef: 'Genesis 1-2', icon: '🌍', description: 'God creates the cosmos in perfect order and beauty.' },
  { step: 2, era: 'Beginnings', title: 'The Fall', scriptureRef: 'Genesis 3', icon: '🍎', description: 'Man rebels against God; first Gospel promise (Gen 3:15).' },
  { step: 3, era: 'Beginnings', title: 'The Flood', scriptureRef: 'Genesis 6-9', icon: '🌊', description: 'Judgment on global wickedness and Noahic covenant.' },
  { step: 4, era: 'Beginnings', title: 'Tower of Babel', scriptureRef: 'Genesis 10-11', icon: '🗼', description: 'Human pride scattered across the earth into languages.' },
  { step: 5, era: 'Beginnings', title: 'Table of Nations', scriptureRef: 'Genesis 10', icon: '🌐', description: 'The 70 families populating the earth.' },

  // 2. Patriarchs (6–25)
  { step: 6, era: 'Patriarchs', title: '4000 Years Ago', scriptureRef: 'Genesis 11', icon: '⏳', description: 'The patriarchal horizon and dawn of redemptive history.' },
  { step: 7, era: 'Patriarchs', title: 'Ur of the Chaldees', scriptureRef: 'Genesis 11:28', icon: '🏺', description: 'God calls Abraham out of pagan idolatry.' },
  { step: 8, era: 'Patriarchs', title: 'Persian Gulf', scriptureRef: 'Genesis 11', icon: '🌊', description: 'Cradle of ancient Near Eastern civilization.' },
  { step: 9, era: 'Patriarchs', title: 'SALT (Sarah, Abraham, Lot, Terah)', scriptureRef: 'Genesis 11-25', icon: '🧂', description: 'The core pilgrim family journeying by faith.' },
  { step: 10, era: 'Patriarchs', title: 'Sarah', scriptureRef: 'Genesis 16-23', icon: '👑', description: 'Mother of the covenant seed of promise.' },
  { step: 11, era: 'Patriarchs', title: 'Abraham’s Call', scriptureRef: 'Genesis 12:1-3', icon: '⛺', description: 'Land, seed, and universal blessing promise.' },
  { step: 12, era: 'Patriarchs', title: 'Lot in Sodom', scriptureRef: 'Genesis 12-14, 19', icon: '🔥', description: 'Compromise, rescue, and divine judgment on Sodom.' },
  { step: 13, era: 'Patriarchs', title: 'Terah', scriptureRef: 'Genesis 11:31', icon: '👴', description: 'Father of Abraham stopping halfway at Haran.' },
  { step: 14, era: 'Patriarchs', title: 'Tigris & Euphrates', scriptureRef: 'Genesis 2:14', icon: '🏞️', description: 'Fertile crescent rivers of redemptive origin.' },
  { step: 15, era: 'Patriarchs', title: 'Haran (Terah Dies)', scriptureRef: 'Genesis 11:32', icon: '🛑', description: 'Stepping into the Promised Land beyond Haran.' },
  { step: 16, era: 'Patriarchs', title: 'Sea of Galilee', scriptureRef: 'Numbers 34:11', icon: '⛵', description: 'Northern anchor of the Promised Land.' },
  { step: 17, era: 'Patriarchs', title: 'Jordan River', scriptureRef: 'Genesis 13:10', icon: '💧', description: 'The central spine of sacred geography.' },
  { step: 18, era: 'Patriarchs', title: 'Dead Sea', scriptureRef: 'Genesis 14:3', icon: '🧂', description: 'Valley of Siddim and site of Sodom.' },
  { step: 19, era: 'Patriarchs', title: 'Mediterranean Sea', scriptureRef: 'Joshua 1:4', icon: '🌊', description: 'The western boundary of the covenant territory.' },
  { step: 20, era: 'Patriarchs', title: 'Land of Israel', scriptureRef: 'Genesis 12:7', icon: '🗺️', description: 'The stage of God’s redemptive drama.' },
  { step: 21, era: 'Patriarchs', title: 'Ishmael & Isaac', scriptureRef: 'Genesis 16, 21-22', icon: '👦', description: 'Flesh vs. Promise; Sacrifice on Mount Moriah.' },
  { step: 22, era: 'Patriarchs', title: 'Esau & Jacob', scriptureRef: 'Genesis 25, 27-35', icon: '🤼', description: 'Birthright and God wrestling with Jacob at Peniel.' },
  { step: 23, era: 'Patriarchs', title: 'Judah (Messianic Line)', scriptureRef: 'Genesis 49:8-10', icon: '🦁', description: 'The Scepter shall not depart from Judah.' },
  { step: 24, era: 'Patriarchs', title: 'Joseph in Egypt', scriptureRef: 'Genesis 37, 39-50', icon: '🧥', description: 'What you meant for evil, God meant for good.' },
  { step: 25, era: 'Patriarchs', title: 'Jews in Goshen', scriptureRef: 'Genesis 47:27', icon: '🌾', description: 'Israel multiplies in Egypt into a great multitude.' },

  // 3. Exodus & Wilderness (26–47)
  { step: 26, era: 'Exodus & Wilderness', title: '400 Years of Bondage', scriptureRef: 'Exodus 1', icon: '⛓️', description: 'Affliction under Pharaoh in Egypt.' },
  { step: 27, era: 'Exodus & Wilderness', title: 'Moses Called at Burning Bush', scriptureRef: 'Exodus 2-3', icon: '🔥', description: 'I AM WHO I AM sends Moses to deliver Israel.' },
  { step: 28, era: 'Exodus & Wilderness', title: '“Let My People Go”', scriptureRef: 'Exodus 5-10', icon: '🗣️', description: 'Confrontation with Pharaoh and Egyptian gods.' },
  { step: 29, era: 'Exodus & Wilderness', title: 'Pharaoh’s Hardened Heart', scriptureRef: 'Exodus 5-11', icon: '🪨', description: 'The pride of empire judged by Yahweh.' },
  { step: 30, era: 'Exodus & Wilderness', title: '10 Plagues', scriptureRef: 'Exodus 7-12', icon: '⚡', description: 'Total supremacy of Yahweh over all Egyptian deities.' },
  { step: 31, era: 'Exodus & Wilderness', title: 'The Passover Lamb', scriptureRef: 'Exodus 12', icon: '🐑', description: 'Blood on the doorposts saving the firstborn.' },
  { step: 32, era: 'Exodus & Wilderness', title: 'Red Sea Crossing', scriptureRef: 'Exodus 14', icon: '🌊', description: 'Waters divide; salvation of Israel and ruin of Egypt.' },
  { step: 33, era: 'Exodus & Wilderness', title: 'Mount Sinai', scriptureRef: 'Exodus 19-20', icon: '⛰️', description: 'The glory of God descends in fire and smoke.' },
  { step: 34, era: 'Exodus & Wilderness', title: 'The Ten Commandments', scriptureRef: 'Exodus 20', icon: '📜', description: 'Moral backbone of the Mosaic Covenant.' },
  { step: 35, era: 'Exodus & Wilderness', title: 'Ark of the Covenant', scriptureRef: 'Exodus 25:10-22', icon: '✨', description: 'The Mercy Seat and throne of God’s presence.' },
  { step: 36, era: 'Exodus & Wilderness', title: 'The Tabernacle', scriptureRef: 'Exodus 25-40', icon: '⛺', description: 'God dwelling in the center of His redeemed camp.' },
  { step: 37, era: 'Exodus & Wilderness', title: 'Levites & Priesthood', scriptureRef: 'Exodus 28-30', icon: '🕊️', description: 'Aaron and the high priestly mediation.' },
  { step: 38, era: 'Exodus & Wilderness', title: 'Offerings & Feasts', scriptureRef: 'Leviticus 1-27', icon: '🔥', description: 'Day of Atonement and sacred calendar.' },
  { step: 39, era: 'Exodus & Wilderness', title: 'Counting the Tribes', scriptureRef: 'Numbers 1, 26', icon: '🔢', description: 'Muster of Israel’s holy army.' },
  { step: 40, era: 'Exodus & Wilderness', title: 'Kadesh-Barnea Oasis', scriptureRef: 'Numbers 13', icon: '🌴', description: 'The crisis of unbelief at the border.' },
  { step: 41, era: 'Exodus & Wilderness', title: '12 Spies Dispatched', scriptureRef: 'Numbers 13', icon: '🕵️', description: 'Exploring the land flowing with milk and honey.' },
  { step: 42, era: 'Exodus & Wilderness', title: 'Joshua & Caleb (Good Report)', scriptureRef: 'Numbers 14:6-9', icon: '🍇', description: '“The Lord is with us, do not fear them!”' },
  { step: 43, era: 'Exodus & Wilderness', title: '40 Years Wilderness Wandering', scriptureRef: 'Numbers 14-33', icon: '⌛', description: 'Old generation passes away in the desert.' },
  { step: 44, era: 'Exodus & Wilderness', title: 'Plains of Moab', scriptureRef: 'Deuteronomy 1', icon: '🏕️', description: 'Encamped opposite Jericho across Jordan.' },
  { step: 45, era: 'Exodus & Wilderness', title: 'Moses Preaches to 2nd Generation', scriptureRef: 'Deuteronomy 1-30', icon: '📢', description: 'Hear, O Israel! The Lord our God is one.' },
  { step: 46, era: 'Exodus & Wilderness', title: 'Deuteronomy (Second Law)', scriptureRef: 'Deuteronomy 28-30', icon: '📜', description: 'Blessings and curses of the covenant.' },
  { step: 47, era: 'Exodus & Wilderness', title: 'Moses Dies on Mount Nebo', scriptureRef: 'Deuteronomy 34', icon: '🌄', description: 'Viewing the Promised Land from Pisgah.' },

  // 4. Conquest & Settlement (48–61)
  { step: 48, era: 'Conquest & Settlement', title: 'Joshua Takes Command', scriptureRef: 'Joshua 1', icon: '⚔️', description: '“Be strong and courageous!”' },
  { step: 49, era: 'Conquest & Settlement', title: 'Jordan River Parts', scriptureRef: 'Joshua 3', icon: '💧', description: 'Ark leads the priests into flooding Jordan.' },
  { step: 50, era: 'Conquest & Settlement', title: 'Walls of Jericho Fall', scriptureRef: 'Joshua 6', icon: '🎺', description: 'Faith conquers the impregnable fortress.' },
  { step: 51, era: 'Conquest & Settlement', title: 'Divide & Conquer', scriptureRef: 'Joshua 6-11', icon: '🗺️', description: 'Central, southern, and northern campaigns.' },
  { step: 52, era: 'Conquest & Settlement', title: '7 Years Southern & Northern Campaigns', scriptureRef: 'Joshua 10-11', icon: '🛡️', description: 'Subduing the Canaanite city-states.' },
  { step: 53, era: 'Conquest & Settlement', title: 'Divide & Settle the Land', scriptureRef: 'Joshua 12-24', icon: '🏡', description: 'Tribal allotment and Cities of Refuge.' },
  { step: 54, era: 'Conquest & Settlement', title: '12 Tribes Allotment', scriptureRef: 'Joshua 13-21', icon: '📍', description: 'God’s promises fulfilled to the letter (Josh 21:45).' },
  { step: 55, era: 'Conquest & Settlement', title: 'Era of the Judges (350 Years)', scriptureRef: 'Judges 1-21', icon: '🔄', description: 'Sin → Oppression → Cry → Deliverer → Peace.' },
  { step: 56, era: 'Conquest & Settlement', title: 'Deborah & Barak', scriptureRef: 'Judges 4-5', icon: '⚡', description: 'Victory over Sisera’s chariots at Kishon.' },
  { step: 57, era: 'Conquest & Settlement', title: 'Gideon’s 300', scriptureRef: 'Judges 6-8', icon: '🏺', description: 'Torches and pitchers routing Midian.' },
  { step: 58, era: 'Conquest & Settlement', title: 'Samson', scriptureRef: 'Judges 13-16', icon: '💪', description: 'Nazarite judge judging Philistines in life and death.' },
  { step: 59, era: 'Conquest & Settlement', title: '“Every Man Did Right in His Own Eyes”', scriptureRef: 'Judges 21:25', icon: '👁️', description: 'Spiritual anarchy crying out for the true King.' },
  { step: 60, era: 'Conquest & Settlement', title: 'Ruth & Boaz', scriptureRef: 'Ruth 1-4', icon: '🌾', description: 'Faithful gleaning in Bethlehem preparing David’s line.' },
  { step: 61, era: 'Conquest & Settlement', title: 'Samuel the Prophet', scriptureRef: '1 Samuel 1-7', icon: '👂', description: '“Speak Lord, for your servant is listening.”' },

  // 5. United Kingdom (62–69)
  { step: 62, era: 'United Kingdom', title: 'United Kingdom Established', scriptureRef: '1 Samuel 8-10', icon: '👑', description: '120 years under three 40-year kings.' },
  { step: 63, era: 'United Kingdom', title: '120 Golden Years', scriptureRef: '1 Samuel 8-1 Kings 11', icon: '✨', description: 'Saul (40), David (40), Solomon (40).' },
  { step: 64, era: 'United Kingdom', title: 'King Saul', scriptureRef: '1 Samuel 9-31', icon: '👑', description: 'Tall king with “No Heart for God”.' },
  { step: 65, era: 'United Kingdom', title: '“No Heart for God” (Saul)', scriptureRef: '1 Samuel 15', icon: '💔', description: 'Disobedience and kingdom torn away.' },
  { step: 66, era: 'United Kingdom', title: 'King David', scriptureRef: '2 Samuel 2-1 Kings 2', icon: '🏰', description: 'Man with a “Whole Heart for God”.' },
  { step: 67, era: 'United Kingdom', title: '“Whole Heart for God” (David)', scriptureRef: '2 Samuel 7', icon: '❤️', description: 'Everlasting covenant and throne established.' },
  { step: 68, era: 'United Kingdom', title: 'King Solomon', scriptureRef: '1 Kings 1-11', icon: '🏛️', description: 'Wisdom, Temple, and “Half Heart for God”.' },
  { step: 69, era: 'United Kingdom', title: '“Half Heart for God” (Solomon)', scriptureRef: '1 Kings 11', icon: '💔', description: 'Foreign wives turning heart to idolatry.' },

  // 6. Divided Kingdom & Exile (70–79)
  { step: 70, era: 'Divided Kingdom & Exile', title: 'Kingdom Divides (930 B.C.)', scriptureRef: '1 Kings 12', icon: '⚡', description: 'Rehoboam in South; Jeroboam in North.' },
  { step: 71, era: 'Divided Kingdom & Exile', title: '350 Years of Division', scriptureRef: '1 Kings 12-2 Kings 25', icon: '⏳', description: 'War, idolatry, and prophetic warnings.' },
  { step: 72, era: 'Divided Kingdom & Exile', title: 'North (Israel) & South (Judah)', scriptureRef: '1 Kings 12', icon: '🧭', description: '10 tribes North (Samaria); 2 tribes South (Jerusalem).' },
  { step: 73, era: 'Divided Kingdom & Exile', title: '19 Kings of Israel / 20 Kings of Judah', scriptureRef: '1-2 Kings', icon: '👑', description: 'Israel: 0 good kings. Judah: 8 good kings.' },
  { step: 74, era: 'Divided Kingdom & Exile', title: 'Prophets Speak Yahweh’s Words', scriptureRef: 'Isaiah, Jeremiah, Hosea', icon: '📢', description: '“Shape up or ship out!”' },
  { step: 75, era: 'Divided Kingdom & Exile', title: 'Elijah & Elisha', scriptureRef: '1 Kings 17-2 Kings 13', icon: '🔥', description: 'Mount Carmel fire and chariot of flame.' },
  { step: 76, era: 'Divided Kingdom & Exile', title: 'Good Kings: Hezekiah & Josiah', scriptureRef: '2 Kings 18-23', icon: '🕯️', description: 'Passover renewal and rediscover of the Law.' },
  { step: 77, era: 'Divided Kingdom & Exile', title: 'Assyria Destroys Northern Kingdom (722 B.C.)', scriptureRef: '2 Kings 17', icon: '⛓️', description: 'Israel scattered into exile.' },
  { step: 78, era: 'Divided Kingdom & Exile', title: 'Babylonian Invasions (605, 597, 586 B.C.)', scriptureRef: '2 Kings 24-25', icon: '🏹', description: 'Nebuchadnezzar besieges Jerusalem.' },
  { step: 79, era: 'Divided Kingdom & Exile', title: 'Temple Destroyed & Judah Exiled (586 B.C.)', scriptureRef: '2 Kings 25', icon: '🔥', description: 'Walls broken down; 70-year Babylonian captivity.' },

  // 7. Return & Restoration (80–89)
  { step: 80, era: 'Return & Restoration', title: '70 Years Babylonian Captivity', scriptureRef: 'Jeremiah 29:10', icon: '⏳', description: 'Daniel and Ezekiel ministering in Babylon.' },
  { step: 81, era: 'Return & Restoration', title: 'Cyrus Decrees Return (538 B.C.)', scriptureRef: 'Ezra 1, 2 Chron 36', icon: '📜', description: 'Persian Empire opens the way home.' },
  { step: 82, era: 'Return & Restoration', title: 'Wave 1: Zerubbabel Rebuilds Temple (536 B.C.)', scriptureRef: 'Ezra 3-6', icon: '🏛️', description: 'Second Temple completed under Haggai & Zechariah.' },
  { step: 83, era: 'Return & Restoration', title: 'Queen Esther in Susa', scriptureRef: 'Esther 1-10', icon: '👸', description: '“For such a time as this” saving the Jewish race.' },
  { step: 84, era: 'Return & Restoration', title: 'Wave 2: Ezra Rebuilds the People (458 B.C.)', scriptureRef: 'Ezra 7-10', icon: '📖', description: 'Teaching the Torah and spiritual purification.' },
  { step: 85, era: 'Return & Restoration', title: 'Wave 3: Nehemiah Rebuilds the Wall (445 B.C.)', scriptureRef: 'Nehemiah 1-6', icon: '🧱', description: 'Jerusalem’s walls restored in 52 days.' },
  { step: 86, era: 'Return & Restoration', title: 'Covenant Renewal with Great Joy', scriptureRef: 'Nehemiah 8-9', icon: '🎉', description: 'The joy of the Lord is your strength!' },
  { step: 87, era: 'Return & Restoration', title: 'Malachi’s Final Prophecy', scriptureRef: 'Malachi 3-4', icon: '☀️', description: 'Sun of Righteousness rising with healing in His wings.' },
  { step: 88, era: 'Return & Restoration', title: 'Elijah to Come', scriptureRef: 'Malachi 4:5-6', icon: '🕊️', description: 'Turning hearts of fathers to children.' },
  { step: 89, era: 'Return & Restoration', title: 'Old Testament Canon Closed', scriptureRef: 'Malachi 4', icon: '📕', description: 'The prophetic witness sealed awaiting the Messiah.' },

  // 8. Silence & Fulfillment (90–91)
  { step: 90, era: 'Silence & Fulfillment', title: '400 Years of Prophetic Silence', scriptureRef: 'Intertestamental Era', icon: '🤫', description: 'Greek language, Roman roads, and Jewish diaspora prepare the world.' },
  { step: 91, era: 'Silence & Fulfillment', title: 'Fulfillment in Jesus Christ', scriptureRef: 'Galatians 4:4, Matt 1', icon: '✝️', description: '“In the fullness of time, God sent forth His Son!”' },
]

// Life of Jesus Chronological Stages (Luke Journey)
export const LIFE_OF_JESUS_STAGES = [
  { stage: 1, location: 'Judah / Nazareth', title: 'Annunciation to Zechariah & Mary', scripture: 'Luke 1', icon: '🕊️' },
  { stage: 2, location: 'Bethlehem', title: 'Birth of Jesus in the Manger', scripture: 'Luke 2:1-20', icon: '🌟' },
  { stage: 3, location: 'Nazareth', title: 'Youth & Carpenter in Nazareth', scripture: 'Luke 2:51-52', icon: '🔨' },
  { stage: 4, location: 'Jordan River', title: 'Baptism by John the Baptist', scripture: 'Luke 3:21-22', icon: '💧' },
  { stage: 5, location: 'Judean Wilderness', title: 'Temptation in the Wilderness', scripture: 'Luke 4:1-13', icon: '🏜️' },
  { stage: 6, location: 'Jerusalem', title: 'New Birth Teaching with Nicodemus', scripture: 'John 3:1-21', icon: '🕯️' },
  { stage: 7, location: 'Sychar (Samaria)', title: 'Living Water at the Well', scripture: 'John 4:1-42', icon: '🏺' },
  { stage: 8, location: 'Capernaum / Galilee', title: 'Selection of 12 & Sermon on Plain', scripture: 'Luke 5-6', icon: '⛰️' },
  { stage: 9, location: 'Sea of Galilee', title: 'Calming the Storm & Feeding 5,000', scripture: 'Luke 8-9', icon: '⛵' },
  { stage: 10, location: 'Mount of Transfiguration', title: 'Peter’s Confession & Transfiguration', scripture: 'Luke 9:28-36', icon: '✨' },
  { stage: 11, location: 'Perea / Judea', title: 'Parables of Grace (Lost Sheep & Prodigal)', scripture: 'Luke 14-15', icon: '🐑' },
  { stage: 12, location: 'Bethany', title: 'Lazarus Raised from the Dead', scripture: 'John 11:1-44', icon: '⚡' },
  { stage: 13, location: 'Jerusalem', title: 'Triumphal Entry & Temple Cleansing', scripture: 'Luke 19:28-48', icon: '🌿' },
  { stage: 14, location: 'Jerusalem (Calvary & Tomb)', title: 'Last Supper, Crucifixion & Resurrection', scripture: 'Luke 22-24', icon: '✝️' },
]

// Acts & Missionary Journeys Stages
export const ACTS_MISSIONARY_STAGES = [
  { stage: 1, title: 'Ascension & Pentecost Outpouring', scripture: 'Acts 1-2', icon: '🔥', location: 'Jerusalem' },
  { stage: 2, title: 'Early Church & Deacons Chosen', scripture: 'Acts 3-6', icon: '🏛️', location: 'Jerusalem' },
  { stage: 3, title: 'Stephen’s Martyrdom & Gospel Spread', scripture: 'Acts 7-8', icon: '💎', location: 'Samaria' },
  { stage: 4, title: 'Saul’s Damascus Road Conversion', scripture: 'Acts 9', icon: '☀️', location: 'Damascus' },
  { stage: 5, title: 'Peter’s Vision & Gentile Ingathering', scripture: 'Acts 10-11', icon: '🕊️', location: 'Caesarea' },
  { stage: 6, title: 'Paul’s 1st Missionary Journey (c. A.D. 46–49)', scripture: 'Acts 13-14', icon: '⛵', location: 'Cyprus & Galatia' },
  { stage: 7, title: 'The Jerusalem Council (Grace Without Law)', scripture: 'Acts 15', icon: '📜', location: 'Jerusalem' },
  { stage: 8, title: 'Paul’s 2nd Missionary Journey (c. A.D. 49–52)', scripture: 'Acts 16-18', icon: '⚓', location: 'Philippi, Athens, Corinth' },
  { stage: 9, title: 'Paul’s 3rd Missionary Journey (c. A.D. 52–57)', scripture: 'Acts 18-21', icon: '🛡️', location: 'Ephesus & Asia' },
  { stage: 10, title: 'Arrest in Jerusalem & Trials', scripture: 'Acts 21-26', icon: '⛓️', location: 'Jerusalem & Caesarea' },
  { stage: 11, title: 'Voyage to Rome & Shipwreck on Malta', scripture: 'Acts 27-28', icon: '🌊', location: 'Malta' },
  { stage: 12, title: '1st Roman Imprisonment (Prison Epistles)', scripture: 'Acts 28:30-31', icon: '✍️', location: 'Rome' },
  { stage: 13, title: 'Pastoral Ministry & Expansion', scripture: '1 Timothy, Titus', icon: '🌿', location: 'Crete & Ephesus' },
  { stage: 14, title: '2nd Roman Imprisonment & Martyrdom', scripture: '2 Timothy 4:6-8', icon: '🏆', location: 'Rome' },
  { stage: 15, title: 'Gospel Unhindered to the Ends of the Earth', scripture: 'Acts 28:31, Rev 21', icon: '👑', location: 'Global' },
]

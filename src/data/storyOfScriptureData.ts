// Story of Scripture Master Curriculum Dataset
// Extracted from "The Story of Scripture (Theme Pictures and Verses)"

export interface BiblicalBookTheme {
  book: string
  division: 'Pentateuch' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Pauline' | 'General' | 'Prophecy'
  subdivision: string
  theme: string
  keyVerse: string
  christInBook: string
  keyInsight?: string
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
  mnemonic?: string
  icon?: string
}

export interface EraMnemonic {
  id: string
  era: string
  title: string
  acronymOrPhrase: string
  breakdown: { label: string; meaning: string }[]
  scripture: string
}

export const BOOK_THEMES: BiblicalBookTheme[] = [
  // Pentateuch (5)
  { book: 'Genesis', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Beginnings & Promise', keyVerse: 'Genesis 12:1-3', christInBook: 'The Seed of the Woman (Gen 3:15) and the Ark of Salvation', keyInsight: 'Covenant of works broken in Adam; Covenant of Grace promised in Abraham.', date: 'c. 1446-1406 B.C.', icon: '🌿', color: 'emerald' },
  { book: 'Exodus', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Redemption & Divine Presence', keyVerse: 'Exodus 19:4-6', christInBook: 'The Passover Lamb, Pillar of Fire, and True Tabernacle', keyInsight: 'God redeems a people by blood and power to dwell in their midst.', date: 'c. 1446-1406 B.C.', icon: '🔥', color: 'amber' },
  { book: 'Leviticus', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Holiness of God & Atonement', keyVerse: 'Leviticus 19:2', christInBook: 'The Great High Priest and Spotless Sacrificial Victim', keyInsight: 'Without the shedding of blood there is no remission of sin.', date: 'c. 1445 B.C.', icon: '🕊️', color: 'purple' },
  { book: 'Numbers', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Wilderness Faithfulness', keyVerse: 'Numbers 14:22-23', christInBook: 'The Lifted-Up Bronze Serpent and Smitten Rock', keyInsight: 'God’s unfailing preservation of His pilgrim flock despite unbelief.', date: 'c. 1445-1406 B.C.', icon: '⛺', color: 'orange' },
  { book: 'Deuteronomy', division: 'Pentateuch', subdivision: 'Law & Beginnings', theme: 'Covenant Love & Obedience', keyVerse: 'Deuteronomy 6:4-5', christInBook: 'The Prophet Greater Than Moses (Deut 18:15)', keyInsight: 'Heart circumcision and wholehearted covenant loyalty.', date: 'c. 1406 B.C.', icon: '📜', color: 'blue' },

  // Historical Books (12)
  { book: 'Joshua', division: 'History', subdivision: 'Conquest & Settlement', theme: 'Promise Fulfilled & Conquest', keyVerse: 'Joshua 21:43-45', christInBook: 'The Captain of the Lord’s Host (Josh 5:14)', keyInsight: 'Not one good word of all God’s promises failed.', date: 'c. 1400-1375 B.C.', icon: '⚔️', color: 'red' },
  { book: 'Judges', division: 'History', subdivision: 'Conquest & Settlement', theme: 'Cycle of Sin & Deliverance', keyVerse: 'Judges 21:25', christInBook: 'The True and Eternal Judge-Deliverer', keyInsight: 'Human depravity cries out for a righteous, divine King.', date: 'c. 1375-1050 B.C.', icon: '🔄', color: 'stone' },
  { book: 'Ruth', division: 'History', subdivision: 'Conquest & Settlement', theme: 'Redeeming Love & Kinsman Redeemer', keyVerse: 'Ruth 4:14-15', christInBook: 'Our Go’el (Kinsman-Redeemer)', keyInsight: 'Gentile bride grafted into the messianic genealogy of David.', date: 'c. 1100 B.C.', icon: '🌾', color: 'amber' },
  { book: '1 Samuel', division: 'History', subdivision: 'United Kingdom', theme: 'Rise of Kingship', keyVerse: '1 Samuel 13:14', christInBook: 'The Lord’s Anointed King (Davidic Archetype)', keyInsight: 'God looks at the heart, preparing David’s royal line.', date: 'c. 1050-1010 B.C.', icon: '👑', color: 'indigo' },
  { book: '2 Samuel', division: 'History', subdivision: 'United Kingdom', theme: 'Davidic Covenant & Kingdom', keyVerse: '2 Samuel 7:12-16', christInBook: 'The Son of David Whose Kingdom Shall Never End', keyInsight: 'The unconditional Davidic Covenant guaranteeing the Messiah’s throne.', date: 'c. 1010-970 B.C.', icon: '🏰', color: 'blue' },
  { book: '1 Kings', division: 'History', subdivision: 'Divided Kingdom', theme: 'Divided Kingdom & Prophecy', keyVerse: '1 Kings 11:11', christInBook: 'The King Greater Than Solomon in Wisdom and Glory', keyInsight: 'Idolatry fractures the nation; prophets rise as covenant prosecutors.', date: 'c. 970-850 B.C.', icon: '⚡', color: 'amber' },
  { book: '2 Kings', division: 'History', subdivision: 'Divided Kingdom & Exile', theme: 'Exile & Covenant Curse', keyVerse: '2 Kings 17:7-23', christInBook: 'The Preserver of the Remnant and Miracle-Worker', keyInsight: 'Covenant infidelity leads to exile, yet God preserves the royal line.', date: 'c. 850-586 B.C.', icon: '⛓️', color: 'gray' },
  { book: '1 Chronicles', division: 'History', subdivision: 'Davidic Hope', theme: 'Davidic Hope & True Worship', keyVerse: '1 Chronicles 17:11-14', christInBook: 'The Ultimate Temple-Builder and Eternal Monarch', keyInsight: 'Priestly perspective encouraging returning exiles with messianic hope.', date: 'c. 450-400 B.C.', icon: '🏛️', color: 'sky' },
  { book: '2 Chronicles', division: 'History', subdivision: 'Davidic Hope', theme: 'Temple & Call to Repentance', keyVerse: '2 Chronicles 7:14', christInBook: 'The Glory Filling the Temple and True Intercessor', keyInsight: 'If My people humble themselves and pray, I will heal their land.', date: 'c. 450-400 B.C.', icon: '🕯️', color: 'yellow' },
  { book: 'Ezra', division: 'History', subdivision: 'Restoration', theme: 'Restoration of the Temple', keyVerse: 'Ezra 7:10', christInBook: 'The Builder of the Living Temple and Master Scribe', keyInsight: 'God stirs pagan kings (Cyrus) to fulfill His redemptive decrees.', date: 'c. 538-450 B.C.', icon: '🧱', color: 'teal' },
  { book: 'Nehemiah', division: 'History', subdivision: 'Restoration', theme: 'Restoration of the People & Wall', keyVerse: 'Nehemiah 8:10', christInBook: 'The Restorer of Broken Walls and Protector of the City of God', keyInsight: 'The joy of the Lord is your strength.', date: 'c. 445-420 B.C.', icon: '🛡️', color: 'cyan' },
  { book: 'Esther', division: 'History', subdivision: 'Restoration', theme: 'God’s Sovereign Providence', keyVerse: 'Esther 4:14', christInBook: 'Our Advocate at Court and Deliverer of His People', keyInsight: 'Though God’s name is never mentioned, His hand is on every page.', date: 'c. 483-473 B.C.', icon: '👸', color: 'rose' },

  // Poetry & Wisdom (5)
  { book: 'Job', division: 'Poetry', subdivision: 'Wisdom Literature', theme: 'Sovereign Wisdom in Suffering', keyVerse: 'Job 42:2', christInBook: 'Our Living Redeemer (Job 19:25) and Mediator', keyInsight: 'God’s wisdom transcends human understanding through deep trials.', date: 'Patriarchal Era', icon: '🌪️', color: 'slate' },
  { book: 'Psalms', division: 'Poetry', subdivision: 'Worship & Hymns', theme: 'Worship & Messianic Kingship', keyVerse: 'Psalm 2:7', christInBook: 'The Anointed King, Good Shepherd, and Pierced Savior (Ps 22)', keyInsight: 'The prayer book of the Son of David for the worshipping assembly.', date: 'c. 1000-450 B.C.', icon: '🎵', color: 'violet' },
  { book: 'Proverbs', division: 'Poetry', subdivision: 'Wisdom Literature', theme: 'Wise Living in the Fear of the Lord', keyVerse: 'Proverbs 1:7', christInBook: 'The Eternal Incarnate Wisdom of God (1 Cor 1:30)', keyInsight: 'Skill in the art of godly living under divine authority.', date: 'c. 970-700 B.C.', icon: '💎', color: 'amber' },
  { book: 'Ecclesiastes', division: 'Poetry', subdivision: 'Wisdom Literature', theme: 'Meaning Under the Sun & Fear God', keyVerse: 'Ecclesiastes 12:13', christInBook: 'The One Shepherd Giving True Eternal Purpose', keyInsight: 'All worldly pursuits without God are vanity of vanities.', date: 'c. 935 B.C.', icon: '⏳', color: 'stone' },
  { book: 'Song of Solomon', division: 'Poetry', subdivision: 'Covenant Love', theme: 'Covenant Love & Holy Passion', keyVerse: 'Song of Solomon 8:6-7', christInBook: 'The Heavenly Bridegroom Who Loves His Bride', keyInsight: 'Celebration of marital intimacy reflecting Christ and the Church.', date: 'c. 965 B.C.', icon: '🌹', color: 'pink' },

  // Major & Minor Prophets (17)
  { book: 'Isaiah', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'Salvation Through the Suffering Servant', keyVerse: 'Isaiah 53:5', christInBook: 'Immanuel, Wonderful Counselor, and Pierced Servant (Isa 53)', keyInsight: 'The Fifth Gospel revealing Christ’s substitutionary death and exaltation.', date: 'c. 740-681 B.C.', icon: '☀️', color: 'orange' },
  { book: 'Jeremiah', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'The Promised New Covenant', keyVerse: 'Jeremiah 31:31-34', christInBook: 'The Righteous Branch and Author of the New Covenant', keyInsight: 'Law written on hearts and sins remembered no more.', date: 'c. 627-586 B.C.', icon: '💧', color: 'blue' },
  { book: 'Lamentations', division: 'Prophets', subdivision: 'Exilic Period', theme: 'Hope in the Midst of Judgment', keyVerse: 'Lamentations 3:22-23', christInBook: 'The Man of Sorrows Weeping Over Jerusalem', keyInsight: 'Great is Your faithfulness; His compassions are new every morning.', date: 'c. 586 B.C.', icon: '🖤', color: 'gray' },
  { book: 'Ezekiel', division: 'Prophets', subdivision: 'Exilic Period', theme: 'New Heart & God’s Radiant Glory', keyVerse: 'Ezekiel 36:26-27', christInBook: 'The True Shepherd and Fountain of Living Waters', keyInsight: 'Heart of stone replaced with heart of flesh by the Holy Spirit.', date: 'c. 593-571 B.C.', icon: '🔥', color: 'emerald' },
  { book: 'Daniel', division: 'Prophets', subdivision: 'Exilic Period', theme: 'God’s Sovereign Everlasting Kingdom', keyVerse: 'Daniel 7:13-14', christInBook: 'The Son of Man Coming on the Clouds and the Smiting Stone', keyInsight: 'Earthly empires crumble; Christ’s kingdom shall endure forever.', date: 'c. 605-536 B.C.', icon: '🦁', color: 'yellow' },
  { book: 'Hosea', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'God’s Unfailing Faithful Love', keyVerse: 'Hosea 11:1-4', christInBook: 'The Faithful Husband Redeeming His Wayward Bride', keyInsight: 'Hesed: Unconditional covenant steadfast love triumphing over rebellion.', date: 'c. 755-715 B.C.', icon: '💍', color: 'rose' },
  { book: 'Joel', division: 'Prophets', subdivision: 'Undated / Pre-Exilic', theme: 'The Outpouring Day of the Lord', keyVerse: 'Joel 2:28-32', christInBook: 'The Baptizer with the Holy Spirit and Refuge on Mount Zion', keyInsight: 'Whoever calls on the name of the Lord shall be saved.', date: 'c. 835 B.C.', icon: '🌾', color: 'purple' },
  { book: 'Amos', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'Social Justice & Righteousness', keyVerse: 'Amos 5:24', christInBook: 'The Restorer of David’s Fallen Booth (Amos 9:11)', keyInsight: 'Let justice roll down like waters, and righteousness like a mighty stream.', date: 'c. 760-753 B.C.', icon: '⚖️', color: 'red' },
  { book: 'Obadiah', division: 'Prophets', subdivision: 'Pre-Exilic', theme: 'Judgment on Pride & Zion Deliverance', keyVerse: 'Obadiah 1:15', christInBook: 'The Judge of Nations and King on Mount Zion', keyInsight: 'Pride goes before destruction; the kingdom shall be the Lord’s.', date: 'c. 845 / 586 B.C.', icon: '🦅', color: 'stone' },
  { book: 'Jonah', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'God’s Boundless Mercy to the Nations', keyVerse: 'Jonah 4:2', christInBook: 'The Sign of Jonah: Three Days in the Tomb and Resurrection', keyInsight: 'Salvation belongs to the Lord, extended freely to Gentiles.', date: 'c. 760 B.C.', icon: '🐋', color: 'teal' },
  { book: 'Micah', division: 'Prophets', subdivision: 'Pre-Exilic (Assyrian)', theme: 'The Coming Shepherd-King of Bethlehem', keyVerse: 'Micah 5:2', christInBook: 'The Ruler Born in Bethlehem Whose Goings Forth Are From Old', keyInsight: 'What does the Lord require? Do justice, love mercy, walk humbly.', date: 'c. 735-700 B.C.', icon: '🌟', color: 'amber' },
  { book: 'Nahum', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'Vindication & Judgment on Nineveh', keyVerse: 'Nahum 1:7-8', christInBook: 'The Stronghold in the Day of Trouble', keyInsight: 'The Lord is good, a stronghold; evil empires will not escape justice.', date: 'c. 663-612 B.C.', icon: '⚡', color: 'orange' },
  { book: 'Habakkuk', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'The Just Shall Live by Faith', keyVerse: 'Habakkuk 2:4', christInBook: 'The Holy One From Mount Paran and Source of Our Joy', keyInsight: 'The foundational motto of the Reformation: justification by faith.', date: 'c. 607-605 B.C.', icon: '🛡️', color: 'blue' },
  { book: 'Zephaniah', division: 'Prophets', subdivision: 'Pre-Exilic (Babylonian)', theme: 'Purifying Judgment & Joyful Restoration', keyVerse: 'Zephaniah 3:17', christInBook: 'The King Rejoicing Over His Redeemed Bride with Singing', keyInsight: 'The Lord your God in your midst is mighty to save.', date: 'c. 622 B.C.', icon: '🎺', color: 'violet' },
  { book: 'Haggai', division: 'Prophets', subdivision: 'Post-Exilic (Persian)', theme: 'Rebuilding God’s Temple', keyVerse: 'Haggai 1:8', christInBook: 'The Desire of All Nations Filling the House with Greater Glory', keyInsight: 'Seek first God’s kingdom and house before personal paneled houses.', date: 'c. 520 B.C.', icon: '🔨', color: 'emerald' },
  { book: 'Zechariah', division: 'Prophets', subdivision: 'Post-Exilic (Persian)', theme: 'The Coming Humble King & Pierced Messiah', keyVerse: 'Zechariah 9:9', christInBook: 'The King on a Donkey, Sold for 30 Silver Pieces, and Pierced', keyInsight: 'Not by might nor by power, but by My Spirit, says the Lord.', date: 'c. 520-480 B.C.', icon: '👑', color: 'sky' },
  { book: 'Malachi', division: 'Prophets', subdivision: 'Post-Exilic (Persian)', theme: 'Covenant Renewal & Sun of Righteousness', keyVerse: 'Malachi 3:1', christInBook: 'The Messenger of the Covenant and Sun of Righteousness', keyInsight: 'The final Old Testament promise before 400 years of preparation.', date: 'c. 430 B.C.', icon: '☀️', color: 'yellow' },

  // Gospels & Acts (5)
  { book: 'Matthew', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Promised King & Kingdom', keyVerse: 'Matthew 28:18-20', christInBook: 'The King of the Jews, Son of David, and Immanuel', keyInsight: 'Fulfillment of all Old Testament prophecies and the Great Commission.', date: 'c. A.D. 50-70', icon: '👑', color: 'amber' },
  { book: 'Mark', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Suffering Servant of the Lord', keyVerse: 'Mark 10:45', christInBook: 'The Servant Who Came Not to be Served, But to Give His Life', keyInsight: 'Urgent, action-packed Gospel of the servant-leader.', date: 'c. A.D. 55-65', icon: '🦁', color: 'red' },
  { book: 'Luke', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Compassionate Savior for All', keyVerse: 'Luke 19:10', christInBook: 'The Son of Man Who Came to Seek and Save the Lost', keyInsight: 'Universal scope of grace for outcasts, women, and Gentiles.', date: 'c. A.D. 60-62', icon: '🕊️', color: 'blue' },
  { book: 'John', division: 'Gospels', subdivision: 'Gospel Record', theme: 'The Eternal Son of God', keyVerse: 'John 20:31', christInBook: 'The Word Made Flesh, I AM, and Light of the World', keyInsight: 'Believe that Jesus is the Christ, and have life in His name.', date: 'c. A.D. 85-95', icon: '🦅', color: 'purple' },
  { book: 'Acts', division: 'History', subdivision: 'Early Church', theme: 'The Holy Spirit & Global Mission', keyVerse: 'Acts 1:8', christInBook: 'The Ascended Lord Pouring Out the Spirit From the Throne', keyInsight: 'The unstoppable advance of the Gospel from Jerusalem to Rome.', date: 'c. A.D. 62-64', icon: '🔥', color: 'emerald' },

  // Pauline Epistles (13)
  { book: 'Romans', division: 'Pauline', subdivision: '3rd Journey', theme: 'Justification by Faith in Christ', keyVerse: 'Romans 1:16-17', christInBook: 'Our Righteousness, Justifier, and Everlasting Security (Rom 8)', keyInsight: 'The grand cathedral of Christian doctrine: grace alone by faith alone.', date: 'c. A.D. 57', icon: '⚖️', color: 'indigo' },
  { book: '1 Corinthians', division: 'Pauline', subdivision: '3rd Journey', theme: 'Church Holiness & Crucified Wisdom', keyVerse: '1 Corinthians 1:18', christInBook: 'The Wisdom and Power of God, and Firstfruits of Resurrection', keyInsight: 'The cross humbles worldly wisdom; love is the more excellent way.', date: 'c. A.D. 55', icon: '🏛️', color: 'violet' },
  { book: '2 Corinthians', division: 'Pauline', subdivision: '3rd Journey', theme: 'Power Made Perfect in Weakness', keyVerse: '2 Corinthians 12:9', christInBook: 'Our Comfort, Reconciliation, and Supreme Treasure in Jars of Clay', keyInsight: 'My grace is sufficient for you, for My power is perfected in weakness.', date: 'c. A.D. 56', icon: '🏺', color: 'pink' },
  { book: 'Galatians', division: 'Pauline', subdivision: '1st Journey', theme: 'Freedom in Christ & Grace Alone', keyVerse: 'Galatians 2:16', christInBook: 'Our Liberator Who Redeemed Us From the Curse of the Law', keyInsight: 'The Magna Carta of Christian Liberty: free from legalism.', date: 'c. A.D. 48-49', icon: '🕊️', color: 'teal' },
  { book: 'Ephesians', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'Cosmic Unity in Christ (Sit, Walk, Stand)', keyVerse: 'Ephesians 2:14', christInBook: 'The Head of the Church in Whom All Things Are United', keyInsight: 'By grace you have been saved through faith; united as one new man.', date: 'c. A.D. 60-62', icon: '🛡️', color: 'blue' },
  { book: 'Philippians', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'Unshakable Joy in Christ', keyVerse: 'Philippians 4:4', christInBook: 'The Self-Emptying Servant Highly Exalted (Phil 2:5-11)', keyInsight: 'Rejoice in the Lord always! To live is Christ, to die is gain.', date: 'c. A.D. 61', icon: '✨', color: 'yellow' },
  { book: 'Colossians', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'The Absolute Supremacy of Christ', keyVerse: 'Colossians 1:15-18', christInBook: 'The Image of the Invisible God, in Whom All Fullness Dwells', keyInsight: 'Christ is all and in all; complete in Him against all empty philosophies.', date: 'c. A.D. 60-62', icon: '👑', color: 'purple' },
  { book: '1 Thessalonians', division: 'Pauline', subdivision: '2nd Journey', theme: 'The Blessed Hope of Christ’s Return', keyVerse: '1 Thessalonians 4:16-17', christInBook: 'The Returning Lord Descending with a Shout and Trumpet', keyInsight: 'Comfort one another with the promise of the resurrection and return.', date: 'c. A.D. 50-51', icon: '🎺', color: 'sky' },
  { book: '2 Thessalonians', division: 'Pauline', subdivision: '2nd Journey', theme: 'Standing Firm in the Truth', keyVerse: '2 Thessalonians 2:15', christInBook: 'The Glorious Judge Slaying the Lawless One by His Breath', keyInsight: 'Do not be shaken; work faithfully while awaiting the day of Christ.', date: 'c. A.D. 51-52', icon: '⚓', color: 'cyan' },
  { book: '1 Timothy', division: 'Pauline', subdivision: 'Pastoral Epistles', theme: 'Church Order & Sound Doctrine', keyVerse: '1 Timothy 3:15', christInBook: 'The One Mediator Between God and Men (1 Tim 2:5)', keyInsight: 'Guarding the good deposit in the household of God.', date: 'c. A.D. 62-64', icon: '📜', color: 'emerald' },
  { book: '2 Timothy', division: 'Pauline', subdivision: 'Pastoral Epistles', theme: 'Enduring Faithfulness to the End', keyVerse: '2 Timothy 4:7', christInBook: 'The Righteous Judge Awarding the Crown of Righteousness', keyInsight: 'I have fought the good fight, finished the race, kept the faith.', date: 'c. A.D. 66-67', icon: '🏆', color: 'amber' },
  { book: 'Titus', division: 'Pauline', subdivision: 'Pastoral Epistles', theme: 'Good Works & Godly Living', keyVerse: 'Titus 2:11-12', christInBook: 'Our Great God and Savior Jesus Christ (Titus 2:13)', keyInsight: 'Grace trains believers to renounce ungodliness and do good works.', date: 'c. A.D. 63-65', icon: '🌿', color: 'teal' },
  { book: 'Philemon', division: 'Pauline', subdivision: 'Prison Epistles', theme: 'Reconciliation & Brotherly Love', keyVerse: 'Philemon 1:16', christInBook: 'Our Advocate Imputing Debts to Himself (Phlm 18)', keyInsight: 'Gospel transformation heals human brokenness and slavery into brotherhood.', date: 'c. A.D. 60-62', icon: '🤝', color: 'rose' },

  // General Epistles & Revelation (9)
  { book: 'Hebrews', division: 'General', subdivision: 'General Epistles', theme: 'The Absolute Superiority of Christ', keyVerse: 'Hebrews 4:14-16', christInBook: 'Our Superior High Priest After the Order of Melchizedek', keyInsight: 'Better covenant, better promises, better sacrifice, once for all.', date: 'c. A.D. 64-68', icon: '✝️', color: 'indigo' },
  { book: 'James', division: 'General', subdivision: 'General Epistles', theme: 'Living Faith That Works', keyVerse: 'James 2:17', christInBook: 'The Glorious Lord Jesus Christ and Giver of Wisdom', keyInsight: 'Faith without works is dead; be doers of the Word.', date: 'c. A.D. 45-48', icon: '🌱', color: 'emerald' },
  { book: '1 Peter', division: 'General', subdivision: 'Petrine Epistles', theme: 'Living Hope in the Midst of Suffering', keyVerse: '1 Peter 1:3', christInBook: 'The Chief Shepherd and Living Cornerstone', keyInsight: 'Suffering precedes glory; stand firm in the true grace of God.', date: 'c. A.D. 62-64', icon: '⚓', color: 'blue' },
  { book: '2 Peter', division: 'General', subdivision: 'Petrine Epistles', theme: 'Guarding Truth Against False Teachers', keyVerse: '2 Peter 1:3', christInBook: 'The Day Star Rising in Our Hearts', keyInsight: 'Grow in the grace and knowledge of our Lord and Savior.', date: 'c. A.D. 64-67', icon: '🛡️', color: 'red' },
  { book: '1 John', division: 'General', subdivision: 'Johannine Epistles', theme: 'Assurance in Truth, Light, and Love', keyVerse: '1 John 5:13', christInBook: 'The Word of Life, Advocate, and Propitiation for Our Sins', keyInsight: 'These things I write to you that you may know you have eternal life.', date: 'c. A.D. 85-95', icon: '❤️', color: 'rose' },
  { book: '2 John', division: 'General', subdivision: 'Johannine Epistles', theme: 'Walking in Truth and Love', keyVerse: '2 John 1:6', christInBook: 'The Son of the Father in Truth and Love', keyInsight: 'Hold fast to apostolic doctrine; do not welcome deceivers.', date: 'c. A.D. 85-95', icon: '🚶', color: 'amber' },
  { book: '3 John', division: 'General', subdivision: 'Johannine Epistles', theme: 'Hospitality & Supporting Gospel Truth', keyVerse: '3 John 1:5-6', christInBook: 'The Truth for Whose Name We Go Forth as Fellow Workers', keyInsight: 'Support gospel workers that we may be fellow workers for the truth.', date: 'c. A.D. 85-95', icon: '🏠', color: 'teal' },
  { book: 'Jude', division: 'General', subdivision: 'General Epistles', theme: 'Contending Earnestly for the Faith', keyVerse: 'Jude 1:3', christInBook: 'The Only God Our Savior Able to Keep Us From Stumbling', keyInsight: 'Contend for the faith once for all delivered to the saints.', date: 'c. A.D. 65-80', icon: '⚔️', color: 'stone' },
  { book: 'Revelation', division: 'Prophecy', subdivision: 'New Creation', theme: 'The Triumphant Christ & New Creation', keyVerse: 'Revelation 21:1-5', christInBook: 'The Alpha and Omega, Slain Lion-Lamb, King of Kings', keyInsight: 'Behold, I make all things new! Worthy is the Lamb that was slain.', date: 'c. A.D. 95-96', icon: '👑', color: 'purple' },
]

export function getBookTheme(bookName: string): BiblicalBookTheme | undefined {
  const norm = bookName.trim().toLowerCase()
  return BOOK_THEMES.find(
    b => b.book.toLowerCase() === norm || b.book.toLowerCase().replace(/\s+/g, '') === norm.replace(/\s+/g, '')
  )
}

// Famous Walk Thru Mnemonics & Key Concepts
export const ERA_MNEMONICS: EraMnemonic[] = [
  {
    id: 'salt-mnemonic',
    era: 'Patriarchs',
    title: 'The "SALT" Pilgrim Family',
    acronymOrPhrase: 'S • A • L • T',
    breakdown: [
      { label: 'S', meaning: 'Sarah — Mother of Promise' },
      { label: 'A', meaning: 'Abraham — Father of Faith (Called from Ur to Canaan)' },
      { label: 'L', meaning: 'Lot — Nephew rescued from Sodom' },
      { label: 'T', meaning: 'Terah — Father who stopped and died in Haran' }
    ],
    scripture: 'Genesis 11–25'
  },
  {
    id: 'pharaoh-mnemonic',
    era: 'Exodus & Wilderness',
    title: 'The Great Confrontation',
    acronymOrPhrase: '"Let My People Go" → "NO!"',
    breakdown: [
      { label: 'God’s Demand', meaning: 'Let My people go, that they may serve Me in the wilderness' },
      { label: 'Pharaoh’s Defiance', meaning: 'Who is the Lord, that I should obey His voice?' },
      { label: '10 Plagues', meaning: 'Decisive divine victory over Egypt’s pantheon and gods' },
      { label: 'Passover & Sea', meaning: 'Blood on the doorposts & the parting of the Red Sea' }
    ],
    scripture: 'Exodus 5–14'
  },
  {
    id: 'prophets-motto',
    era: 'Divided Kingdom',
    title: 'The Prophetic Cry',
    acronymOrPhrase: '"Shape Up or Ship Out!"',
    breakdown: [
      { label: 'Covenant Lawsuit', meaning: 'Prophets sent as prosecutors declaring God’s broken covenant' },
      { label: 'Shape Up', meaning: 'Repent of idolatry, establish social justice, and return to Yahweh' },
      { label: 'Ship Out', meaning: 'Exile to Assyria (North 722 BC) & Babylon (South 586 BC)' }
    ],
    scripture: 'Isaiah, Jeremiah, Hosea, Amos'
  },
  {
    id: 'divided-kings',
    era: 'Divided Kingdom',
    title: 'Kingdom Division Stats',
    acronymOrPhrase: '19 vs 20 Kings • (0 vs 8 Good)',
    breakdown: [
      { label: 'Northern Israel', meaning: '19 Kings across 9 dynasties — exactly 0 good kings (All walked in Jeroboam’s sin)' },
      { label: 'Southern Judah', meaning: '20 Kings in Davidic line — 8 good kings (Asa, Jehoshaphat, Hezekiah, Josiah...)' }
    ],
    scripture: '1 & 2 Kings'
  },
  {
    id: 'three-waves',
    era: 'Return & Restoration',
    title: 'The 3 Waves of Return',
    acronymOrPhrase: 'Temple • People • Walls',
    breakdown: [
      { label: 'Wave 1 (536 BC)', meaning: 'Zerubbabel returns to rebuild the TEMPLE (Ezra 1–6)' },
      { label: 'Wave 2 (458 BC)', meaning: 'Ezra returns to reform the PEOPLE & teach Torah (Ezra 7–10)' },
      { label: 'Wave 3 (445 BC)', meaning: 'Nehemiah returns to rebuild the WALLS of Jerusalem (Neh 1–6)' }
    ],
    scripture: 'Ezra & Nehemiah'
  },
  {
    id: 'nt-background',
    era: 'Silence & Fulfillment',
    title: '400 Years Providential Preparation',
    acronymOrPhrase: 'Greece • Rome • Israel',
    breakdown: [
      { label: 'Greece (Language)', meaning: 'Universal Greek language (Koine) for the New Testament scriptures' },
      { label: 'Rome (Roads & Peace)', meaning: 'Pax Romana and Roman road network enabling rapid global missionary travel' },
      { label: 'Israel (Messianic Hope)', meaning: 'Deep longing and synagogue networks ready for the Messiah' }
    ],
    scripture: 'Galatians 4:4'
  }
]

// 91 Milestones - Walk Thru the Old Testament
export const OT_WALK_THRU: WalkThruMilestone[] = [
  // 1. Beginnings (1–5)
  { step: 1, era: 'Beginnings', title: 'Creation', scriptureRef: 'Genesis 1-2', mnemonic: 'Perfection in 6 Days', icon: '🌍', description: 'God creates the cosmos in perfect order, beauty, and Sabbath rest.' },
  { step: 2, era: 'Beginnings', title: 'The Fall', scriptureRef: 'Genesis 3', mnemonic: 'Rebellion & Protoevangelium', icon: '🍎', description: 'Man rebels; first promise of the serpent-crusher in Gen 3:15.' },
  { step: 3, era: 'Beginnings', title: 'The Flood', scriptureRef: 'Genesis 6-9', mnemonic: 'Ark of Grace', icon: '🌊', description: 'Judgment on universal wickedness and the covenant of the rainbow.' },
  { step: 4, era: 'Beginnings', title: 'Tower of Babel', scriptureRef: 'Genesis 10-11', mnemonic: 'Pride Scattered', icon: '🗼', description: 'Human pride scattered across the earth into languages and nations.' },
  { step: 5, era: 'Beginnings', title: 'Table of Nations', scriptureRef: 'Genesis 10', mnemonic: '70 Families', icon: '🌐', description: 'The 70 families of humanity populating the known world.' },

  // 2. Patriarchs (6–25)
  { step: 6, era: 'Patriarchs', title: '4000 Years Ago', scriptureRef: 'Genesis 11', mnemonic: 'Patriarchal Dawn', icon: '⏳', description: 'The patriarchal horizon and dawn of redemptive covenant history.' },
  { step: 7, era: 'Patriarchs', title: 'Ur of the Chaldees', scriptureRef: 'Genesis 11:28', mnemonic: 'Called from Paganism', icon: '🏺', description: 'God calls Abraham out of Mesopotamian moon-god idolatry.' },
  { step: 8, era: 'Patriarchs', title: 'Persian Gulf', scriptureRef: 'Genesis 11', mnemonic: 'Cradle of Civilization', icon: '🌊', description: 'The geographic origin of ancient Near Eastern redemptive history.' },
  { step: 9, era: 'Patriarchs', title: 'SALT (Sarah, Abraham, Lot, Terah)', scriptureRef: 'Genesis 11-25', mnemonic: 'S • A • L • T', icon: '🧂', description: 'The core pilgrim family journeying westward by faith in God.' },
  { step: 10, era: 'Patriarchs', title: 'Sarah', scriptureRef: 'Genesis 16-23', mnemonic: 'Mother of Nations', icon: '👑', description: 'Mother of Isaac, the seed of promise.' },
  { step: 11, era: 'Patriarchs', title: 'Abraham’s Call', scriptureRef: 'Genesis 12:1-3', mnemonic: 'Land, Seed, Blessing', icon: '⛺', description: 'In you all the families of the earth shall be blessed.' },
  { step: 12, era: 'Patriarchs', title: 'Lot in Sodom', scriptureRef: 'Genesis 12-14, 19', mnemonic: 'Worldly Compromise', icon: '🔥', description: 'Compromise, rescue, and divine judgment of fire on Sodom.' },
  { step: 13, era: 'Patriarchs', title: 'Terah', scriptureRef: 'Genesis 11:31', mnemonic: 'Halted Halfway', icon: '👴', description: 'Father of Abraham stopping halfway at Haran.' },
  { step: 14, era: 'Patriarchs', title: 'Tigris & Euphrates', scriptureRef: 'Genesis 2:14', mnemonic: 'Fertile Crescent', icon: '🏞️', description: 'The great rivers of Mesopotamia bounding ancient history.' },
  { step: 15, era: 'Patriarchs', title: 'Haran (Terah Dies)', scriptureRef: 'Genesis 11:32', mnemonic: 'Stepping into Promise', icon: '🛑', description: 'Stepping forward into Canaan following Terah’s death.' },
  { step: 16, era: 'Patriarchs', title: 'Sea of Galilee', scriptureRef: 'Numbers 34:11', mnemonic: 'Freshwater Anchor', icon: '⛵', description: 'Northern freshwater anchor of the Promised Land.' },
  { step: 17, era: 'Patriarchs', title: 'Jordan River', scriptureRef: 'Genesis 13:10', mnemonic: 'Central River', icon: '💧', description: 'The central spine of biblical sacred geography.' },
  { step: 18, era: 'Patriarchs', title: 'Dead Sea', scriptureRef: 'Genesis 14:3', mnemonic: 'Salt Sea', icon: '🧂', description: 'Valley of Siddim, lowest point on earth and memorial of Sodom.' },
  { step: 19, era: 'Patriarchs', title: 'Mediterranean Sea', scriptureRef: 'Joshua 1:4', mnemonic: 'The Great Sea', icon: '🌊', description: 'Western maritime border of the Promised Land.' },
  { step: 20, era: 'Patriarchs', title: 'Land of Israel', scriptureRef: 'Genesis 12:7', mnemonic: 'Promised Land', icon: '🗺️', description: 'The stage of God’s redemptive drama and covenant inheritance.' },
  { step: 21, era: 'Patriarchs', title: 'Ishmael & Isaac', scriptureRef: 'Genesis 16, 21-22', mnemonic: 'Flesh vs. Promise', icon: '👦', description: 'Sacrifice on Mount Moriah: "The Lord will provide."' },
  { step: 22, era: 'Patriarchs', title: 'Esau & Jacob', scriptureRef: 'Genesis 25, 27-35', mnemonic: 'Birthright & Peniel', icon: '🤼', description: 'God transforms Jacob the deceiver into Israel, prince with God.' },
  { step: 23, era: 'Patriarchs', title: 'Judah (Messianic Line)', scriptureRef: 'Genesis 49:8-10', mnemonic: 'The Lion of Judah', icon: '🦁', description: 'The royal scepter shall not depart from Judah until Shiloh comes.' },
  { step: 24, era: 'Patriarchs', title: 'Joseph in Egypt', scriptureRef: 'Genesis 37, 39-50', mnemonic: 'Sovereign Providence', icon: '🧥', description: 'What man meant for evil, God meant for good to save many alive.' },
  { step: 25, era: 'Patriarchs', title: 'Jews in Goshen', scriptureRef: 'Genesis 47:27', mnemonic: 'Multiplication', icon: '🌾', description: 'Israel fruitful and multiplying greatly under Egyptian sanctuary.' },

  // 3. Exodus & Wilderness (26–47)
  { step: 26, era: 'Exodus & Wilderness', title: '400 Years of Bondage', scriptureRef: 'Exodus 1', mnemonic: 'Cruel Oppression', icon: '⛓️', description: 'A Pharaoh arose who knew not Joseph; Israel groans under slavery.' },
  { step: 27, era: 'Exodus & Wilderness', title: 'Moses at Burning Bush', scriptureRef: 'Exodus 2-3', mnemonic: 'I AM WHO I AM', icon: '🔥', description: 'God commissions Moses with His covenant name YHWH.' },
  { step: 28, era: 'Exodus & Wilderness', title: '“Let My People Go”', scriptureRef: 'Exodus 5-10', mnemonic: 'The Demand', icon: '🗣️', description: 'Confrontation with Pharaoh: "That they may worship Me."' },
  { step: 29, era: 'Exodus & Wilderness', title: 'Pharaoh’s Hardened Heart', scriptureRef: 'Exodus 5-11', mnemonic: 'Defiance', icon: '🪨', description: 'Imperial pride hardening against the Sovereign God of heaven.' },
  { step: 30, era: 'Exodus & Wilderness', title: '10 Plagues', scriptureRef: 'Exodus 7-12', mnemonic: 'Gods of Egypt Judged', icon: '⚡', description: 'Complete demonstration of Yahweh’s supremacy over all Egyptian deities.' },
  { step: 31, era: 'Exodus & Wilderness', title: 'The Passover Lamb', scriptureRef: 'Exodus 12', mnemonic: 'Redemption by Blood', icon: '🐑', description: 'Spotless lamb slain; blood on lintel protecting from death.' },
  { step: 32, era: 'Exodus & Wilderness', title: 'Red Sea Crossing', scriptureRef: 'Exodus 14', mnemonic: 'Waters Divide', icon: '🌊', description: 'Deliverance through parted waters; Egyptian chariots destroyed.' },
  { step: 33, era: 'Exodus & Wilderness', title: 'Mount Sinai', scriptureRef: 'Exodus 19-20', mnemonic: 'Covenant Cloud & Fire', icon: '⛰️', description: 'God’s glory descends; marriage covenant between God and Israel.' },
  { step: 34, era: 'Exodus & Wilderness', title: 'The Ten Commandments', scriptureRef: 'Exodus 20', mnemonic: 'The Moral Law', icon: '📜', description: 'Two stone tablets outlining love for God and love for neighbor.' },
  { step: 35, era: 'Exodus & Wilderness', title: 'Ark of the Covenant', scriptureRef: 'Exodus 25:10-22', mnemonic: 'Mercy Seat Presence', icon: '✨', description: 'Throne of God’s localized glory and atonement cover.' },
  { step: 36, era: 'Exodus & Wilderness', title: 'The Tabernacle', scriptureRef: 'Exodus 25-40', mnemonic: 'God Dwelling With Us', icon: '⛺', description: 'Sanctuary built according to the heavenly pattern in the camp.' },
  { step: 37, era: 'Exodus & Wilderness', title: 'Levites & Priesthood', scriptureRef: 'Exodus 28-30', mnemonic: 'Holy Mediation', icon: '🕊️', description: 'Aaron and the Levitical priesthood mediating holy sacrifices.' },
  { step: 38, era: 'Exodus & Wilderness', title: 'Offerings & Feasts', scriptureRef: 'Leviticus 1-27', mnemonic: 'Yom Kippur & Feasts', icon: '🔥', description: 'Seven annual feasts pointing to Christ’s redemptive timeline.' },
  { step: 39, era: 'Exodus & Wilderness', title: 'Counting the Tribes', scriptureRef: 'Numbers 1, 26', mnemonic: 'Holy Army Marshaled', icon: '🔢', description: 'Census of Israel’s military host marching under tribal banners.' },
  { step: 40, era: 'Exodus & Wilderness', title: 'Kadesh-Barnea Oasis', scriptureRef: 'Numbers 13', mnemonic: 'Threshold of Promise', icon: '🌴', description: 'Border headquarters where the crucial decision of faith was made.' },
  { step: 41, era: 'Exodus & Wilderness', title: '12 Spies Dispatched', scriptureRef: 'Numbers 13', mnemonic: 'Grapes of Eshcol', icon: '🕵️', description: 'Reconnaissance of Canaan: giants vs. milk and honey.' },
  { step: 42, era: 'Exodus & Wilderness', title: 'Joshua & Caleb (Faithful)', scriptureRef: 'Numbers 14:6-9', mnemonic: '“We Can Take It!”', icon: '🍇', description: 'Two men of faith trusting God’s promise against 10 unbelieving spies.' },
  { step: 43, era: 'Exodus & Wilderness', title: '40 Years Wilderness Wandering', scriptureRef: 'Numbers 14-33', mnemonic: 'Unbelief Judged', icon: '⌛', description: 'Old generation passes away; daily manna and guiding cloud.' },
  { step: 44, era: 'Exodus & Wilderness', title: 'Plains of Moab', scriptureRef: 'Deuteronomy 1', mnemonic: 'Across Jordan', icon: '🏕️', description: 'Final encampment opposite Jericho before entering Canaan.' },
  { step: 45, era: 'Exodus & Wilderness', title: 'Moses Preaches to 2nd Generation', scriptureRef: 'Deuteronomy 1-30', mnemonic: 'Hear O Israel!', icon: '📢', description: 'The Shema: Love the Lord with all your heart, soul, and might.' },
  { step: 46, era: 'Exodus & Wilderness', title: 'Deuteronomy (Second Law)', scriptureRef: 'Deuteronomy 28-30', mnemonic: 'Life or Death', icon: '📜', description: 'Choose life! Blessings for obedience and curses for disobedience.' },
  { step: 47, era: 'Exodus & Wilderness', title: 'Moses Dies on Mount Nebo', scriptureRef: 'Deuteronomy 34', mnemonic: 'Pisgah View', icon: '🌄', description: 'God buries Moses; Joshua ordained to lead Israel into Canaan.' },

  // 4. Conquest & Settlement (48–61)
  { step: 48, era: 'Conquest & Settlement', title: 'Joshua Takes Command', scriptureRef: 'Joshua 1', mnemonic: 'Strong & Courageous', icon: '⚔️', description: 'Meditate on the Book of the Law day and night.' },
  { step: 49, era: 'Conquest & Settlement', title: 'Jordan River Parts', scriptureRef: 'Joshua 3', mnemonic: 'Flooding Waters Stop', icon: '💧', description: 'Ark leads priests into flooding Jordan; 12 stones of memorial.' },
  { step: 50, era: 'Conquest & Settlement', title: 'Walls of Jericho Fall', scriptureRef: 'Joshua 6', mnemonic: '7 Days & Shouting', icon: '🎺', description: 'Supernatural victory through faith and obedience.' },
  { step: 51, era: 'Conquest & Settlement', title: 'Divide & Conquer', scriptureRef: 'Joshua 6-11', mnemonic: 'Central Campaign', icon: '🗺️', description: 'Splitting Canaan in half at Ai and Gibeon.' },
  { step: 52, era: 'Conquest & Settlement', title: '7 Years Southern & Northern Wars', scriptureRef: 'Joshua 10-11', mnemonic: 'Sun Stands Still', icon: '🛡️', description: 'Subduing 31 Canaanite kings across south and north.' },
  { step: 53, era: 'Conquest & Settlement', title: 'Divide & Settle the Land', scriptureRef: 'Joshua 12-24', mnemonic: 'Inheritance Claimed', icon: '🏡', description: 'Assigning tribal boundaries, cities of refuge, and Levitical towns.' },
  { step: 54, era: 'Conquest & Settlement', title: '12 Tribes Allotment Complete', scriptureRef: 'Joshua 13-21', mnemonic: 'All Promises Kept', icon: '📍', description: 'Not one word of all God’s good promises has failed.' },
  { step: 55, era: 'Conquest & Settlement', title: 'Era of the Judges (350 Years)', scriptureRef: 'Judges 1-21', mnemonic: 'The 5-Step Cycle', icon: '🔄', description: 'Sin → Oppression → Cry → Deliverer (Judge) → Peace.' },
  { step: 56, era: 'Conquest & Settlement', title: 'Deborah & Barak', scriptureRef: 'Judges 4-5', mnemonic: 'Chariots in Mud', icon: '⚡', description: 'Victory over Sisera’s iron chariots at the River Kishon.' },
  { step: 57, era: 'Conquest & Settlement', title: 'Gideon’s 300', scriptureRef: 'Judges 6-8', mnemonic: 'Torches & Pitchers', icon: '🏺', description: 'God reduces army from 32,000 to 300 to show the victory is His.' },
  { step: 58, era: 'Conquest & Settlement', title: 'Samson', scriptureRef: 'Judges 13-16', mnemonic: 'Strongman Nazarite', icon: '💪', description: 'Nazarite strength delivering Israel against Philistine oppressors.' },
  { step: 59, era: 'Conquest & Settlement', title: '“Every Man Did Right in His Own Eyes”', scriptureRef: 'Judges 21:25', mnemonic: 'Spiritual Anarchy', icon: '👁️', description: 'Darkest days of moral breakdown crying out for a righteous King.' },
  { step: 60, era: 'Conquest & Settlement', title: 'Ruth & Boaz', scriptureRef: 'Ruth 1-4', mnemonic: 'Kinsman Redeemer', icon: '🌾', description: 'Gentile faithfulness in Bethlehem preserving the royal ancestry of David.' },
  { step: 61, era: 'Conquest & Settlement', title: 'Samuel the Prophet', scriptureRef: '1 Samuel 1-7', mnemonic: '“Speak Lord, I Listen”', icon: '👂', description: 'Last judge, first prophet, and anointer of Israel’s kings.' },

  // 5. United Kingdom (62–69)
  { step: 62, era: 'United Kingdom', title: 'United Kingdom Established', scriptureRef: '1 Samuel 8-10', mnemonic: '120 Golden Years', icon: '👑', description: 'Israel requests a king; Saul, David, and Solomon reign 40 years each.' },
  { step: 63, era: 'United Kingdom', title: '120 Golden Years (3 Kings)', scriptureRef: '1 Samuel 8-1 Kings 11', mnemonic: 'Saul • David • Solomon', icon: '✨', description: 'Peak territorial expanse and royal glory of Israel.' },
  { step: 64, era: 'United Kingdom', title: 'King Saul (40 Years)', scriptureRef: '1 Samuel 9-31', mnemonic: 'No Heart for God', icon: '👑', description: 'Tall and impressive outwardly, but disobedient and rejected.' },
  { step: 65, era: 'United Kingdom', title: '“No Heart for God” (Saul Rejected)', scriptureRef: '1 Samuel 15', mnemonic: 'Obedience > Sacrifice', icon: '💔', description: 'Saul spares Amalek; the kingdom is torn away.' },
  { step: 66, era: 'United Kingdom', title: 'King David (40 Years)', scriptureRef: '2 Samuel 2-1 Kings 2', mnemonic: 'Whole Heart for God', icon: '🏰', description: 'Shepherd, warrior, psalmist, and builder of Jerusalem as capital.' },
  { step: 67, era: 'United Kingdom', title: '“Whole Heart for God” (Davidic Covenant)', scriptureRef: '2 Samuel 7', mnemonic: 'Eternal Throne', icon: '❤️', description: 'God promises David an everlasting throne realized in Jesus Christ.' },
  { step: 68, era: 'United Kingdom', title: 'King Solomon (40 Years)', scriptureRef: '1 Kings 1-11', mnemonic: 'Half Heart for God', icon: '🏛️', description: 'Supreme wisdom, Temple construction, yet compromised in old age.' },
  { step: 69, era: 'United Kingdom', title: '“Half Heart for God” (Idolatry)', scriptureRef: '1 Kings 11', mnemonic: 'Foreign Wives & Idols', icon: '💔', description: 'Solomon’s idolatry leads to the prophesied division of the kingdom.' },

  // 6. Divided Kingdom & Exile (70–79)
  { step: 70, era: 'Divided Kingdom & Exile', title: 'Kingdom Divides (930 B.C.)', scriptureRef: '1 Kings 12', mnemonic: 'Rehoboam & Jeroboam', icon: '⚡', description: 'Civil split: 10 northern tribes break away from House of David.' },
  { step: 71, era: 'Divided Kingdom & Exile', title: '350 Years of Division', scriptureRef: '1 Kings 12-2 Kings 25', mnemonic: 'North vs. South', icon: '⏳', description: 'Turbulent history of civil war, rival altars, and prophetic interventions.' },
  { step: 72, era: 'Divided Kingdom & Exile', title: 'Israel (Samaria) vs. Judah (Jerusalem)', scriptureRef: '1 Kings 12', mnemonic: 'Samaria vs. Zion', icon: '🧭', description: 'Northern Kingdom (Israel) vs. Southern Kingdom (Judah).' },
  { step: 73, era: 'Divided Kingdom & Exile', title: '19 Kings of Israel / 20 Kings of Judah', scriptureRef: '1-2 Kings', mnemonic: '0 vs. 8 Good Kings', icon: '👑', description: 'Israel: 0 good kings (all wicked). Judah: 8 good reforming kings.' },
  { step: 74, era: 'Divided Kingdom & Exile', title: 'Prophets: God’s Covenant Prosecutors', scriptureRef: 'Isaiah, Jeremiah, Hosea', mnemonic: 'Shape Up or Ship Out!', icon: '📢', description: 'Prophets calling kings and people back to the Law of Moses.' },
  { step: 75, era: 'Divided Kingdom & Exile', title: 'Elijah & Elisha', scriptureRef: '1 Kings 17-2 Kings 13', mnemonic: 'Carmel Fire & Chariots', icon: '🔥', description: 'Confrontation with Baal worship; double portion of the Spirit.' },
  { step: 76, era: 'Divided Kingdom & Exile', title: 'Good Kings: Hezekiah & Josiah', scriptureRef: '2 Kings 18-23', mnemonic: 'Passover & Law Found', icon: '🕯️', description: 'Revival, prayer against Sennacherib, and rediscovery of the Torah.' },
  { step: 77, era: 'Divided Kingdom & Exile', title: 'Assyria Scatters Northern Israel (722 B.C.)', scriptureRef: '2 Kings 17', mnemonic: 'Israel Scattered', icon: '⛓️', description: 'Samaria falls to Sargon II; 10 northern tribes scattered into exile.' },
  { step: 78, era: 'Divided Kingdom & Exile', title: 'Babylon Invades Judah (605, 597, 586 B.C.)', scriptureRef: '2 Kings 24-25', mnemonic: 'Nebuchadnezzar Sieges', icon: '🏹', description: 'Three deportation waves taking Daniel, Ezekiel, and people to Babylon.' },
  { step: 79, era: 'Divided Kingdom & Exile', title: 'Temple Burned & Judah Exiled (586 B.C.)', scriptureRef: '2 Kings 25', mnemonic: 'Jerusalem Falls', icon: '🔥', description: 'Solomon’s Temple burned; walls leveled; 70-year captivity begins.' },

  // 7. Return & Restoration (80–89)
  { step: 80, era: 'Return & Restoration', title: '70 Years Babylonian Captivity', scriptureRef: 'Jeremiah 29:10', mnemonic: 'Daniel & Fiery Furnace', icon: '⏳', description: 'Purification of Israel from idolatry during 70 years in Babylon.' },
  { step: 81, era: 'Return & Restoration', title: 'Cyrus Decrees Return (538 B.C.)', scriptureRef: 'Ezra 1, 2 Chron 36', mnemonic: 'Persian Decree', icon: '📜', description: 'King Cyrus of Persia decrees Jews can return and rebuild Jerusalem.' },
  { step: 82, era: 'Return & Restoration', title: 'Wave 1: Zerubbabel Rebuilds Temple (536 B.C.)', scriptureRef: 'Ezra 3-6', mnemonic: 'Wave 1: TEMPLE', icon: '🏛️', description: '50,000 return; Second Temple dedicated under Haggai & Zechariah.' },
  { step: 83, era: 'Return & Restoration', title: 'Queen Esther in Susa', scriptureRef: 'Esther 1-10', mnemonic: '“For Such a Time as This”', icon: '👸', description: 'Esther and Mordecai preserve Jewish race from Haman’s genocide plot.' },
  { step: 84, era: 'Return & Restoration', title: 'Wave 2: Ezra Rebuilds the People (458 B.C.)', scriptureRef: 'Ezra 7-10', mnemonic: 'Wave 2: PEOPLE', icon: '📖', description: 'Ezra the scribe teaches the Torah, establishing synagogue life.' },
  { step: 85, era: 'Return & Restoration', title: 'Wave 3: Nehemiah Rebuilds the Wall (445 B.C.)', scriptureRef: 'Nehemiah 1-6', mnemonic: 'Wave 3: WALLS (52 Days)', icon: '🧱', description: 'Jerusalem’s defensive walls rebuilt in 52 days amidst fierce opposition.' },
  { step: 86, era: 'Return & Restoration', title: 'Covenant Renewal with Great Joy', scriptureRef: 'Nehemiah 8-9', mnemonic: 'Joy is Your Strength', icon: '🎉', description: 'Ezra reads the Law from dawn till noon; Feast of Tabernacles celebrated.' },
  { step: 87, era: 'Return & Restoration', title: 'Malachi’s Final Prophecy', scriptureRef: 'Malachi 3-4', mnemonic: 'Sun of Righteousness', icon: '☀️', description: 'Rebuke of halfhearted worship; promise of the Messiah with healing in His wings.' },
  { step: 88, era: 'Return & Restoration', title: 'Elijah the Prophet to Come', scriptureRef: 'Malachi 4:5-6', mnemonic: 'John the Baptist Foretold', icon: '🕊️', description: 'Turning the hearts of fathers to children before the great day of the Lord.' },
  { step: 89, era: 'Return & Restoration', title: 'Old Testament Canon Sealed', scriptureRef: 'Malachi 4', mnemonic: 'Prophetic Canon Closes', icon: '📕', description: 'The 39 books of the Hebrew Scriptures sealed awaiting the Messiah.' },

  // 8. Silence & Fulfillment (90–91)
  { step: 90, era: 'Silence & Fulfillment', title: '400 Years of Prophetic Silence', scriptureRef: 'Intertestamental Era', mnemonic: 'Greek • Rome • Israel', icon: '🤫', description: 'No prophets speak; world prepared through Greek language and Roman roads.' },
  { step: 91, era: 'Silence & Fulfillment', title: 'Fulfillment in Jesus Christ', scriptureRef: 'Galatians 4:4, Matt 1', mnemonic: '“Fullness of Time”', icon: '✝️', description: '“When the fullness of time had come, God sent forth His Son!”' },
]

// Life of Jesus Chronological Stages (Luke Journey)
export const LIFE_OF_JESUS_STAGES = [
  { stage: 1, location: 'Judah / Nazareth', title: 'Annunciation to Zechariah & Mary', scripture: 'Luke 1', icon: '🕊️', description: 'Gabriel announces the miraculous conceptions of John the Baptist and Jesus.' },
  { stage: 2, location: 'Bethlehem', title: 'Birth of Jesus in the Manger', scripture: 'Luke 2:1-20', icon: '🌟', description: 'Angelic choir appears to shepherds; Glory to God in the highest.' },
  { stage: 3, location: 'Nazareth', title: 'Youth & Carpenter in Nazareth', scripture: 'Luke 2:51-52', icon: '🔨', description: 'Jesus increases in wisdom, stature, and favor with God and man.' },
  { stage: 4, location: 'Jordan River', title: 'Baptism by John the Baptist', scripture: 'Luke 3:21-22', icon: '💧', description: 'Heaven opened; Holy Spirit descends as a dove; Father declares His beloved Son.' },
  { stage: 5, location: 'Judean Wilderness', title: 'Temptation in the Wilderness', scripture: 'Luke 4:1-13', icon: '🏜️', description: 'Jesus overcomes Satan’s 3 temptations by quoting Deuteronomy.' },
  { stage: 6, location: 'Jerusalem', title: 'New Birth Teaching with Nicodemus', scripture: 'John 3:1-21', icon: '🕯️', description: 'You must be born again; For God so loved the world.' },
  { stage: 7, location: 'Sychar (Samaria)', title: 'Living Water at the Well', scripture: 'John 4:1-42', icon: '🏺', description: 'Jesus reveals Himself as Messiah to Samaritan woman; true spiritual worship.' },
  { stage: 8, location: 'Capernaum / Galilee', title: 'Selection of 12 & Sermon on Plain', scripture: 'Luke 5-6', icon: '⛰️', description: 'Calling the twelve apostles and teaching kingdom beatitudes.' },
  { stage: 9, location: 'Sea of Galilee', title: 'Calming the Storm & Feeding 5,000', scripture: 'Luke 8-9', icon: '⛵', description: 'Power over nature, disease, demons, and physical hunger.' },
  { stage: 10, location: 'Mount of Transfiguration', title: 'Peter’s Confession & Transfiguration', scripture: 'Luke 9:28-36', icon: '✨', description: 'Moses and Elijah speak with radiant Christ regarding His departure in Jerusalem.' },
  { stage: 11, location: 'Perea / Judea', title: 'Parables of Grace (Lost Sheep & Prodigal)', scripture: 'Luke 14-15', icon: '🐑', description: 'Rejoicing in heaven over one sinner who repents.' },
  { stage: 12, location: 'Bethany', title: 'Lazarus Raised from the Dead', scripture: 'John 11:1-44', icon: '⚡', description: '“I am the resurrection and the life”; final public sign prompting trial.' },
  { stage: 13, location: 'Jerusalem', title: 'Triumphal Entry & Temple Cleansing', scripture: 'Luke 19:28-48', icon: '🌿', description: 'Riding on a colt as promised in Zechariah 9:9; weeping over the city.' },
  { stage: 14, location: 'Jerusalem (Calvary & Tomb)', title: 'Last Supper, Crucifixion & Resurrection', scripture: 'Luke 22-24', icon: '✝️', description: '“It is finished!” The curtain is torn; risen from the dead on the third day!' },
]

// Acts & Missionary Journeys Stages
export const ACTS_MISSIONARY_STAGES = [
  { stage: 1, title: 'Ascension & Pentecost Outpouring', scripture: 'Acts 1-2', icon: '🔥', location: 'Jerusalem', description: '3,000 saved as the Holy Spirit falls in power.' },
  { stage: 2, title: 'Early Church & Deacons Chosen', scripture: 'Acts 3-6', icon: '🏛️', location: 'Jerusalem', description: 'Signs, wonders, generosity, and Stephen/Philip appointed.' },
  { stage: 3, title: 'Stephen’s Martyrdom & Gospel Spread', scripture: 'Acts 7-8', icon: '💎', location: 'Samaria', description: 'Persecution scatters the church, spreading seeds of the Gospel.' },
  { stage: 4, title: 'Saul’s Damascus Road Conversion', scripture: 'Acts 9', icon: '☀️', location: 'Damascus', description: 'The chief persecutor becomes the apostle to the Gentiles.' },
  { stage: 5, title: 'Peter’s Vision & Gentile Ingathering', scripture: 'Acts 10-11', icon: '🕊️', location: 'Caesarea', description: 'Cornelius’ household receives the Holy Spirit; Gentiles welcomed.' },
  { stage: 6, title: 'Paul’s 1st Missionary Journey (c. A.D. 46–49)', scripture: 'Acts 13-14', icon: '⛵', location: 'Cyprus & Galatia', description: 'Planting churches in Antioch Pisidia, Iconium, Lystra, and Derbe.' },
  { stage: 7, title: 'The Jerusalem Council (Grace Without Law)', scripture: 'Acts 15', icon: '📜', location: 'Jerusalem', description: 'Saved by the grace of the Lord Jesus alone, not circumcision.' },
  { stage: 8, title: 'Paul’s 2nd Missionary Journey (c. A.D. 49–52)', scripture: 'Acts 16-18', icon: '⚓', location: 'Philippi, Athens, Corinth', description: 'Macedonian call; Gospel enters Europe; preaching at the Areopagus.' },
  { stage: 9, title: 'Paul’s 3rd Missionary Journey (c. A.D. 52–57)', scripture: 'Acts 18-21', icon: '🛡️', location: 'Ephesus & Asia', description: '3 years in Ephesus; word of the Lord grows mightily.' },
  { stage: 10, title: 'Arrest in Jerusalem & Trials', scripture: 'Acts 21-26', icon: '⛓️', location: 'Jerusalem & Caesarea', description: 'Defense before Sanhedrin, Felix, Festus, and King Agrippa.' },
  { stage: 11, title: 'Voyage to Rome & Shipwreck on Malta', scripture: 'Acts 27-28', icon: '🌊', location: 'Malta', description: 'God spares all 276 souls through ferocious Mediterranean storm.' },
  { stage: 12, title: '1st Roman Imprisonment (Prison Epistles)', scripture: 'Acts 28:30-31', icon: '✍️', location: 'Rome', description: 'Writing Ephesians, Philippians, Colossians, Philemon under guard.' },
  { stage: 13, title: 'Pastoral Ministry & Expansion', scripture: '1 Timothy, Titus', icon: '🌿', location: 'Crete & Ephesus', description: 'Training Timothy and Titus in sound doctrine and church order.' },
  { stage: 14, title: '2nd Roman Imprisonment & Martyrdom', scripture: '2 Timothy 4:6-8', icon: '🏆', location: 'Rome', description: 'I have finished my course; crown of righteousness laid up.' },
  { stage: 15, title: 'Gospel Unhindered to the Ends of the Earth', scripture: 'Acts 28:31, Rev 21', icon: '👑', location: 'Global', description: 'Proclaiming the kingdom of God with all boldness and without hindrance.' },
]

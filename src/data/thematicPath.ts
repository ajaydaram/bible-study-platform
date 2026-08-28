export interface ThematicTopic {
  id: string
  title: string
  category: 'god-creation' | 'covenant-fall' | 'christ-redemption' | 'church-walk'
  description: string
  passages: string[]
  order: number
  theologicalTrajectory: {
    otShadow: string
    christFulfillment: string
    consummation: string
  }
  reflectionQuestions: string[]
}

export const THEMATIC_CATEGORIES = [
  { id: 'all', label: 'All Themes', count: 24 },
  { id: 'god-creation', label: '👑 God & Creation', count: 4 },
  { id: 'covenant-fall', label: '📜 Covenant & Fall', count: 5 },
  { id: 'christ-redemption', label: '✝️ Christ & Redemption', count: 8 },
  { id: 'church-walk', label: '🕊️ Church & Discipleship', count: 7 }
] as const

export const thematicTopics: ThematicTopic[] = [
  {
    id: "creation",
    title: "Creation & Purpose",
    category: "god-creation",
    description: "God creates all things with purpose and declares them good. Humanity is made in God's image to steward creation and enjoy relationship with Him.",
    passages: ["Genesis 1:1-31", "Genesis 2:7-25", "Psalm 8", "Colossians 1:15-20"],
    order: 1,
    theologicalTrajectory: {
      otShadow: "Creation formed ex nihilo; man placed in Eden sanctuary to serve as priest-king.",
      christFulfillment: "Christ is the Image of the Invisible God, the Firstborn over all creation by whom and for whom all things were created (Col 1:15-16).",
      consummation: "The cosmos is renewed in the New Heavens and New Earth where God tabernacles with redeemed humanity (Rev 21:1-4)."
    },
    reflectionQuestions: [
      "How does being made in God's image define your intrinsic dignity, calling, and daily purpose?",
      "In what ways does Colossians 1:15-20 anchor creation's ultimate meaning in the supremacy of Jesus Christ?"
    ]
  },
  {
    id: "holiness",
    title: "Holiness of God",
    category: "god-creation",
    description: "God is set apart, pure, and perfect. He calls His people to be holy as He is holy, reflecting His character.",
    passages: ["Leviticus 19:1-4", "Isaiah 6:1-8", "1 Peter 1:13-16", "Hebrews 12:14"],
    order: 2,
    theologicalTrajectory: {
      otShadow: "The fiery presence on Sinai and the Holy of Holies guarded by veils from sinful man.",
      christFulfillment: "Jesus is the Holy One of God who touches the leper and outcast without becoming unclean, imparting His holiness.",
      consummation: "The New Jerusalem where nothing profane may ever enter, and the saints reflect untarnished holiness (Rev 21:27)."
    },
    reflectionQuestions: [
      "How does Isaiah's vision of God's holiness (Isa 6) transform your understanding of worship and repentance?",
      "How does Christ's imputed righteousness enable us to pursue practical holiness without fear of condemnation?"
    ]
  },
  {
    id: "love",
    title: "God's Steadfast Love (Hesed)",
    category: "god-creation",
    description: "God is love, and His love is demonstrated supremely in sending His Son. We are called to love God and neighbor.",
    passages: ["Deuteronomy 6:4-5", "John 3:16", "Romans 8:35-39", "1 John 4:7-21"],
    order: 3,
    theologicalTrajectory: {
      otShadow: "Yahweh's steadfast covenant loyalty (Hesed) enduring through Israel's repeated backsliding.",
      christFulfillment: "The Father sends His only begotten Son as the propitiation for our sins upon the Cross (1 John 4:10).",
      consummation: "The eternal love communion of the Bride of Christ joined to the Lamb forever (Rev 19:7-9)."
    },
    reflectionQuestions: [
      "How does Roman 8:35-39 give you unshakable security in the midst of trials and suffering?",
      "How should experiencing God's unconditional covenant love overflow into forgiving difficult people in your life?"
    ]
  },
  {
    id: "prayer",
    title: "Prayer & Intercession",
    category: "god-creation",
    description: "Communication with God is essential to spiritual life. Jesus teaches us to pray and promises the Father hears us.",
    passages: ["Matthew 6:5-15", "Luke 18:1-8", "Philippians 4:6-7", "1 John 5:14-15"],
    order: 4,
    theologicalTrajectory: {
      otShadow: "High priest offering fragrant incense before the Ark of the Covenant.",
      christFulfillment: "Jesus lives forever to make intercession for us at the right hand of the Father (Heb 7:25).",
      consummation: "The prayers of the saints rise as golden bowls of incense before the heavenly throne (Rev 5:8)."
    },
    reflectionQuestions: [
      "How does the Lord's Prayer (Matt 6) shape your prayer priorities from earthly anxieties to Kingdom advancement?",
      "What confidence does Hebrews 4:16 give you to approach the throne of grace boldly?"
    ]
  },
  {
    id: "fall",
    title: "The Fall & Sin",
    category: "covenant-fall",
    description: "Through disobedience, sin enters the world, bringing death and separation from God. Yet even in judgment, God promises redemption.",
    passages: ["Genesis 3:1-24", "Romans 3:23", "Romans 5:12-21", "Romans 6:23"],
    order: 5,
    theologicalTrajectory: {
      otShadow: "Adam’s covenant violation brings death, expulsion from Eden, and the Protoevangelium promise (Gen 3:15).",
      christFulfillment: "Christ, the Second Adam, obeys where the first Adam failed, conquering sin and death through His cross (Rom 5:18-19).",
      consummation: "The tree of life restored; no more curse or sorrow forever (Rev 22:2-3)."
    },
    reflectionQuestions: [
      "How does understanding the total extent of the Fall magnify the greatness of God's saving grace?",
      "How does Genesis 3:15 serve as the golden foundation for all Messianic prophecies throughout the Old Testament?"
    ]
  },
  {
    id: "covenant",
    title: "Covenant Promises",
    category: "covenant-fall",
    description: "God enters into binding agreements with His people, promising blessing, land, and an eternal kingdom through faithful love.",
    passages: ["Genesis 12:1-3", "Genesis 15:1-18", "2 Samuel 7:8-16", "Jeremiah 31:31-34"],
    order: 6,
    theologicalTrajectory: {
      otShadow: "God passes through the severed animals in Genesis 15, taking the covenant curse upon Himself.",
      christFulfillment: "Jesus ratifies the New Covenant in His blood, securing an eternal inheritance for all believers (Luke 22:20; Heb 9:15).",
      consummation: "The complete realization of the covenant formula: 'They shall be My people, and I will be their God' (Rev 21:3)."
    },
    reflectionQuestions: [
      "Why is God's unilateral oath to Abraham (Gen 15) the bedrock of our assurance of salvation?",
      "How does the New Covenant in Jeremiah 31 write God's Law upon our hearts rather than stone tablets?"
    ]
  },
  {
    id: "law",
    title: "Law & Righteousness",
    category: "covenant-fall",
    description: "God's law reveals His character and standards for righteous living. It exposes sin and points to our need for grace.",
    passages: ["Exodus 20:1-17", "Psalm 19:7-11", "Matthew 5:17-20", "Romans 7:7-12"],
    order: 7,
    theologicalTrajectory: {
      otShadow: "The Ten Commandments given at Sinai as a tutor to restrain sin and expose human inability.",
      christFulfillment: "Christ fulfills the Law through perfect active obedience and bears its curse through passive obedience (Gal 3:13).",
      consummation: "The redeemed delight completely in God’s holy will in the eternal kingdom without any remnant of sin."
    },
    reflectionQuestions: [
      "How does the moral law act as a mirror to show our need for a Savior?",
      "How does the third use of the law guide Christian gratitude and holiness today?"
    ]
  },
  {
    id: "sacrifice",
    title: "Sacrifice & Atonement",
    category: "covenant-fall",
    description: "Blood sacrifices cover sin and restore relationship with God. Christ's sacrifice fulfills and ends the sacrificial system.",
    passages: ["Leviticus 16:1-34", "Isaiah 53:4-6", "Hebrews 9:11-14", "Hebrews 10:1-18"],
    order: 8,
    theologicalTrajectory: {
      otShadow: "Day of Atonement (Yom Kippur) bull and scapegoat offering temporary ceremonial cleansing.",
      christFulfillment: "Jesus offers Himself once for all as both the spotless Lamb and the Great High Priest (Heb 10:12-14).",
      consummation: "The Lamb that was slain receives everlasting worship from every tribe, tongue, and nation (Rev 5:12)."
    },
    reflectionQuestions: [
      "Why could the blood of bulls and goats never take away sins permanently (Heb 10:4)?",
      "How does Christ's 'once-for-all' sacrifice free you from guilty striving and performance-based legalism?"
    ]
  },
  {
    id: "justice",
    title: "Justice & Mercy",
    category: "covenant-fall",
    description: "God is just, upholding righteousness. He also shows mercy, forgiving the repentant and caring for the oppressed.",
    passages: ["Micah 6:8", "Isaiah 1:17", "Amos 5:21-24", "Matthew 23:23"],
    order: 9,
    theologicalTrajectory: {
      otShadow: "Prophets condemning ritual without heart justice and demanding mercy for the fatherless and widow.",
      christFulfillment: "At the cross, God's perfect justice and boundless mercy kiss: God is both just and the justifier of those who have faith (Rom 3:26).",
      consummation: "The final judgment where every wrong is righted and justice flows like a mighty river."
    },
    reflectionQuestions: [
      "How does the cross resolve the tension between God's absolute justice and His tender mercy?",
      "How does Micah 6:8 call your local church to embody active mercy in your city?"
    ]
  },
  {
    id: "messiah",
    title: "The Promised Messiah",
    category: "christ-redemption",
    description: "Throughout Scripture, God promises a coming King who will save His people. Jesus fulfills all messianic prophecies.",
    passages: ["Isaiah 9:6-7", "Isaiah 11:1-10", "Micah 5:2", "Luke 24:25-27"],
    order: 10,
    theologicalTrajectory: {
      otShadow: "Prophetic oracle: Seed of woman, Star from Jacob, Prophet like Moses, Davidic King.",
      christFulfillment: "Jesus fulfills over 300 OT prophecies concerning His birth, lineage, ministry, suffering, and resurrection.",
      consummation: "The Messiah rules the nations with a rod of iron in everlasting peace and righteousness."
    },
    reflectionQuestions: [
      "How does seeing Jesus throughout the Old Testament deepen your confidence in the inspiration of Scripture?",
      "What comfort does the title 'Prince of Peace' (Isa 9:6) bring to your heart today?"
    ]
  },
  {
    id: "incarnation",
    title: "The Incarnation",
    category: "christ-redemption",
    description: "The eternal Word becomes flesh, dwelling among us. God enters human experience to reveal Himself and save humanity.",
    passages: ["John 1:1-18", "Philippians 2:5-11", "Hebrews 1:1-4", "Hebrews 2:14-18"],
    order: 11,
    theologicalTrajectory: {
      otShadow: "The Shekinah glory tabernacling among Israel in the wilderness.",
      christFulfillment: "The Word became flesh and tabernacled among us, full of grace and truth (John 1:14).",
      consummation: "God's dwelling place is forever with man; we will see His face (Rev 21:3, 22:4)."
    },
    reflectionQuestions: [
      "Why was it necessary for the Son of God to take on genuine human flesh to save us (Heb 2:17)?",
      "How does Philippians 2:5-11 inspire humility and servant-hearted love in your daily relationships?"
    ]
  },
  {
    id: "cross",
    title: "The Cross & Substitution",
    category: "christ-redemption",
    description: "Jesus dies on the cross, bearing the sins of humanity. His death defeats sin, death, and Satan, reconciling us to God.",
    passages: ["Mark 15:21-39", "Romans 5:6-11", "1 Corinthians 1:18-25", "Colossians 2:13-15"],
    order: 12,
    theologicalTrajectory: {
      otShadow: "Passover Lamb slain, its blood painted on the doorposts to avert the angel of death.",
      christFulfillment: "Christ our Passover Lamb was sacrificed for us, disarming rulers and authorities and canceling the record of debt (Col 2:14-15).",
      consummation: "The heavenly anthem celebrates: 'Worthy is the Lamb who was slain to receive power and riches!' (Rev 5:12)."
    },
    reflectionQuestions: [
      "Why is the message of the Cross 'foolishness to those who are perishing, but to us who are being saved the power of God'?",
      "What does it mean practically that Christ canceled the legal record of debt against you?"
    ]
  },
  {
    id: "resurrection",
    title: "The Resurrection of Christ",
    category: "christ-redemption",
    description: "Jesus rises from the dead, vindicating His claims and securing eternal life for all who believe in Him.",
    passages: ["Matthew 28:1-10", "Romans 6:4-11", "1 Corinthians 15:1-28", "1 Peter 1:3-5"],
    order: 13,
    theologicalTrajectory: {
      otShadow: "Jonah three days in the belly of the fish; the Feast of Firstfruits sheaf waved before the LORD.",
      christFulfillment: "Christ is risen as the Firstfruits of those who have fallen asleep, conquering death forever (1 Cor 15:20).",
      consummation: "The bodily resurrection of all saints at the last trumpet to inherit immortal glory (1 Cor 15:52-54)."
    },
    reflectionQuestions: [
      "How does the historical fact of the bodily resurrection give meaning to every labor done for the Lord (1 Cor 15:58)?",
      "How does being united with Christ in His resurrection empower you to walk in newness of life today?"
    ]
  },
  {
    id: "redemption",
    title: "Redemption & Justification",
    category: "christ-redemption",
    description: "God acts to rescue His people from bondage and sin, culminating in the ultimate redemption through Jesus Christ.",
    passages: ["Exodus 6:6-7", "Isaiah 53:1-12", "John 3:16-17", "Ephesians 1:7-10"],
    order: 14,
    theologicalTrajectory: {
      otShadow: "Israel redeemed out of Egyptian chattel slavery with an outstretched arm and mighty acts of judgment.",
      christFulfillment: "We have redemption through His blood, the forgiveness of our trespasses according to the riches of His grace (Eph 1:7).",
      consummation: "The song of Moses and the Lamb sung on the crystal sea by the fully redeemed host (Rev 15:3)."
    },
    reflectionQuestions: [
      "How does the price of redemption (Christ's precious blood) show how much the Father values His people?",
      "What differences exist between worldly rescue and eternal redemption?"
    ]
  },
  {
    id: "grace",
    title: "Sovereign Grace",
    category: "christ-redemption",
    description: "God's unmerited favor toward sinners. We are saved by grace through faith, not by works, so that no one may boast.",
    passages: ["Ephesians 2:1-10", "Romans 11:1-6", "Titus 2:11-14", "2 Corinthians 12:8-10"],
    order: 15,
    theologicalTrajectory: {
      otShadow: "God choosing Israel not because they were numerous, but because He set His love upon them (Deut 7:7).",
      christFulfillment: "By grace you have been saved through faith, and this is not your own doing; it is the gift of God (Eph 2:8-9).",
      consummation: "Ages to come displaying the immeasurable riches of His grace in kindness toward us in Christ (Eph 2:7)."
    },
    reflectionQuestions: [
      "Why is boasting completely excluded in salvation by grace alone?",
      "How does God's grace empower good works rather than encourage lazy license (Eph 2:10; Titus 2:11-12)?"
    ]
  },
  {
    id: "faith",
    title: "Faith & Justification",
    category: "christ-redemption",
    description: "Trusting God is the foundation of relationship with Him. Faith is counted as righteousness and is the means of salvation.",
    passages: ["Genesis 15:6", "Habakkuk 2:4", "Romans 4:1-8", "Hebrews 11:1-6"],
    order: 16,
    theologicalTrajectory: {
      otShadow: "Abraham believed Yahweh, and He counted it to him as righteousness (Gen 15:6).",
      christFulfillment: "We are justified by faith apart from the works of the Law through the redemption in Christ Jesus (Rom 3:28).",
      consummation: "Faith turns to sight when we behold the King in His beauty."
    },
    reflectionQuestions: [
      "What is the difference between genuine saving faith and mere intellectual assent?",
      "How does looking to Christ rather than our own feelings maintain peace with God (Rom 5:1)?"
    ]
  },
  {
    id: "kingdom",
    title: "The Kingdom of God",
    category: "christ-redemption",
    description: "God reigns as King over all creation. His kingdom comes in Jesus and will be fully established at His return.",
    passages: ["Psalm 145:10-13", "Daniel 2:44", "Matthew 6:9-10", "Revelation 11:15"],
    order: 17,
    theologicalTrajectory: {
      otShadow: "The Davidic and Solomonic kingdom pointing forward to an eternal righteous dynasty.",
      christFulfillment: "The Kingdom is 'already' inaugurated in Jesus' miracles, preaching, and resurrection (Luke 17:21).",
      consummation: "'The kingdom of the world has become the kingdom of our Lord and of His Christ, and He shall reign forever' (Rev 11:15)."
    },
    reflectionQuestions: [
      "How do we live as citizens of the Kingdom 'already' while waiting for its 'not yet' consummation?",
      "What does praying 'Your kingdom come, Your will be done' mean for your workplace and family?"
    ]
  },
  {
    id: "holy-spirit",
    title: "The Holy Spirit & Regeneration",
    category: "church-walk",
    description: "The Spirit of God empowers, guides, and transforms believers. He is the guarantee of our inheritance and the source of spiritual gifts.",
    passages: ["Joel 2:28-29", "John 14:15-17", "Acts 2:1-4", "Galatians 5:16-25"],
    order: 18,
    theologicalTrajectory: {
      otShadow: "Spirit coming temporarily upon prophets, priests, and kings for specialized tasks.",
      christFulfillment: "Pentecost: The risen Christ pours out the Holy Spirit permanently upon all flesh to indwell every believer.",
      consummation: "The river of the water of life flowing clear as crystal from the throne of God (Rev 22:1)."
    },
    reflectionQuestions: [
      "How does walking by the Spirit crucify the desires of the flesh (Gal 5:16)?",
      "In what areas of your life do you need the Spirit's comfort, conviction, or power today?"
    ]
  },
  {
    id: "church",
    title: "The Body of Christ (The Church)",
    category: "church-walk",
    description: "God's people gathered as the body of Christ, united in worship, mission, and love. The church displays God's wisdom to the world.",
    passages: ["Matthew 16:18", "Acts 2:42-47", "1 Corinthians 12:12-27", "Ephesians 3:10-11"],
    order: 19,
    theologicalTrajectory: {
      otShadow: "The congregation (qahal) of Israel gathered around the Tabernacle.",
      christFulfillment: "Christ builds His Church on the rock of Peter's confession, and the gates of hell shall not prevail against it (Matt 16:18).",
      consummation: "The universal Church presented as a radiant bride without spot or wrinkle (Eph 5:27; Rev 19:7)."
    },
    reflectionQuestions: [
      "Why is active participation in a local church essential for every Christian's growth?",
      "How do your spiritual gifts contribute to the building up of the body of Christ?"
    ]
  },
  {
    id: "discipleship",
    title: "Discipleship & Great Commission",
    category: "church-walk",
    description: "Following Jesus means denying self, taking up the cross, and making disciples of all nations.",
    passages: ["Matthew 16:24-26", "Matthew 28:18-20", "John 15:1-8", "Luke 14:25-33"],
    order: 20,
    theologicalTrajectory: {
      otShadow: "Elijah discipling Elisha; Moses training Joshua to lead the people.",
      christFulfillment: "Jesus calls disciples to follow Him, commands all authority, and sends them to disciple the nations.",
      consummation: "A great multitude that no one can count from every nation standing before the throne."
    },
    reflectionQuestions: [
      "What does 'denying yourself and taking up your cross daily' look like in modern life?",
      "Who are you currently mentoring or discipling in the Christian faith?"
    ]
  },
  {
    id: "suffering",
    title: "Suffering, Trials & Character",
    category: "church-walk",
    description: "Suffering is part of the Christian life but produces perseverance, character, and hope. God is present in our pain.",
    passages: ["Romans 5:3-5", "2 Corinthians 1:3-7", "James 1:2-4", "1 Peter 4:12-19"],
    order: 21,
    theologicalTrajectory: {
      otShadow: "Joseph in the pit and prison ('God meant it for good'); Job’s unwavering trust in his Redeemer.",
      christFulfillment: "Christ suffered for us leaving an example; our suffering is communion with His afflictions (1 Pet 2:21).",
      consummation: "God wipes away every tear from their eyes; death and mourning are no more (Rev 21:4)."
    },
    reflectionQuestions: [
      "How does Romans 5:3-5 reframe your perspective during unexpected trials?",
      "How has God comforted you in past afflictions so you can comfort others today (2 Cor 1:4)?"
    ]
  },
  {
    id: "hope",
    title: "Living Hope & Perseverance",
    category: "church-walk",
    description: "Christian hope is confident expectation based on God's promises. It anchors the soul and does not disappoint.",
    passages: ["Romans 5:1-5", "Romans 8:24-25", "Hebrews 6:18-20", "1 Peter 1:3-9"],
    order: 22,
    theologicalTrajectory: {
      otShadow: "Israel waiting in hope for the consolation of Zion through centuries of exile.",
      christFulfillment: "Born again to a living hope through the resurrection of Jesus Christ from the dead (1 Pet 1:3).",
      consummation: "The anchor of our hope enters into the inner shrine behind the veil where Jesus has gone as our forerunner."
    },
    reflectionQuestions: [
      "How does biblical hope differ from mere worldly optimism or wishful thinking?",
      "How does an eternal inheritance undefiled and unfading keep you steadfast when earthly things fail?"
    ]
  },
  {
    id: "second-coming",
    title: "Christ's Glorious Return",
    category: "church-walk",
    description: "Jesus will return in glory to judge the living and the dead, establish His kingdom, and make all things new.",
    passages: ["Matthew 24:29-31", "1 Thessalonians 4:13-18", "2 Peter 3:10-13", "Revelation 19:11-16"],
    order: 23,
    theologicalTrajectory: {
      otShadow: "The Great and Terrible Day of the LORD prophesied across the Major and Minor Prophets.",
      christFulfillment: "The King of Kings returns on a white horse, striking the nations with the sword of His mouth.",
      consummation: "Every knee bows and every tongue confesses that Jesus Christ is Lord to the glory of God the Father."
    },
    reflectionQuestions: [
      "How does the promise of Christ's sudden return motivate holy living and evangelistic urgency (2 Pet 3:11)?",
      "Why does 1 Thessalonians 4 conclude with 'Encourage one another with these words'?"
    ]
  },
  {
    id: "new-creation",
    title: "The New Creation & Consummation",
    category: "church-walk",
    description: "God will create new heavens and a new earth where righteousness dwells. No more death, mourning, or pain.",
    passages: ["Isaiah 65:17-25", "2 Corinthians 5:17", "2 Peter 3:13", "Revelation 21:1-5"],
    order: 24,
    theologicalTrajectory: {
      otShadow: "Isaiah's vision of the wolf dwelling with the lamb on God's holy mountain.",
      christFulfillment: "If anyone is in Christ, he is a new creation; the old has passed away, behold, the new has come (2 Cor 5:17).",
      consummation: "'Behold, the dwelling place of God is with man... Behold, I am making all things new' (Rev 21:3, 5)."
    },
    reflectionQuestions: [
      "What aspect of the New Creation (no more death, sorrow, or pain) do you long for most?",
      "How does living as a 'new creation' today foreshadow the future renewal of the entire cosmos?"
    ]
  }
]

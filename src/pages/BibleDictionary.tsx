import { useState, useMemo } from 'react'
import { BookOpen, Search, Tag, MapPin, User, Scroll, X } from 'lucide-react'

interface DictionaryEntry {
  term: string
  category: 'person' | 'place' | 'concept' | 'object' | 'event'
  definition: string
  hebrewGreek?: string
  references: string[]
  relatedTerms?: string[]
}

const categoryIcons = {
  person: User,
  place: MapPin,
  concept: Scroll,
  object: Tag,
  event: Scroll
}

const categoryColors = {
  person: 'bg-blue-500',
  place: 'bg-green-500',
  concept: 'bg-purple-500',
  object: 'bg-amber-500',
  event: 'bg-rose-500'
}

const categoryLabels = {
  person: 'Person',
  place: 'Place',
  concept: 'Concept',
  object: 'Object',
  event: 'Event'
}

// Comprehensive Bible Dictionary Entries
const dictionaryEntries: DictionaryEntry[] = [
  // === PERSONS ===
  {
    term: "Abraham",
    category: "person",
    definition: "The patriarch called by God from Ur of the Chaldees to be the father of the Hebrew nation. God made a covenant with him, promising that his descendants would be as numerous as the stars. He is considered the father of faith in Judaism, Christianity, and Islam.",
    hebrewGreek: "Hebrew: אַבְרָהָם (Avraham) - 'Father of many'",
    references: ["Genesis 12:1-3", "Genesis 15:6", "Romans 4:3", "Hebrews 11:8-12", "Galatians 3:6-9"],
    relatedTerms: ["Sarah", "Isaac", "Covenant", "Faith"]
  },
  {
    term: "Moses",
    category: "person",
    definition: "The great lawgiver and prophet who led Israel out of Egyptian bondage. He received the Ten Commandments on Mount Sinai and authored the first five books of the Bible (Torah/Pentateuch). He is considered the greatest prophet in the Old Testament.",
    hebrewGreek: "Hebrew: מֹשֶׁה (Mosheh) - 'Drawn out'",
    references: ["Exodus 3:1-10", "Exodus 20:1-17", "Deuteronomy 34:10", "Hebrews 11:24-28"],
    relatedTerms: ["Exodus", "Law", "Sinai", "Ten Commandments"]
  },
  {
    term: "David",
    category: "person",
    definition: "The second king of Israel, described as 'a man after God's own heart.' He united the kingdom, conquered Jerusalem, and established it as Israel's capital. God promised that his throne would be established forever, fulfilled in Jesus Christ.",
    hebrewGreek: "Hebrew: דָּוִד (David) - 'Beloved'",
    references: ["1 Samuel 16:13", "2 Samuel 7:12-16", "Psalm 23", "Acts 13:22", "Matthew 1:1"],
    relatedTerms: ["Solomon", "Jerusalem", "Messiah", "Psalms"]
  },
  {
    term: "Paul",
    category: "person",
    definition: "Originally named Saul, a Pharisee who persecuted Christians until his dramatic conversion on the road to Damascus. He became the greatest missionary and theologian of the early church, writing 13 epistles in the New Testament.",
    hebrewGreek: "Greek: Παῦλος (Paulos) - 'Small'",
    references: ["Acts 9:1-19", "Galatians 1:11-24", "Philippians 3:4-11", "2 Timothy 4:7"],
    relatedTerms: ["Apostle", "Gentiles", "Grace", "Justification"]
  },
  {
    term: "Peter",
    category: "person",
    definition: "One of the twelve apostles and a leader of the early church. Originally a fisherman named Simon, Jesus renamed him Peter (Rock). He was the first to confess Jesus as the Christ and preached the first sermon at Pentecost.",
    hebrewGreek: "Greek: Πέτρος (Petros) - 'Rock'",
    references: ["Matthew 16:16-19", "John 21:15-17", "Acts 2:14-41", "1 Peter 1:1"],
    relatedTerms: ["Apostle", "Church", "Pentecost", "Keys of the Kingdom"]
  },
  {
    term: "Elijah",
    category: "person",
    definition: "A powerful prophet in Israel during the reign of Ahab. He confronted the prophets of Baal on Mount Carmel and was taken to heaven in a chariot of fire. His return was prophesied before the coming of the Messiah.",
    hebrewGreek: "Hebrew: אֵלִיָּהוּ (Eliyahu) - 'My God is YHWH'",
    references: ["1 Kings 18:20-40", "2 Kings 2:11", "Malachi 4:5", "Matthew 17:1-3"],
    relatedTerms: ["Elisha", "Baal", "Mount Carmel", "John the Baptist"]
  },
  {
    term: "Mary",
    category: "person",
    definition: "The virgin mother of Jesus Christ. She was chosen by God to bear the Messiah through the Holy Spirit. She is honored as blessed among women and demonstrated faithful obedience to God's will.",
    hebrewGreek: "Hebrew: מִרְיָם (Miriam) - 'Wished-for child' or 'Bitter'",
    references: ["Luke 1:26-38", "Luke 1:46-55", "John 2:1-11", "Acts 1:14"],
    relatedTerms: ["Jesus", "Virgin Birth", "Magnificat", "Joseph"]
  },

  // === PLACES ===
  {
    term: "Jerusalem",
    category: "place",
    definition: "The holy city and capital of Israel, also called Zion, the City of David, and the City of the Great King. It housed the Temple and was the center of Jewish worship. Jesus was crucified and resurrected here.",
    hebrewGreek: "Hebrew: יְרוּשָׁלַיִם (Yerushalayim) - 'Foundation of Peace'",
    references: ["2 Samuel 5:6-7", "Psalm 122:1-4", "Matthew 23:37", "Revelation 21:2"],
    relatedTerms: ["Temple", "Zion", "Mount Moriah", "New Jerusalem"]
  },
  {
    term: "Bethlehem",
    category: "place",
    definition: "A small town about 5 miles south of Jerusalem. It was the birthplace of King David and, as prophesied by Micah, the birthplace of Jesus Christ. The name means 'House of Bread.'",
    hebrewGreek: "Hebrew: בֵּית לֶחֶם (Beit Lechem) - 'House of Bread'",
    references: ["Micah 5:2", "Ruth 1:1", "1 Samuel 16:1", "Matthew 2:1-6", "Luke 2:4-7"],
    relatedTerms: ["David", "Nativity", "Ruth", "Ephrathah"]
  },
  {
    term: "Egypt",
    category: "place",
    definition: "The ancient civilization along the Nile River where Israel was enslaved for 400 years. It represents bondage and worldliness in Scripture. God delivered Israel from Egypt through Moses in the Exodus.",
    hebrewGreek: "Hebrew: מִצְרַיִם (Mitzrayim) - 'Narrow places/Straits'",
    references: ["Genesis 46:3-4", "Exodus 1:8-14", "Exodus 12:40-41", "Hosea 11:1", "Matthew 2:15"],
    relatedTerms: ["Exodus", "Pharaoh", "Plagues", "Passover"]
  },
  {
    term: "Mount Sinai",
    category: "place",
    definition: "The mountain where God gave Moses the Ten Commandments and made His covenant with Israel. Also called Horeb, it was where Moses saw the burning bush. A place of divine revelation.",
    hebrewGreek: "Hebrew: הַר סִינַי (Har Sinai)",
    references: ["Exodus 3:1-2", "Exodus 19:16-20", "Exodus 20:1-17", "Galatians 4:24-25"],
    relatedTerms: ["Moses", "Ten Commandments", "Law", "Covenant"]
  },
  {
    term: "Babylon",
    category: "place",
    definition: "An ancient empire that conquered Judah and destroyed Jerusalem in 586 BC. It represents worldly power opposed to God and is used symbolically in Revelation for corrupt systems. The Jews were exiled here for 70 years.",
    hebrewGreek: "Hebrew: בָּבֶל (Bavel) - 'Confusion'",
    references: ["2 Kings 25:1-11", "Psalm 137:1", "Jeremiah 29:10", "Revelation 17:5", "Revelation 18:2"],
    relatedTerms: ["Exile", "Nebuchadnezzar", "Daniel", "Tower of Babel"]
  },
  {
    term: "Galilee",
    category: "place",
    definition: "A region in northern Israel where Jesus grew up and conducted much of His ministry. The Sea of Galilee was the setting for many miracles. Most of Jesus' disciples came from this region.",
    hebrewGreek: "Hebrew: גָּלִיל (Galil) - 'Circuit/Region'",
    references: ["Matthew 4:12-16", "John 2:1-11", "Matthew 28:7", "Acts 1:11"],
    relatedTerms: ["Nazareth", "Capernaum", "Sea of Galilee", "Disciples"]
  },

  // === CONCEPTS ===
  {
    term: "Covenant",
    category: "concept",
    definition: "A solemn, binding agreement between God and His people. Major covenants include those with Noah (rainbow), Abraham (descendants), Moses (Law), David (throne), and the New Covenant through Christ's blood.",
    hebrewGreek: "Hebrew: בְּרִית (Berit); Greek: διαθήκη (Diatheke)",
    references: ["Genesis 9:12-17", "Genesis 17:1-8", "Exodus 24:7-8", "Jeremiah 31:31-34", "Hebrews 8:6-13"],
    relatedTerms: ["Promise", "Testament", "Blood", "Oath"]
  },
  {
    term: "Justification",
    category: "concept",
    definition: "The act of God declaring sinners righteous based on their faith in Christ. It is a legal term meaning to be acquitted or declared 'not guilty.' It is by grace through faith, not by works.",
    hebrewGreek: "Greek: δικαίωσις (Dikaiosis) - 'Acquittal, vindication'",
    references: ["Romans 3:24-26", "Romans 5:1", "Galatians 2:16", "Titus 3:7"],
    relatedTerms: ["Grace", "Faith", "Righteousness", "Salvation"]
  },
  {
    term: "Sanctification",
    category: "concept",
    definition: "The ongoing process by which believers are made holy and conformed to the image of Christ. It begins at salvation and continues throughout life by the work of the Holy Spirit.",
    hebrewGreek: "Greek: ἁγιασμός (Hagiasmos) - 'Holiness, consecration'",
    references: ["1 Thessalonians 4:3", "Romans 6:19-22", "Hebrews 12:14", "1 Peter 1:15-16"],
    relatedTerms: ["Holiness", "Holy Spirit", "Transformation", "Righteousness"]
  },
  {
    term: "Redemption",
    category: "concept",
    definition: "The act of buying back or setting free by paying a price. In the Bible, it refers to God's deliverance of His people from sin through Christ's death on the cross. The price paid was His precious blood.",
    hebrewGreek: "Hebrew: גְּאֻלָּה (Geulah); Greek: ἀπολύτρωσις (Apolytrosis)",
    references: ["Exodus 6:6", "Ruth 4:4-6", "Ephesians 1:7", "Colossians 1:14", "1 Peter 1:18-19"],
    relatedTerms: ["Salvation", "Ransom", "Blood", "Kinsman-Redeemer"]
  },
  {
    term: "Atonement",
    category: "concept",
    definition: "The reconciliation of God and humanity through the sacrificial death of Jesus Christ. In the Old Testament, atonement was made through animal sacrifices; Christ's sacrifice was the final, perfect atonement.",
    hebrewGreek: "Hebrew: כִּפֻּרִים (Kippurim) - 'Covering'; Greek: ἱλασμός (Hilasmos)",
    references: ["Leviticus 16:30", "Leviticus 17:11", "Romans 3:25", "1 John 2:2", "Hebrews 9:11-14"],
    relatedTerms: ["Sacrifice", "Propitiation", "Day of Atonement", "Blood"]
  },
  {
    term: "Grace",
    category: "concept",
    definition: "God's unmerited favor toward sinful humanity. It is the foundation of salvation—receiving what we don't deserve. Grace cannot be earned; it is a free gift from God through faith in Christ.",
    hebrewGreek: "Hebrew: חֵן (Chen); Greek: χάρις (Charis)",
    references: ["Ephesians 2:8-9", "Romans 5:20-21", "Titus 2:11", "2 Corinthians 12:9", "John 1:14"],
    relatedTerms: ["Mercy", "Salvation", "Faith", "Gift"]
  },
  {
    term: "Faith",
    category: "concept",
    definition: "Trust and confidence in God and His promises. It is the means by which we receive salvation and please God. True faith results in obedience and good works but is not dependent on them.",
    hebrewGreek: "Hebrew: אֱמוּנָה (Emunah); Greek: πίστις (Pistis)",
    references: ["Hebrews 11:1", "Hebrews 11:6", "Romans 10:17", "Ephesians 2:8", "James 2:17"],
    relatedTerms: ["Belief", "Trust", "Hope", "Works"]
  },
  {
    term: "Repentance",
    category: "concept",
    definition: "A complete change of mind and direction, turning away from sin and toward God. It involves genuine sorrow for sin and a commitment to live differently. It is essential for salvation and ongoing Christian life.",
    hebrewGreek: "Hebrew: תְּשׁוּבָה (Teshuvah); Greek: μετάνοια (Metanoia) - 'Change of mind'",
    references: ["Acts 2:38", "Acts 3:19", "2 Corinthians 7:10", "Luke 15:7", "Revelation 2:5"],
    relatedTerms: ["Confession", "Forgiveness", "Conversion", "Sin"]
  },
  {
    term: "Gospel",
    category: "concept",
    definition: "The 'good news' of salvation through Jesus Christ. It proclaims that Jesus died for our sins, was buried, and rose again. The gospel is the power of God for salvation to everyone who believes.",
    hebrewGreek: "Greek: εὐαγγέλιον (Euangelion) - 'Good news'",
    references: ["Mark 1:15", "Romans 1:16", "1 Corinthians 15:1-4", "Galatians 1:6-9"],
    relatedTerms: ["Salvation", "Jesus Christ", "Good News", "Kingdom"]
  },
  {
    term: "Kingdom of God",
    category: "concept",
    definition: "God's sovereign rule over all creation and, more specifically, His redemptive reign through Christ. It was inaugurated at Christ's first coming and will be consummated at His return. Also called Kingdom of Heaven.",
    hebrewGreek: "Greek: βασιλεία τοῦ θεοῦ (Basileia tou Theou)",
    references: ["Matthew 4:17", "Matthew 6:33", "Mark 1:15", "Luke 17:20-21", "Romans 14:17"],
    relatedTerms: ["King", "Reign", "Heaven", "Messiah"]
  },
  {
    term: "Sin",
    category: "concept",
    definition: "Any thought, word, or action that violates God's holy character and law. It entered the world through Adam and affects all humanity. Sin separates us from God and results in death, both physical and spiritual.",
    hebrewGreek: "Hebrew: חַטָּאָה (Chatta'ah); Greek: ἁμαρτία (Hamartia) - 'Missing the mark'",
    references: ["Romans 3:23", "Romans 6:23", "Genesis 3:6-7", "1 John 1:8-10", "Isaiah 59:2"],
    relatedTerms: ["Fall", "Transgression", "Iniquity", "Death"]
  },
  {
    term: "Resurrection",
    category: "concept",
    definition: "The rising from the dead. Christ's resurrection is the cornerstone of Christian faith, proving His deity and victory over death. All believers will be resurrected with glorified bodies at His return.",
    hebrewGreek: "Greek: ἀνάστασις (Anastasis) - 'Rising up'",
    references: ["1 Corinthians 15:3-8", "1 Corinthians 15:42-44", "Romans 6:5", "John 11:25", "Philippians 3:21"],
    relatedTerms: ["Easter", "Empty Tomb", "Glorified Body", "Eternal Life"]
  },
  {
    term: "Holy Spirit",
    category: "concept",
    definition: "The third Person of the Trinity, fully God. He convicts of sin, regenerates believers, indwells them, empowers for service, produces spiritual fruit, and gives spiritual gifts. He is the Comforter and Helper.",
    hebrewGreek: "Hebrew: רוּחַ הַקֹּדֶשׁ (Ruach HaKodesh); Greek: Πνεῦμα Ἅγιον (Pneuma Hagion)",
    references: ["John 14:16-17", "John 16:7-11", "Acts 1:8", "Romans 8:9-11", "Galatians 5:22-23"],
    relatedTerms: ["Trinity", "Comforter", "Pentecost", "Spiritual Gifts"]
  },
  {
    term: "Trinity",
    category: "concept",
    definition: "The doctrine that God is one Being who exists eternally in three Persons: Father, Son, and Holy Spirit. Each is fully God, distinct in Person, yet one in essence, power, and glory.",
    hebrewGreek: "Latin: Trinitas - 'Three in one'",
    references: ["Matthew 28:19", "2 Corinthians 13:14", "John 1:1", "Genesis 1:26", "Isaiah 48:16"],
    relatedTerms: ["God", "Jesus Christ", "Holy Spirit", "Godhead"]
  },
  {
    term: "Propitiation",
    category: "concept",
    definition: "The satisfaction of God's righteous wrath against sin through Christ's sacrifice. Jesus became the propitiation for our sins, turning away God's judgment and making reconciliation possible.",
    hebrewGreek: "Greek: ἱλαστήριον (Hilasterion) - 'Mercy seat, means of propitiation'",
    references: ["Romans 3:25", "1 John 2:2", "1 John 4:10", "Hebrews 2:17"],
    relatedTerms: ["Atonement", "Wrath", "Satisfaction", "Mercy Seat"]
  },

  // === OBJECTS ===
  {
    term: "Ark of the Covenant",
    category: "object",
    definition: "The sacred chest containing the stone tablets of the Ten Commandments, Aaron's rod, and a pot of manna. It represented God's presence with Israel and was kept in the Holy of Holies in the Tabernacle and Temple.",
    hebrewGreek: "Hebrew: אֲרוֹן הַבְּרִית (Aron HaBerit)",
    references: ["Exodus 25:10-22", "Hebrews 9:4", "1 Samuel 4:3-11", "2 Samuel 6:1-15"],
    relatedTerms: ["Tabernacle", "Temple", "Mercy Seat", "Ten Commandments"]
  },
  {
    term: "Temple",
    category: "object",
    definition: "The house of worship in Jerusalem, first built by Solomon and later rebuilt by Zerubbabel and Herod. It was where God's presence dwelt and sacrifices were offered. Destroyed in 70 AD; believers are now God's temple.",
    hebrewGreek: "Hebrew: בֵּית הַמִּקְדָּשׁ (Beit HaMikdash); Greek: ναός (Naos)",
    references: ["1 Kings 6:1", "2 Chronicles 7:1-3", "John 2:19-21", "1 Corinthians 3:16", "Ephesians 2:21"],
    relatedTerms: ["Tabernacle", "Solomon", "Holy of Holies", "Sacrifice"]
  },
  {
    term: "Cross",
    category: "object",
    definition: "The instrument of Jesus' crucifixion, transformed from a symbol of shame to the central emblem of Christian faith. It represents Christ's atoning sacrifice, God's love, and the believer's call to die to self.",
    hebrewGreek: "Greek: σταυρός (Stauros)",
    references: ["Matthew 27:32-50", "1 Corinthians 1:18", "Galatians 6:14", "Colossians 2:14", "Hebrews 12:2"],
    relatedTerms: ["Crucifixion", "Atonement", "Redemption", "Sacrifice"]
  },
  {
    term: "Bread and Wine",
    category: "object",
    definition: "Elements used in the Lord's Supper, instituted by Jesus at the Last Supper. The bread represents His body broken for us; the wine represents His blood of the new covenant shed for the forgiveness of sins.",
    hebrewGreek: "Greek: ἄρτος (Artos) - bread; οἶνος (Oinos) - wine",
    references: ["Matthew 26:26-28", "1 Corinthians 11:23-26", "John 6:35", "John 6:53-56"],
    relatedTerms: ["Lord's Supper", "Communion", "Eucharist", "New Covenant"]
  },
  {
    term: "Scroll",
    category: "object",
    definition: "The ancient form of books, made of papyrus or parchment rolled around rods. Scripture was written on scrolls and read publicly in synagogues. The seven-sealed scroll in Revelation represents God's purposes.",
    hebrewGreek: "Hebrew: מְגִלָּה (Megillah); Greek: βιβλίον (Biblion)",
    references: ["Jeremiah 36:2", "Luke 4:17-20", "Revelation 5:1-5", "Ezekiel 2:9-10"],
    relatedTerms: ["Scripture", "Word of God", "Torah", "Book of Life"]
  },

  // === EVENTS ===
  {
    term: "Exodus",
    category: "event",
    definition: "Israel's miraculous deliverance from Egyptian slavery under Moses' leadership. It included the ten plagues, Passover, crossing the Red Sea, and journey to Mount Sinai. It's the defining event of Old Testament redemption.",
    hebrewGreek: "Greek: ἔξοδος (Exodos) - 'Going out, departure'",
    references: ["Exodus 12:31-42", "Exodus 14:21-31", "Deuteronomy 6:21-23", "Hebrews 11:29"],
    relatedTerms: ["Moses", "Passover", "Red Sea", "Plagues"]
  },
  {
    term: "Passover",
    category: "event",
    definition: "The annual Jewish festival commemorating Israel's deliverance from Egypt when the death angel 'passed over' homes marked with lamb's blood. Jesus, the Lamb of God, was crucified during Passover.",
    hebrewGreek: "Hebrew: פֶּסַח (Pesach) - 'Passing over, sparing'",
    references: ["Exodus 12:1-14", "1 Corinthians 5:7", "John 1:29", "Luke 22:7-20"],
    relatedTerms: ["Exodus", "Lamb", "Lord's Supper", "Unleavened Bread"]
  },
  {
    term: "Pentecost",
    category: "event",
    definition: "The Jewish harvest festival (Feast of Weeks) when the Holy Spirit was poured out on the early church in Jerusalem. It marked the birth of the church with 3,000 baptized after Peter's sermon.",
    hebrewGreek: "Greek: Πεντηκοστή (Pentekoste) - 'Fiftieth (day)'",
    references: ["Acts 2:1-41", "Leviticus 23:15-21", "Joel 2:28-32"],
    relatedTerms: ["Holy Spirit", "Church", "Tongues", "Peter"]
  },
  {
    term: "Crucifixion",
    category: "event",
    definition: "The Roman method of execution by which Jesus died for the sins of the world. He was nailed to a cross at Golgotha outside Jerusalem, fulfilling prophecy and accomplishing redemption.",
    hebrewGreek: "Greek: σταυρόω (Stauroo) - 'To crucify'",
    references: ["Matthew 27:32-56", "Isaiah 53:5", "Psalm 22:16-18", "Galatians 3:13", "1 Peter 2:24"],
    relatedTerms: ["Cross", "Atonement", "Golgotha", "Good Friday"]
  },
  {
    term: "Second Coming",
    category: "event",
    definition: "The future, visible return of Jesus Christ to earth in power and glory. He will judge the living and the dead, defeat His enemies, and establish His eternal kingdom. Every eye will see Him.",
    hebrewGreek: "Greek: παρουσία (Parousia) - 'Coming, presence, arrival'",
    references: ["Matthew 24:30", "Acts 1:11", "1 Thessalonians 4:16-17", "Revelation 1:7", "Revelation 19:11-16"],
    relatedTerms: ["Rapture", "Judgment", "Kingdom", "Millennium"]
  },
  {
    term: "Creation",
    category: "event",
    definition: "God's act of bringing the universe into existence from nothing. In six days He created all things by the power of His word, culminating in the creation of humanity in His image. On the seventh day He rested.",
    hebrewGreek: "Hebrew: בָּרָא (Bara) - 'To create (from nothing)'",
    references: ["Genesis 1:1-31", "Genesis 2:1-3", "John 1:3", "Colossians 1:16", "Hebrews 11:3"],
    relatedTerms: ["God", "Adam", "Eve", "Image of God"]
  },
  {
    term: "Fall",
    category: "event",
    definition: "The event in which Adam and Eve disobeyed God by eating the forbidden fruit, bringing sin and death into the world. It resulted in humanity's separation from God and corruption of all creation.",
    references: ["Genesis 3:1-24", "Romans 5:12", "Romans 5:18-19", "1 Corinthians 15:21-22"],
    relatedTerms: ["Sin", "Adam", "Eve", "Serpent", "Death"]
  },
  {
    term: "Flood",
    category: "event",
    definition: "The worldwide deluge in Noah's time that destroyed all air-breathing life except those on the ark. It was God's judgment on humanity's wickedness. The rainbow became the sign of God's covenant never to flood the earth again.",
    hebrewGreek: "Hebrew: מַבּוּל (Mabbul)",
    references: ["Genesis 6:5-8:22", "Genesis 9:11-17", "Matthew 24:37-39", "2 Peter 2:5", "1 Peter 3:20"],
    relatedTerms: ["Noah", "Ark", "Rainbow", "Judgment"]
  },
  {
    term: "Transfiguration",
    category: "event",
    definition: "The event when Jesus' divine glory was revealed on a mountain before Peter, James, and John. His face shone like the sun, His clothes became dazzling white, and Moses and Elijah appeared with Him.",
    hebrewGreek: "Greek: μεταμορφόω (Metamorphoo) - 'To transform'",
    references: ["Matthew 17:1-8", "Mark 9:2-8", "Luke 9:28-36", "2 Peter 1:16-18"],
    relatedTerms: ["Jesus", "Moses", "Elijah", "Glory"]
  },
  {
    term: "Baptism",
    category: "event",
    definition: "A Christian ordinance symbolizing identification with Christ in His death, burial, and resurrection. It is an outward expression of inward faith and marks entry into the visible church community.",
    hebrewGreek: "Greek: βάπτισμα (Baptisma) - 'Immersion, washing'",
    references: ["Matthew 28:19", "Romans 6:3-4", "Acts 2:38", "Colossians 2:12", "1 Peter 3:21"],
    relatedTerms: ["Water", "Holy Spirit", "Repentance", "Church"]
  }
]

export default function BibleDictionary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null)

  const filteredEntries = useMemo(() => {
    return dictionaryEntries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === null || entry.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const categories = ['person', 'place', 'concept', 'object', 'event'] as const

  const alphabeticalGroups = useMemo(() => {
    const groups: Record<string, DictionaryEntry[]> = {}
    filteredEntries.forEach(entry => {
      const letter = entry.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(entry)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredEntries])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bible Dictionary</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore definitions of biblical terms, people, places, and concepts
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search terms, definitions..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All ({dictionaryEntries.length})
        </button>
        {categories.map(cat => {
          const Icon = categoryIcons[cat]
          const count = dictionaryEntries.filter(e => e.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? `${categoryColors[cat]} text-white`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {categoryLabels[cat]} ({count})
            </button>
          )
        })}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredEntries.length} of {dictionaryEntries.length} entries
      </p>

      {/* Dictionary Entries */}
      <div className="space-y-6">
        {alphabeticalGroups.map(([letter, entries]) => (
          <div key={letter}>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 sticky top-0 bg-gray-50 dark:bg-gray-900 py-2">
              {letter}
            </h2>
            <div className="space-y-2">
              {entries.map(entry => {
                const Icon = categoryIcons[entry.category]
                return (
                  <button
                    key={entry.term}
                    onClick={() => setSelectedEntry(entry)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${categoryColors[entry.category]} p-2 rounded-lg flex-shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {entry.term}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                            {categoryLabels[entry.category]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {entry.definition}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No entries found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedEntry(null)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${categoryColors[selectedEntry.category]} p-6 rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = categoryIcons[selectedEntry.category]
                    return <Icon className="h-6 w-6 text-white" />
                  })()}
                  <div>
                    <span className="text-white/80 text-sm">{categoryLabels[selectedEntry.category]}</span>
                    <h2 className="text-2xl font-bold text-white">{selectedEntry.term}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Hebrew/Greek */}
              {selectedEntry.hebrewGreek && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Original Language</p>
                  <p className="text-gray-900 dark:text-white">{selectedEntry.hebrewGreek}</p>
                </div>
              )}

              {/* Definition */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Definition</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedEntry.definition}
                </p>
              </div>

              {/* Scripture References */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Scripture References</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.references.map(ref => (
                    <span
                      key={ref}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      📖 {ref}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Terms */}
              {selectedEntry.relatedTerms && selectedEntry.relatedTerms.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Related Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.relatedTerms.map(term => {
                      const relatedEntry = dictionaryEntries.find(e => e.term === term)
                      return (
                        <button
                          key={term}
                          onClick={() => relatedEntry && setSelectedEntry(relatedEntry)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            relatedEntry
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                          }`}
                        >
                          {term}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
          📚 About the Bible Dictionary
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          This dictionary provides definitions for key biblical terms, people, places, concepts, and events. 
          Each entry includes the original Hebrew or Greek meaning, relevant Scripture references, and related terms to help deepen your study.
        </p>
      </div>
    </div>
  )
}

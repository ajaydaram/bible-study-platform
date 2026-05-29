/**
 * Church Fathers Quotes & Writings Database
 * Primary sources from the first 500 years of Christianity
 * Data: Public Domain (CCEL, Early Christian Writings)
 */

export interface ChurchFather {
  id: string;
  name: string;
  latinName?: string;
  dates: string;
  era: 'apostolic' | 'ante-nicene' | 'nicene' | 'post-nicene';
  location: string;
  title: string;
  bio: string;
  majorWorks: string[];
  themes: string[];
}

export interface PatristicQuote {
  id: string;
  fatherId: string;
  text: string;
  source: string;
  chapter?: string;
  themes: string[];
  scriptureRefs?: string[];
  year?: number;
}

export interface HistoricalEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  type: 'council' | 'creed' | 'persecution' | 'figure' | 'writing' | 'event';
  significance: string;
  relatedFathers?: string[];
  relatedScripture?: string[];
}

export interface CreedConfession {
  id: string;
  name: string;
  type: 'creed' | 'confession' | 'catechism';
  tradition: 'ecumenical' | 'reformed' | 'lutheran' | 'baptist' | 'anglican' | 'methodist' | 'catholic' | 'orthodox' | 'other';
  year: number;
  century: number;
  summary: string;
  keyStatements: string[];
  relatedScripture?: string[];
}

// ============================================
// CHURCH FATHERS DATABASE
// ============================================

export const churchFathers: ChurchFather[] = [
  // APOSTOLIC FATHERS (c. 70-150 AD)
  {
    id: 'clement-rome',
    name: 'Clement of Rome',
    dates: 'c. 35–99 AD',
    era: 'apostolic',
    location: 'Rome',
    title: 'Bishop of Rome',
    bio: 'Third or fourth bishop of Rome, knew the apostles Peter and Paul directly. His letter to the Corinthians is the earliest Christian document outside the New Testament.',
    majorWorks: ['First Epistle of Clement'],
    themes: ['church order', 'unity', 'humility', 'apostolic succession']
  },
  {
    id: 'ignatius-antioch',
    name: 'Ignatius of Antioch',
    latinName: 'Ignatius Theophorus',
    dates: 'c. 50–108 AD',
    era: 'apostolic',
    location: 'Antioch, Syria',
    title: 'Bishop of Antioch',
    bio: 'Third bishop of Antioch, student of the Apostle John. Wrote seven letters while being transported to Rome for martyrdom. First to use the term "catholic church."',
    majorWorks: ['Letter to the Ephesians', 'Letter to the Romans', 'Letter to the Smyrnaeans'],
    themes: ['martyrdom', 'eucharist', 'church unity', 'episcopacy', 'incarnation']
  },
  {
    id: 'polycarp-smyrna',
    name: 'Polycarp of Smyrna',
    dates: 'c. 69–155 AD',
    era: 'apostolic',
    location: 'Smyrna (modern Izmir, Turkey)',
    title: 'Bishop of Smyrna',
    bio: 'Direct disciple of the Apostle John, teacher of Irenaeus. Martyred at age 86 when he refused to curse Christ, saying "Eighty-six years I have served Him, and He never did me any wrong."',
    majorWorks: ['Letter to the Philippians', 'Martyrdom of Polycarp'],
    themes: ['martyrdom', 'faithfulness', 'apostolic tradition']
  },
  {
    id: 'didache',
    name: 'The Didache',
    dates: 'c. 50–120 AD',
    era: 'apostolic',
    location: 'Syria',
    title: 'Teaching of the Twelve Apostles',
    bio: 'Early church manual describing Christian ethics, rituals, and church organization. Possibly the earliest Christian catechism.',
    majorWorks: ['Didache'],
    themes: ['baptism', 'eucharist', 'ethics', 'two ways', 'church practice']
  },

  // ANTE-NICENE FATHERS (c. 150-325 AD)
  {
    id: 'justin-martyr',
    name: 'Justin Martyr',
    dates: 'c. 100–165 AD',
    era: 'ante-nicene',
    location: 'Samaria → Rome',
    title: 'Apologist & Philosopher',
    bio: 'Pagan philosopher who converted to Christianity. First great Christian apologist, defended the faith before Roman emperors. Martyred in Rome.',
    majorWorks: ['First Apology', 'Second Apology', 'Dialogue with Trypho'],
    themes: ['apologetics', 'logos theology', 'philosophy', 'prophecy fulfillment']
  },
  {
    id: 'irenaeus-lyon',
    name: 'Irenaeus of Lyon',
    latinName: 'Irenaeus Lugdunensis',
    dates: 'c. 130–202 AD',
    era: 'ante-nicene',
    location: 'Smyrna → Lyon, Gaul',
    title: 'Bishop of Lyon',
    bio: 'Student of Polycarp (who knew John). First great systematic theologian. Refuted Gnosticism and established orthodox Christianity. Key link between apostolic and later church.',
    majorWorks: ['Against Heresies', 'Demonstration of Apostolic Preaching'],
    themes: ['recapitulation', 'apostolic tradition', 'anti-gnosticism', 'scripture']
  },
  {
    id: 'tertullian',
    name: 'Tertullian',
    latinName: 'Quintus Septimius Florens Tertullianus',
    dates: 'c. 155–220 AD',
    era: 'ante-nicene',
    location: 'Carthage, North Africa',
    title: 'Father of Latin Christianity',
    bio: 'First major Christian author to write in Latin. Coined the term "Trinity" (trinitas). Brilliant apologist and polemicist, later joined the Montanist movement.',
    majorWorks: ['Apology', 'Against Praxeas', 'On Baptism', 'On the Flesh of Christ'],
    themes: ['trinity', 'apologetics', 'montanism', 'martyrdom', 'moral rigor']
  },
  {
    id: 'origen',
    name: 'Origen of Alexandria',
    latinName: 'Origenes Adamantius',
    dates: 'c. 185–254 AD',
    era: 'ante-nicene',
    location: 'Alexandria, Egypt',
    title: 'Biblical Scholar & Theologian',
    bio: 'Most prolific early Christian writer. Created the Hexapla (six-column Bible). Pioneered allegorical interpretation. Some views later deemed controversial.',
    majorWorks: ['On First Principles', 'Against Celsus', 'Hexapla', 'Commentaries'],
    themes: ['allegory', 'scripture', 'philosophy', 'spiritual interpretation']
  },
  {
    id: 'cyprian-carthage',
    name: 'Cyprian of Carthage',
    dates: 'c. 210–258 AD',
    era: 'ante-nicene',
    location: 'Carthage, North Africa',
    title: 'Bishop of Carthage',
    bio: 'Wealthy aristocrat who converted and became bishop. Martyred under Emperor Valerian. Famous for "He cannot have God as Father who does not have the Church as Mother."',
    majorWorks: ['On the Unity of the Church', 'On the Lapsed', 'Letters'],
    themes: ['church unity', 'martyrdom', 'lapsed controversy', 'episcopacy']
  },

  // NICENE FATHERS (c. 325-381 AD)
  {
    id: 'athanasius',
    name: 'Athanasius of Alexandria',
    latinName: 'Athanasius Alexandrinus',
    dates: 'c. 296–373 AD',
    era: 'nicene',
    location: 'Alexandria, Egypt',
    title: 'Bishop of Alexandria',
    bio: 'Champion of Nicene orthodoxy against Arianism. Exiled five times for defending Christ\'s divinity. "Athanasius contra mundum" (Athanasius against the world).',
    majorWorks: ['On the Incarnation', 'Against the Arians', 'Life of Antony'],
    themes: ['incarnation', 'trinity', 'anti-arianism', 'deification']
  },
  {
    id: 'basil-great',
    name: 'Basil the Great',
    latinName: 'Basilius Magnus',
    dates: 'c. 330–379 AD',
    era: 'nicene',
    location: 'Caesarea, Cappadocia',
    title: 'Bishop of Caesarea',
    bio: 'One of the Cappadocian Fathers (with Gregory of Nyssa and Gregory of Nazianzus). Founded monasteries, wrote influential liturgy, and defended the Trinity.',
    majorWorks: ['On the Holy Spirit', 'Hexaemeron', 'Longer Rules', 'Shorter Rules'],
    themes: ['holy spirit', 'trinity', 'monasticism', 'social justice']
  },
  {
    id: 'gregory-nazianzus',
    name: 'Gregory of Nazianzus',
    latinName: 'Gregorius Nazianzenus',
    dates: 'c. 329–390 AD',
    era: 'nicene',
    location: 'Nazianzus → Constantinople',
    title: 'The Theologian',
    bio: 'Cappadocian Father known as "The Theologian" for his Five Theological Orations defending the Trinity. Briefly Archbishop of Constantinople.',
    majorWorks: ['Theological Orations', 'Letters', 'Poems'],
    themes: ['trinity', 'christology', 'theology proper', 'poetry']
  },
  {
    id: 'gregory-nyssa',
    name: 'Gregory of Nyssa',
    latinName: 'Gregorius Nyssenus',
    dates: 'c. 335–395 AD',
    era: 'nicene',
    location: 'Nyssa, Cappadocia',
    title: 'Bishop of Nyssa',
    bio: 'Younger brother of Basil. Most philosophical of the Cappadocians. Developed mystical theology and apophatic (negative) theology.',
    majorWorks: ['Life of Moses', 'On the Making of Man', 'Against Eunomius'],
    themes: ['trinity', 'mysticism', 'apophatic theology', 'spiritual growth']
  },

  // POST-NICENE FATHERS (c. 381-500 AD)
  {
    id: 'john-chrysostom',
    name: 'John Chrysostom',
    latinName: 'Ioannes Chrysostomus',
    dates: 'c. 349–407 AD',
    era: 'post-nicene',
    location: 'Antioch → Constantinople',
    title: 'Archbishop of Constantinople',
    bio: '"Chrysostom" means "golden-mouthed" for his eloquent preaching. Greatest preacher of the early church. Exiled for criticizing the empress.',
    majorWorks: ['Homilies on Matthew', 'Homilies on Romans', 'On the Priesthood'],
    themes: ['preaching', 'social justice', 'ethics', 'scripture exposition']
  },
  {
    id: 'jerome',
    name: 'Jerome',
    latinName: 'Eusebius Sophronius Hieronymus',
    dates: 'c. 342–420 AD',
    era: 'post-nicene',
    location: 'Stridon → Rome → Bethlehem',
    title: 'Biblical Scholar',
    bio: 'Translated the Bible into Latin (Vulgate), the standard Western Bible for 1000+ years. Learned Hebrew from Jewish rabbis. Known for sharp temperament.',
    majorWorks: ['Vulgate Bible', 'Commentaries', 'Letters', 'Lives of Famous Men'],
    themes: ['scripture translation', 'monasticism', 'biblical scholarship']
  },
  {
    id: 'augustine',
    name: 'Augustine of Hippo',
    latinName: 'Aurelius Augustinus Hipponensis',
    dates: '354–430 AD',
    era: 'post-nicene',
    location: 'Thagaste → Milan → Hippo, North Africa',
    title: 'Bishop of Hippo',
    bio: 'Most influential Western theologian. His conversion story in Confessions is a classic. Shaped doctrines of grace, original sin, and the church for centuries.',
    majorWorks: ['Confessions', 'City of God', 'On the Trinity', 'On Christian Doctrine'],
    themes: ['grace', 'original sin', 'predestination', 'love', 'trinity', 'church']
  }
];

// ============================================
// PATRISTIC QUOTES DATABASE
// ============================================

export const patristicQuotes: PatristicQuote[] = [
  // IGNATIUS OF ANTIOCH
  {
    id: 'ignatius-1',
    fatherId: 'ignatius-antioch',
    text: 'Let no one do anything connected with the Church without the bishop. Let that be deemed a proper Eucharist, which is administered either by the bishop, or by one to whom he has entrusted it.',
    source: 'Letter to the Smyrnaeans',
    chapter: '8',
    themes: ['eucharist', 'church order', 'episcopacy'],
    year: 107
  },
  {
    id: 'ignatius-2',
    fatherId: 'ignatius-antioch',
    text: 'I am the wheat of God, and am ground by the teeth of the wild beasts, that I may be found the pure bread of Christ.',
    source: 'Letter to the Romans',
    chapter: '4',
    themes: ['martyrdom', 'eucharist'],
    year: 107
  },
  {
    id: 'ignatius-3',
    fatherId: 'ignatius-antioch',
    text: 'Where the bishop is, there let the multitude of believers be; even as where Jesus Christ is, there is the catholic Church.',
    source: 'Letter to the Smyrnaeans',
    chapter: '8',
    themes: ['church unity', 'episcopacy'],
    year: 107
  },
  {
    id: 'ignatius-4',
    fatherId: 'ignatius-antioch',
    text: 'There is one Physician who is possessed both of flesh and spirit; both made and not made; God existing in flesh; true life in death; both of Mary and of God; first passible and then impassible—even Jesus Christ our Lord.',
    source: 'Letter to the Ephesians',
    chapter: '7',
    themes: ['christology', 'incarnation'],
    year: 107
  },

  // POLYCARP OF SMYRNA
  {
    id: 'polycarp-1',
    fatherId: 'polycarp-smyrna',
    text: 'Eighty-six years I have served Him, and He never did me any wrong. How can I blaspheme my King who saved me?',
    source: 'Martyrdom of Polycarp',
    chapter: '9',
    themes: ['martyrdom', 'faithfulness'],
    year: 155
  },
  {
    id: 'polycarp-2',
    fatherId: 'polycarp-smyrna',
    text: 'Stand fast, therefore, in these things, and follow the example of the Lord, being firm and unchangeable in the faith, loving the brotherhood.',
    source: 'Letter to the Philippians',
    chapter: '10',
    themes: ['faithfulness', 'love'],
    scriptureRefs: ['1 Peter 2:17', 'Romans 12:10'],
    year: 115
  },

  // IRENAEUS OF LYON
  {
    id: 'irenaeus-1',
    fatherId: 'irenaeus-lyon',
    text: 'The glory of God is man fully alive, and the life of man is the vision of God.',
    source: 'Against Heresies',
    chapter: '4.20.7',
    themes: ['anthropology', 'glory', 'life'],
    year: 180
  },
  {
    id: 'irenaeus-2',
    fatherId: 'irenaeus-lyon',
    text: 'He became what we are that He might make us what He is.',
    source: 'Against Heresies',
    chapter: '5, Preface',
    themes: ['incarnation', 'deification', 'salvation'],
    year: 180
  },
  {
    id: 'irenaeus-3',
    fatherId: 'irenaeus-lyon',
    text: 'Error, indeed, is never set forth in its naked deformity, lest, being thus exposed, it should at once be detected. But it is craftily decked out in attractive dress.',
    source: 'Against Heresies',
    chapter: '1, Preface',
    themes: ['heresy', 'discernment'],
    year: 180
  },

  // TERTULLIAN
  {
    id: 'tertullian-1',
    fatherId: 'tertullian',
    text: 'The blood of the martyrs is the seed of the Church.',
    source: 'Apologeticus',
    chapter: '50',
    themes: ['martyrdom', 'church growth'],
    year: 197
  },
  {
    id: 'tertullian-2',
    fatherId: 'tertullian',
    text: 'What has Athens to do with Jerusalem? What concord is there between the Academy and the Church?',
    source: 'Prescription Against Heretics',
    chapter: '7',
    themes: ['philosophy', 'faith', 'revelation'],
    year: 200
  },
  {
    id: 'tertullian-3',
    fatherId: 'tertullian',
    text: 'Christians are made, not born.',
    source: 'Apologeticus',
    chapter: '18',
    themes: ['conversion', 'discipleship'],
    year: 197
  },

  // CYPRIAN OF CARTHAGE
  {
    id: 'cyprian-1',
    fatherId: 'cyprian-carthage',
    text: 'He cannot have God as Father who does not have the Church as Mother.',
    source: 'On the Unity of the Church',
    chapter: '6',
    themes: ['church', 'salvation', 'unity'],
    year: 251
  },
  {
    id: 'cyprian-2',
    fatherId: 'cyprian-carthage',
    text: 'Outside the Church there is no salvation.',
    source: 'Letters',
    chapter: '73.21',
    themes: ['church', 'salvation'],
    year: 256
  },

  // ATHANASIUS
  {
    id: 'athanasius-1',
    fatherId: 'athanasius',
    text: 'For He was made man that we might be made God.',
    source: 'On the Incarnation',
    chapter: '54',
    themes: ['incarnation', 'deification', 'salvation'],
    year: 318
  },
  {
    id: 'athanasius-2',
    fatherId: 'athanasius',
    text: 'The Word of God came in His own Person, because it was He alone, the Image of the Father, who could recreate man made after the Image.',
    source: 'On the Incarnation',
    chapter: '13',
    themes: ['incarnation', 'image of God', 'redemption'],
    year: 318
  },
  {
    id: 'athanasius-3',
    fatherId: 'athanasius',
    text: "For if the works of the Word's Godhead had not taken place through the body, man had not been deified.",
    source: 'On the Incarnation',
    chapter: '54',
    themes: ['incarnation', 'deification'],
    year: 318
  },

  // BASIL THE GREAT
  {
    id: 'basil-1',
    fatherId: 'basil-great',
    text: 'A tree is known by its fruit; a man by his deeds. A good deed is never lost; he who sows courtesy reaps friendship, and he who plants kindness gathers love.',
    source: 'Homilies',
    themes: ['ethics', 'kindness', 'fruit'],
    scriptureRefs: ['Matthew 7:17-20'],
    year: 370
  },
  {
    id: 'basil-2',
    fatherId: 'basil-great',
    text: 'The bread which you do not use is the bread of the hungry; the garment hanging in your wardrobe is the garment of him who is naked.',
    source: 'Homily on Luke 12:18',
    themes: ['social justice', 'generosity', 'wealth'],
    scriptureRefs: ['Luke 12:16-21'],
    year: 368
  },

  // GREGORY OF NAZIANZUS
  {
    id: 'gregory-naz-1',
    fatherId: 'gregory-nazianzus',
    text: 'What has not been assumed has not been healed; it is what is united to his divinity that is saved.',
    source: 'Letter 101 to Cledonius',
    themes: ['incarnation', 'christology', 'salvation'],
    year: 382
  },
  {
    id: 'gregory-naz-2',
    fatherId: 'gregory-nazianzus',
    text: 'The Trinity is a true Trinity, not the enumeration of things unequal, but the comprehension of Equals.',
    source: 'Theological Orations',
    chapter: '31.9',
    themes: ['trinity'],
    year: 380
  },

  // JOHN CHRYSOSTOM
  {
    id: 'chrysostom-1',
    fatherId: 'john-chrysostom',
    text: 'No one can harm the man who does himself no wrong.',
    source: 'Letter to Olympias',
    themes: ['suffering', 'virtue', 'inner life'],
    year: 404
  },
  {
    id: 'chrysostom-2',
    fatherId: 'john-chrysostom',
    text: 'This is the rule of most perfect Christianity, its most exact definition, its highest point, namely, the seeking of the common good.',
    source: 'Homilies on 1 Corinthians',
    chapter: '25.3',
    themes: ['love', 'community', 'ethics'],
    scriptureRefs: ['1 Corinthians 10:24'],
    year: 392
  },
  {
    id: 'chrysostom-3',
    fatherId: 'john-chrysostom',
    text: 'The Scriptures were not given to us that we should enclose them in books, but that we should engrave them upon our hearts.',
    source: 'Homilies on Matthew',
    themes: ['scripture', 'heart', 'transformation'],
    year: 390
  },

  // JEROME
  {
    id: 'jerome-1',
    fatherId: 'jerome',
    text: 'Ignorance of Scripture is ignorance of Christ.',
    source: 'Commentary on Isaiah',
    chapter: 'Prologue',
    themes: ['scripture', 'christology'],
    year: 410
  },
  {
    id: 'jerome-2',
    fatherId: 'jerome',
    text: 'Read diligently the divine Scriptures. Never let the sacred volume be out of your hand.',
    source: 'Letter 52 to Nepotian',
    themes: ['scripture', 'study'],
    year: 394
  },

  // AUGUSTINE
  {
    id: 'augustine-1',
    fatherId: 'augustine',
    text: 'You have made us for yourself, O Lord, and our heart is restless until it rests in you.',
    source: 'Confessions',
    chapter: '1.1',
    themes: ['desire', 'rest', 'God'],
    year: 400
  },
  {
    id: 'augustine-2',
    fatherId: 'augustine',
    text: 'Late have I loved You, Beauty so ancient and so new, late have I loved You!',
    source: 'Confessions',
    chapter: '10.27',
    themes: ['love', 'beauty', 'conversion'],
    year: 400
  },
  {
    id: 'augustine-3',
    fatherId: 'augustine',
    text: 'Faith is to believe what you do not see; the reward of this faith is to see what you believe.',
    source: 'Sermons',
    chapter: '43.1',
    themes: ['faith', 'sight', 'reward'],
    year: 410
  },
  {
    id: 'augustine-4',
    fatherId: 'augustine',
    text: 'Grace was given to us not because we deserved it, but because we needed it.',
    source: 'On Grace and Free Will',
    themes: ['grace', 'salvation'],
    year: 426
  },
  {
    id: 'augustine-5',
    fatherId: 'augustine',
    text: 'The world is a book, and those who do not travel read only a page.',
    source: 'City of God',
    themes: ['knowledge', 'experience'],
    year: 426
  },
  {
    id: 'augustine-6',
    fatherId: 'augustine',
    text: 'In essentials, unity; in non-essentials, liberty; in all things, charity.',
    source: 'Attributed (disputed)',
    themes: ['unity', 'love', 'church'],
    year: 420
  },
  {
    id: 'augustine-7',
    fatherId: 'augustine',
    text: 'Pray as though everything depended on God. Work as though everything depended on you.',
    source: 'Attributed',
    themes: ['prayer', 'work', 'faith'],
    year: 420
  },
  {
    id: 'augustine-8',
    fatherId: 'augustine',
    text: 'The truth is like a lion; you don\'t have to defend it. Let it loose; it will defend itself.',
    source: 'Sermons',
    themes: ['truth', 'apologetics'],
    year: 410
  }
];

// ============================================
// HISTORICAL TIMELINE
// ============================================

export const historicalTimeline: HistoricalEvent[] = [
  // APOSTOLIC ERA
  {
    id: 'pentecost',
    year: 30,
    title: 'Day of Pentecost',
    description: 'The Holy Spirit descends on the disciples in Jerusalem, marking the birth of the Church.',
    type: 'event',
    significance: 'Beginning of the Christian Church',
    relatedScripture: ['Acts 2:1-41']
  },
  {
    id: 'paul-conversion',
    year: 33,
    title: 'Conversion of Paul',
    description: 'Saul of Tarsus encounters the risen Christ on the Damascus road.',
    type: 'figure',
    significance: 'Apostle to the Gentiles begins his mission',
    relatedScripture: ['Acts 9:1-19']
  },
  {
    id: 'jerusalem-council',
    year: 49,
    title: 'Council of Jerusalem',
    description: 'First church council decides Gentiles need not follow Jewish law for salvation.',
    type: 'council',
    significance: 'Christianity becomes universal, not just Jewish',
    relatedScripture: ['Acts 15:1-35']
  },
  {
    id: 'nero-persecution',
    year: 64,
    title: 'Neronian Persecution',
    description: 'Emperor Nero blames Christians for the Great Fire of Rome, beginning systematic persecution.',
    type: 'persecution',
    significance: 'First state persecution; martyrdom of Peter and Paul'
  },
  {
    id: 'temple-destruction',
    year: 70,
    title: 'Destruction of Jerusalem Temple',
    description: 'Roman forces under Titus destroy the Second Temple, ending sacrificial Judaism.',
    type: 'event',
    significance: 'Christianity separates fully from Judaism'
  },
  {
    id: 'clement-letter',
    year: 96,
    title: '1 Clement Written',
    description: 'Clement of Rome writes to the Corinthian church about order and humility.',
    type: 'writing',
    significance: 'Earliest non-canonical Christian writing',
    relatedFathers: ['clement-rome']
  },

  // ANTE-NICENE ERA
  {
    id: 'ignatius-martyrdom',
    year: 108,
    title: 'Martyrdom of Ignatius',
    description: 'Ignatius of Antioch is thrown to wild beasts in Rome, leaving behind seven letters.',
    type: 'figure',
    significance: 'Established importance of bishops and eucharist',
    relatedFathers: ['ignatius-antioch']
  },
  {
    id: 'polycarp-martyrdom',
    year: 155,
    title: 'Martyrdom of Polycarp',
    description: 'Polycarp refuses to curse Christ and is burned at Smyrna at age 86.',
    type: 'figure',
    significance: 'Last living link to the apostles',
    relatedFathers: ['polycarp-smyrna']
  },
  {
    id: 'justin-apology',
    year: 155,
    title: 'Justin\'s First Apology',
    description: 'Justin Martyr defends Christianity to Emperor Antoninus Pius.',
    type: 'writing',
    significance: 'First major Christian apologetic work',
    relatedFathers: ['justin-martyr']
  },
  {
    id: 'irenaeus-heresies',
    year: 180,
    title: 'Against Heresies Published',
    description: 'Irenaeus writes comprehensive refutation of Gnosticism.',
    type: 'writing',
    significance: 'Established orthodox theology and apostolic tradition',
    relatedFathers: ['irenaeus-lyon']
  },
  {
    id: 'tertullian-trinity',
    year: 213,
    title: 'Tertullian Coins "Trinity"',
    description: 'In Against Praxeas, Tertullian first uses the term "trinitas" for the Godhead.',
    type: 'writing',
    significance: 'Latin theological vocabulary established',
    relatedFathers: ['tertullian']
  },
  {
    id: 'origen-principles',
    year: 230,
    title: 'On First Principles',
    description: 'Origen writes the first systematic theology in Christianity.',
    type: 'writing',
    significance: 'Pioneered systematic theological reflection',
    relatedFathers: ['origen']
  },
  {
    id: 'decius-persecution',
    year: 250,
    title: 'Decian Persecution',
    description: 'Emperor Decius requires all citizens to sacrifice to Roman gods.',
    type: 'persecution',
    significance: 'First empire-wide persecution; lapsed controversy'
  },
  {
    id: 'diocletian-persecution',
    year: 303,
    title: 'Great Persecution',
    description: 'Diocletian begins the most severe persecution, destroying churches and scriptures.',
    type: 'persecution',
    significance: 'Final and worst Roman persecution'
  },

  // NICENE ERA
  {
    id: 'edict-milan',
    year: 313,
    title: 'Edict of Milan',
    description: 'Constantine and Licinius grant religious freedom, ending persecution.',
    type: 'event',
    significance: 'Christianity becomes legal'
  },
  {
    id: 'council-nicaea',
    year: 325,
    title: 'Council of Nicaea',
    description: 'First ecumenical council condemns Arianism and affirms Christ\'s full divinity.',
    type: 'council',
    significance: 'Nicene Creed established; Arianism condemned',
    relatedFathers: ['athanasius']
  },
  {
    id: 'athanasius-incarnation',
    year: 318,
    title: 'On the Incarnation',
    description: 'Athanasius writes his masterpiece on why God became man.',
    type: 'writing',
    significance: 'Classic statement of incarnational theology',
    relatedFathers: ['athanasius']
  },
  {
    id: 'council-constantinople',
    year: 381,
    title: 'Council of Constantinople',
    description: 'Second ecumenical council affirms divinity of the Holy Spirit.',
    type: 'council',
    significance: 'Full trinitarian orthodoxy established',
    relatedFathers: ['gregory-nazianzus', 'gregory-nyssa']
  },

  // POST-NICENE ERA
  {
    id: 'vulgate-completed',
    year: 405,
    title: 'Vulgate Completed',
    description: 'Jerome completes his Latin translation of the Bible from Hebrew and Greek.',
    type: 'writing',
    significance: 'Standard Western Bible for 1000+ years',
    relatedFathers: ['jerome']
  },
  {
    id: 'rome-sacked',
    year: 410,
    title: 'Rome Sacked by Visigoths',
    description: 'Alaric\'s Visigoths sack Rome, shocking the empire.',
    type: 'event',
    significance: 'Augustine writes City of God in response'
  },
  {
    id: 'council-ephesus',
    year: 431,
    title: 'Council of Ephesus',
    description: 'Third ecumenical council affirms Mary as Theotokos (God-bearer).',
    type: 'council',
    significance: 'Nestorianism condemned; Christ\'s unity affirmed'
  },
  {
    id: 'council-chalcedon',
    year: 451,
    title: 'Council of Chalcedon',
    description: 'Fourth ecumenical council defines Christ as fully divine and fully human.',
    type: 'council',
    significance: 'Chalcedonian Definition: two natures, one person'
  },
  {
    id: 'western-empire-falls',
    year: 476,
    title: 'Fall of Western Roman Empire',
    description: 'Romulus Augustulus deposed; end of ancient Rome.',
    type: 'event',
    significance: 'Church becomes preserver of civilization'
  }
];

// ============================================
// CREEDS & CONFESSIONS (ACROSS THE CENTURIES)
// ============================================

export const creedsAndConfessions: CreedConfession[] = [
  {
    id: 'apostles-creed',
    name: 'Apostles\' Creed',
    type: 'creed',
    tradition: 'ecumenical',
    year: 150,
    century: 2,
    summary: 'Early baptismal rule of faith summarizing the Trinity, incarnation, and resurrection.',
    keyStatements: [
      'I believe in God the Father Almighty, Maker of heaven and earth',
      'and in Jesus Christ, His only Son, our Lord',
      'the resurrection of the body and the life everlasting'
    ],
    relatedScripture: ['Matthew 28:19', '1 Corinthians 15:3-4']
  },
  {
    id: 'nicene-creed',
    name: 'Nicene Creed (325/381)',
    type: 'creed',
    tradition: 'ecumenical',
    year: 381,
    century: 4,
    summary: 'Definitive Trinitarian confession affirming the full deity of the Son and the Holy Spirit.',
    keyStatements: [
      'begotten, not made, being of one substance with the Father',
      'the Lord and Giver of life, who proceeds from the Father',
      'one holy catholic and apostolic Church'
    ],
    relatedScripture: ['John 1:1-3', 'Colossians 2:9']
  },
  {
    id: 'athanasian-creed',
    name: 'Athanasian Creed',
    type: 'creed',
    tradition: 'ecumenical',
    year: 500,
    century: 5,
    summary: 'Western creed emphasizing the Trinity and the two natures of Christ.',
    keyStatements: [
      'we worship one God in Trinity, and Trinity in Unity',
      'our Lord Jesus Christ, the Son of God, is God and Man',
      'one Christ, not by conversion of the Godhead into flesh'
    ],
    relatedScripture: ['Matthew 28:19', 'Philippians 2:6-8']
  },
  {
    id: 'chalcedonian-definition',
    name: 'Chalcedonian Definition',
    type: 'creed',
    tradition: 'ecumenical',
    year: 451,
    century: 5,
    summary: 'Defines Christ as one person in two natures without confusion or division.',
    keyStatements: [
      'acknowledged in two natures, without confusion, change, division, or separation',
      'one and the same Son, Lord, only-begotten',
      'truly God and truly man'
    ],
    relatedScripture: ['John 1:14', 'Hebrews 2:14']
  },
  {
    id: 'augustana',
    name: 'Augsburg Confession',
    type: 'confession',
    tradition: 'lutheran',
    year: 1530,
    century: 16,
    summary: 'Primary Lutheran confession presenting core doctrines and reforms.',
    keyStatements: [
      'justification by faith',
      'the true unity of the Church is agreement in the Gospel',
      'the sacraments as means of grace'
    ],
    relatedScripture: ['Romans 3:28', 'Ephesians 2:8-9']
  },
  {
    id: 'thirty-nine-articles',
    name: 'Thirty-Nine Articles',
    type: 'confession',
    tradition: 'anglican',
    year: 1563,
    century: 16,
    summary: 'Foundational Anglican doctrinal articles balancing catholic and reformed emphases.',
    keyStatements: [
      'Holy Scripture contains all things necessary to salvation',
      'justification by faith',
      'Christ truly suffered and died to reconcile us to God'
    ],
    relatedScripture: ['2 Timothy 3:16-17', 'Romans 5:1']
  },
  {
    id: 'belgic-confession',
    name: 'Belgic Confession',
    type: 'confession',
    tradition: 'reformed',
    year: 1561,
    century: 16,
    summary: 'Reformed confession emphasizing Scripture, Trinity, and the marks of the true Church.',
    keyStatements: [
      'the Word of God is the only rule of faith',
      'three marks of the true Church',
      'salvation by grace through Christ'
    ],
    relatedScripture: ['Acts 17:11', 'Ephesians 2:8-9']
  },
  {
    id: 'heidelberg-catechism',
    name: 'Heidelberg Catechism',
    type: 'catechism',
    tradition: 'reformed',
    year: 1563,
    century: 16,
    summary: 'Pastoral catechism structured around guilt, grace, and gratitude.',
    keyStatements: [
      'my only comfort in life and in death',
      'true faith is a sure knowledge and firm confidence',
      'the law and the gospel'
    ],
    relatedScripture: ['Romans 8:1', 'Luke 1:77']
  },
  {
    id: 'canons-dort',
    name: 'Canons of Dort',
    type: 'confession',
    tradition: 'reformed',
    year: 1619,
    century: 17,
    summary: 'Responds to the Remonstrance with five heads of doctrine on grace and salvation.',
    keyStatements: [
      'unconditional election',
      'particular redemption',
      'perseverance of the saints'
    ],
    relatedScripture: ['Ephesians 1:4-5', 'John 6:37-39']
  },
  {
    id: 'westminster-confession',
    name: 'Westminster Confession of Faith',
    type: 'confession',
    tradition: 'reformed',
    year: 1647,
    century: 17,
    summary: 'Comprehensive Reformed system of doctrine covering Scripture, God, covenant, and salvation.',
    keyStatements: [
      'the whole counsel of God is set down in Scripture',
      'God’s eternal decree',
      'justification by faith alone'
    ],
    relatedScripture: ['2 Timothy 3:16-17', 'Romans 3:24-26']
  },
  {
    id: 'westminster-shorter',
    name: 'Westminster Shorter Catechism',
    type: 'catechism',
    tradition: 'reformed',
    year: 1647,
    century: 17,
    summary: 'Memorable Q&A teaching the chief end of man and core doctrines.',
    keyStatements: [
      'Man’s chief end is to glorify God and enjoy Him forever',
      'the moral law summarized in the Ten Commandments',
      'effectual calling and justification'
    ],
    relatedScripture: ['1 Corinthians 10:31', 'Exodus 20:1-17']
  },
  {
    id: 'savoy-declaration',
    name: 'Savoy Declaration',
    type: 'confession',
    tradition: 'other',
    year: 1658,
    century: 17,
    summary: 'Congregational adaptation of Westminster with emphasis on church polity.',
    keyStatements: [
      'congregational church government',
      'covenant theology',
      'the visible and invisible church'
    ]
  },
  {
    id: 'london-baptist-1689',
    name: 'Second London Baptist Confession (1689)',
    type: 'confession',
    tradition: 'baptist',
    year: 1689,
    century: 17,
    summary: 'Baptist confession aligning with Westminster while affirming believer’s baptism.',
    keyStatements: [
      'baptism for professing believers',
      'the new covenant and the church',
      'the authority of Scripture'
    ],
    relatedScripture: ['Acts 2:38-41', 'Hebrews 8:6-13']
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFatherById(id: string): ChurchFather | undefined {
  return churchFathers.find(f => f.id === id);
}

export function getQuotesByFather(fatherId: string): PatristicQuote[] {
  return patristicQuotes.filter(q => q.fatherId === fatherId);
}

export function getQuotesByTheme(theme: string): PatristicQuote[] {
  return patristicQuotes.filter(q => 
    q.themes.some(t => t.toLowerCase().includes(theme.toLowerCase()))
  );
}

export function getQuotesByEra(era: ChurchFather['era']): PatristicQuote[] {
  const fathersInEra = churchFathers.filter(f => f.era === era).map(f => f.id);
  return patristicQuotes.filter(q => fathersInEra.includes(q.fatherId));
}

export function getRandomQuote(): PatristicQuote {
  return patristicQuotes[Math.floor(Math.random() * patristicQuotes.length)];
}

export function getDailyQuote(): PatristicQuote {
  // Use date as seed for consistent daily quote
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return patristicQuotes[dayOfYear % patristicQuotes.length];
}

export function getEventsByType(type: HistoricalEvent['type']): HistoricalEvent[] {
  return historicalTimeline.filter(e => e.type === type);
}

export function getEventsByDateRange(startYear: number, endYear: number): HistoricalEvent[] {
  return historicalTimeline.filter(e => e.year >= startYear && e.year <= endYear);
}

export function getCreedsByCentury(century: number): CreedConfession[] {
  return creedsAndConfessions.filter(c => c.century === century);
}

export function getCreedsByType(type: CreedConfession['type']): CreedConfession[] {
  return creedsAndConfessions.filter(c => c.type === type);
}

export function getCreedsByTradition(tradition: CreedConfession['tradition']): CreedConfession[] {
  return creedsAndConfessions.filter(c => c.tradition === tradition);
}

export function getAllCreedCenturies(): number[] {
  return Array.from(new Set(creedsAndConfessions.map(c => c.century))).sort((a, b) => a - b);
}

export function getAllThemes(): string[] {
  const themes = new Set<string>();
  patristicQuotes.forEach(q => q.themes.forEach(t => themes.add(t)));
  return Array.from(themes).sort();
}

export function getAllEras(): { id: ChurchFather['era']; name: string; years: string }[] {
  return [
    { id: 'apostolic', name: 'Apostolic Fathers', years: '70-150 AD' },
    { id: 'ante-nicene', name: 'Ante-Nicene Fathers', years: '150-325 AD' },
    { id: 'nicene', name: 'Nicene Fathers', years: '325-381 AD' },
    { id: 'post-nicene', name: 'Post-Nicene Fathers', years: '381-500 AD' }
  ];
}

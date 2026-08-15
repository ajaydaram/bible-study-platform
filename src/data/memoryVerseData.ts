/**
 * Scripture Memory & Spaced Repetition Gym Dataset
 * Pre-loaded decks for Romans Road, Expository Power Verses, Messianic Prophecies, and Catechism Q&As
 */

export interface MemoryVerseItem {
  id: string
  reference: string
  text: string
  topic: string
  category: 'romans-road' | 'expository-power' | 'messianic' | 'catechism'
  clozeWords: string[]
  historicalSignificance?: string
}

export const MEMORY_VERSE_DECKS: Record<string, { title: string; description: string; items: MemoryVerseItem[] }> = {
  'romans-road': {
    title: 'The Romans Road to Salvation',
    description: 'The classic Pauline path from universal human depravity to justification, peace, and eternal life in Christ.',
    items: [
      {
        id: 'rr-1',
        reference: 'Romans 3:23',
        text: 'For all have sinned and fall short of the glory of God.',
        topic: 'Universal Sinfulness',
        category: 'romans-road',
        clozeWords: ['sinned', 'short', 'glory', 'God']
      },
      {
        id: 'rr-2',
        reference: 'Romans 6:23',
        text: 'For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.',
        topic: 'The Wages vs. The Gift',
        category: 'romans-road',
        clozeWords: ['wages', 'death', 'gift', 'eternal', 'life']
      },
      {
        id: 'rr-3',
        reference: 'Romans 5:8',
        text: 'But God shows his love for us in that while we were still sinners, Christ died for us.',
        topic: 'Demonstration of Divine Love',
        category: 'romans-road',
        clozeWords: ['shows', 'love', 'sinners', 'died']
      },
      {
        id: 'rr-4',
        reference: 'Romans 10:9-10',
        text: 'Because, if you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved.',
        topic: 'Confession and Saving Faith',
        category: 'romans-road',
        clozeWords: ['confess', 'Lord', 'believe', 'raised', 'saved']
      },
      {
        id: 'rr-5',
        reference: 'Romans 8:1',
        text: 'There is therefore now no condemnation for those who are in Christ Jesus.',
        topic: 'Absolute Assurance of No Condemnation',
        category: 'romans-road',
        clozeWords: ['therefore', 'condemnation', 'Christ', 'Jesus']
      },
      {
        id: 'rr-6',
        reference: 'Romans 8:38-39',
        text: 'For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers, nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord.',
        topic: 'Inseparable Love of God',
        category: 'romans-road',
        clozeWords: ['death', 'life', 'angels', 'powers', 'separate', 'love']
      }
    ]
  },
  'expository-power': {
    title: 'Expository Power Verses',
    description: 'Foundational texts anchoring the Sola Scriptura, Sola Gratia, and Sola Fide doctrines.',
    items: [
      {
        id: 'ep-1',
        reference: 'Ephesians 2:8-9',
        text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.',
        topic: 'Grace Alone Through Faith Alone',
        category: 'expository-power',
        clozeWords: ['grace', 'saved', 'faith', 'gift', 'works', 'boast']
      },
      {
        id: 'ep-2',
        reference: '2 Timothy 3:16-17',
        text: 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness, that the man of God may be complete, equipped for every good work.',
        topic: 'Inspiration & Sufficiency of Scripture',
        category: 'expository-power',
        clozeWords: ['Scripture', 'breathed', 'profitable', 'teaching', 'righteousness', 'equipped']
      },
      {
        id: 'ep-3',
        reference: 'Galatians 2:20',
        text: 'I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me.',
        topic: 'Mystical Union with Christ',
        category: 'expository-power',
        clozeWords: ['crucified', 'Christ', 'live', 'faith', 'loved', 'gave']
      },
      {
        id: 'ep-4',
        reference: 'John 1:14',
        text: 'And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.',
        topic: 'The Incarnation & Tabernacling Presence',
        category: 'expository-power',
        clozeWords: ['Word', 'flesh', 'dwelt', 'glory', 'grace', 'truth']
      },
      {
        id: 'ep-5',
        reference: 'Hebrews 4:14-16',
        text: 'Since then we have a great high priest who has passed through the heavens, Jesus, the Son of God, let us hold fast our confession. Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need.',
        topic: 'The Sympathetic Great High Priest',
        category: 'expository-power',
        clozeWords: ['priest', 'confession', 'confidence', 'throne', 'grace', 'mercy']
      }
    ]
  },
  'messianic': {
    title: 'Messianic Prophecies & Fulfillments',
    description: 'Old Testament prophecies that shadow and promise the suffering and victorious Messiah.',
    items: [
      {
        id: 'mp-1',
        reference: 'Isaiah 53:4-5',
        text: 'Surely he has borne our griefs and carried our sorrows; yet we esteemed him stricken, smitten by God, and afflicted. But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.',
        topic: 'The Suffering Servant Substitution',
        category: 'messianic',
        clozeWords: ['borne', 'griefs', 'sorrows', 'pierced', 'transgressions', 'crushed', 'peace', 'wounds', 'healed']
      },
      {
        id: 'mp-2',
        reference: 'Genesis 3:15',
        text: 'I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel.',
        topic: 'The Protoevangelium (First Gospel Promise)',
        category: 'messianic',
        clozeWords: ['enmity', 'offspring', 'bruise', 'head', 'heel']
      },
      {
        id: 'mp-3',
        reference: 'Psalm 22:1',
        text: 'My God, my God, why have you forsaken me? Why are you so far from saving me, from the words of my groaning?',
        topic: 'The Cross in Prophecy',
        category: 'messianic',
        clozeWords: ['God', 'forsaken', 'saving', 'groaning']
      },
      {
        id: 'mp-4',
        reference: 'Micah 5:2',
        text: 'But you, O Bethlehem Ephrathah, who are too little to be among the clans of Judah, from you shall come forth for me one who is to be ruler in Israel, whose coming forth is from of old, from ancient days.',
        topic: 'The Eternal Ruler Born in Bethlehem',
        category: 'messianic',
        clozeWords: ['Bethlehem', 'Judah', 'ruler', 'ancient', 'days']
      }
    ]
  },
  'catechism': {
    title: 'Westminster Shorter Catechism Memory Deck',
    description: 'Historic theological questions and answers for bedrock Christian doctrine.',
    items: [
      {
        id: 'wsc-1',
        reference: 'WSC Q&A 1',
        text: 'Q: What is the chief end of man? A: Man’s chief end is to glorify God, and to enjoy him forever.',
        topic: 'The Chief End of Humanity',
        category: 'catechism',
        clozeWords: ['chief', 'end', 'glorify', 'God', 'enjoy', 'forever']
      },
      {
        id: 'wsc-2',
        reference: 'WSC Q&A 33',
        text: 'Q: What is justification? A: Justification is an act of God’s free grace, wherein he pardoneth all our sins, and accepteth us as righteous in his sight, only for the righteousness of Christ imputed to us, and received by faith alone.',
        topic: 'The Doctrine of Justification',
        category: 'catechism',
        clozeWords: ['justification', 'grace', 'pardoneth', 'righteous', 'imputed', 'faith']
      },
      {
        id: 'wsc-3',
        reference: 'WSC Q&A 21',
        text: 'Q: Who is the Redeemer of God’s elect? A: The only Redeemer of God’s elect is the Lord Jesus Christ, who, being the eternal Son of God, became man, and so was, and continueth to be, God and man in two distinct natures, and one person, forever.',
        topic: 'The Only Redeemer',
        category: 'catechism',
        clozeWords: ['Redeemer', 'elect', 'Jesus', 'Christ', 'natures', 'person', 'forever']
      }
    ]
  }
}

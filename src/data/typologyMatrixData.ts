// Typology Matrix Engine - Chiasms, Sacred Geography, & Messianic Prophecies

export interface ChiasmItem {
  level: string
  title: string
  reference: string
  text: string
  explanation: string
}

export interface ChiasmStructure {
  id: number
  title: string
  introduction: string
  centralFocus: string
  items: ChiasmItem[]
}

export interface SacredLocation {
  id: string
  name: string
  region: string
  typologicalMeaning: string
  historicalEvents: string[]
  fulfillmentInChrist: string
}

export interface MessianicProphecy {
  id: string
  category: string
  otPassage: string
  otText: string
  ntFulfillment: string
  ntText: string
  theologicalInsight: string
}

export const CHIASTM_STRUCTURES: ChiasmStructure[] = [
  {
    id: 1,
    title: 'The Symmetrical Noahic Flood Narrative',
    introduction: 'Genesis 6–9 is organized as one of the most magnificent chiasms in ancient literature, pivoting on God remembering His covenant.',
    centralFocus: 'Genesis 8:1 - "But God remembered Noah and all the beasts..." The absolute pivot of cosmic history.',
    items: [
      { level: 'A', title: 'Noah and his family are righteous', reference: 'Genesis 6:9-10', text: 'Noah was a righteous man...', explanation: 'The starting state of divine preservation.' },
      { level: 'B', title: 'God decrees cosmic destruction', reference: 'Genesis 6:11-13', text: 'I have determined to make an end of all flesh.', explanation: 'The undoing of creation order.' },
      { level: 'C', title: 'Command to build the Ark', reference: 'Genesis 6:14-22', text: 'Make yourself an ark of gopher wood.', explanation: 'Preservation vessel designed by God.' },
      { level: 'D', title: 'Entrance into Ark & Sealing', reference: 'Genesis 7:1-16', text: 'And the Lord shut him in.', explanation: 'Boundary of covenant grace.' },
      { level: 'E', title: 'Rising waters prevail', reference: 'Genesis 7:17-24', text: 'The waters prevailed 150 days.', explanation: 'Purification through judgment.' },
      { level: 'PIVOT', title: 'GOD REMEMBERS NOAH', reference: 'Genesis 8:1', text: 'But God remembered Noah.', explanation: 'The turning point of redemptive history!' },
      { level: 'E’', title: 'Waters recede & wind blows', reference: 'Genesis 8:2-5', text: 'The waters receded continually.', explanation: 'Re-creation begins.' },
      { level: 'D’', title: 'Sending forth raven & dove', reference: 'Genesis 8:6-12', text: 'He sent forth a dove to see if waters receded.', explanation: 'Testing the new world.' },
      { level: 'C’', title: 'Exit from the Ark', reference: 'Genesis 8:15-19', text: 'Go out from the ark.', explanation: 'Commissioning on dry land.' },
      { level: 'B’', title: 'Altar built & Covenant pledge', reference: 'Genesis 8:20-22', text: 'I will never again curse the ground.', explanation: 'Sacrificial pledge of stability.' },
      { level: 'A’', title: 'Covenant blessing with Noah', reference: 'Genesis 9:1-17', text: 'Be fruitful and multiply.', explanation: 'Renewal of the Edenic mandate.' }
    ]
  },
  {
    id: 2,
    title: 'The Moriah Sacrifice & Divine Substitution',
    introduction: 'Genesis 22 presents Abraham’s testing arranged in a chiastic structure centering on God providing the lamb.',
    centralFocus: 'Genesis 22:8 - "God will provide for himself the lamb for a burnt offering, my son."',
    items: [
      { level: 'A', title: 'Call to offer Isaac', reference: 'Genesis 22:1-2', text: 'Take your son, your only son Isaac...', explanation: 'The ultimate covenant test.' },
      { level: 'B', title: 'Journey to Moriah', reference: 'Genesis 22:3-4', text: 'On the third day Abraham lifted up his eyes.', explanation: 'Three days under sentence of death.' },
      { level: 'C', title: 'Isaac carries the wood', reference: 'Genesis 22:5-6', text: 'Isaac carried the wood of the burnt offering.', explanation: 'Prefiguring Christ carrying His cross.' },
      { level: 'PIVOT', title: 'GOD WILL PROVIDE THE LAMB', reference: 'Genesis 22:7-8', text: 'God will provide for himself the lamb.', explanation: 'The central typological prophecy!' },
      { level: 'C’', title: 'Isaac bound upon the altar', reference: 'Genesis 22:9-10', text: 'He bound Isaac and laid him on the altar.', explanation: 'Submission to divine sacrifice.' },
      { level: 'B’', title: 'Angel intervenes & Ram caught', reference: 'Genesis 22:11-13', text: 'Behold, a ram caught in a thicket by his horns.', explanation: 'Substitutionary atonement.' },
      { level: 'A’', title: 'Sworn oath of universal blessing', reference: 'Genesis 22:15-18', text: 'In your offspring shall all nations be blessed.', explanation: 'Unconditional covenant oath.' }
    ]
  }
]

export const SACRED_LOCATIONS: SacredLocation[] = [
  {
    id: 'moriah',
    name: 'Mount Moriah',
    region: 'Jerusalem',
    typologicalMeaning: 'The Mount of Sacrifice and Divine Substitution.',
    historicalEvents: [
      'Abraham offers Isaac (Genesis 22)',
      'David buys threshing floor of Ornan (1 Chronicles 21)',
      'Solomon builds the First Temple (2 Chronicles 3:1)'
    ],
    fulfillmentInChrist: 'Jesus offered on Golgotha (adjacent peak of Moriah ridge) as the ultimate substitute Lamb.'
  },
  {
    id: 'sinai',
    name: 'Mount Sinai / Horeb',
    region: 'Arabian Wilderness',
    typologicalMeaning: 'The Mount of Law, Glory, & Divine Covenant.',
    historicalEvents: [
      'Burning Bush encounter with Moses (Exodus 3)',
      'Giving of the Ten Commandments (Exodus 19-20)',
      'Elijah hears the still small voice (1 Kings 19)'
    ],
    fulfillmentInChrist: 'Christ preaches the Sermon on the Mount, fulfilling the Law and writing it on human hearts.'
  },
  {
    id: 'zion',
    name: 'Mount Zion',
    region: 'Jerusalem',
    typologicalMeaning: 'The City of the Great King & Eternal Dwelling of God.',
    historicalEvents: [
      'David conquers Jebusite fortress (2 Samuel 5)',
      'Ark of the Covenant brought with dancing (2 Samuel 6)',
      'Prophetic promises of future temple glory'
    ],
    fulfillmentInChrist: 'Believers come to the heavenly Mount Zion, the New Jerusalem (Hebrews 12:22, Rev 21).'
  }
]

export const MESSIANIC_PROPHECIES: MessianicProphecy[] = [
  {
    id: 'virgin-birth',
    category: 'Incarnation',
    otPassage: 'Isaiah 7:14',
    otText: 'Behold, the virgin shall conceive and bear a son, and shall call his name Immanuel.',
    ntFulfillment: 'Matthew 1:22-23',
    ntText: 'All this took place to fulfill what the Lord had spoken... "Behold, the virgin shall be with child."',
    theologicalInsight: 'Jesus is God with us, conceived by the Holy Spirit without human seed.'
  },
  {
    id: 'suffering-servant',
    category: 'Atonement',
    otPassage: 'Isaiah 53:5',
    otText: 'He was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace.',
    ntFulfillment: '1 Peter 2:24',
    ntText: 'He himself bore our sins in his body on the tree, that we might die to sin and live to righteousness.',
    theologicalInsight: 'Substitutionary atonement where Christ bears the curse of the law in our place.'
  },
  {
    id: 'resurrection-third-day',
    category: 'Resurrection',
    otPassage: 'Psalm 16:10 / Jonah 1:17',
    otText: 'For you will not abandon my soul to Sheol, or let your holy one see corruption.',
    ntFulfillment: 'Acts 2:31 / Matthew 12:40',
    ntText: 'He foresaw and spoke about the resurrection of the Christ, that he was not abandoned to Hades.',
    theologicalInsight: 'Christ’s bodily resurrection confirms His victory over death and sin.'
  }
]

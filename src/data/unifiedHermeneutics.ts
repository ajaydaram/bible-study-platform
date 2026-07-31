// Unified Hermeneutics Data Mapper
// Connects Chronological Eras, Redemptive Epochs, and Typological Themes into a single unified triad.

export interface UnifiedTriad {
  reference: string
  chronologicalEra: {
    name: string
    timeline: string
    dayNumber?: number
  }
  redemptiveEpoch: {
    id: string
    number: number
    title: string
    covenant: string
    icon: string
  }
  typologicalTheme: {
    themeTitle: string
    typeShadow: string
    antitypeFulfillment: string
  }
}

export const UNIFIED_TRIAD_DATABASE: Record<string, UnifiedTriad> = {
  'Genesis 1-3': {
    reference: 'Genesis 1-3',
    chronologicalEra: {
      name: 'Creation & Eden',
      timeline: 'In the Beginning (~4000 BC)',
      dayNumber: 1
    },
    redemptiveEpoch: {
      id: 'pre-fall',
      number: 1,
      title: 'Pre-Fall Edenic Revelation',
      covenant: 'Covenant of Works (Creation)',
      icon: '🌿'
    },
    typologicalTheme: {
      themeTitle: 'The Tree of Life & First Adam',
      typeShadow: 'Adam as the first federal head in Eden; Tree of Life in Paradise.',
      antitypeFulfillment: 'Christ as the Last Adam; the Cross as the eternal Tree of Life in the New Jerusalem.'
    }
  },
  'Genesis 22': {
    reference: 'Genesis 22',
    chronologicalEra: {
      name: 'Patriarchal Era',
      timeline: '~2000 - 1800 BC',
      dayNumber: 22
    },
    redemptiveEpoch: {
      id: 'patriarchal',
      number: 2,
      title: 'Patriarchal Epoch',
      covenant: 'Abrahamic Covenant of Promise',
      icon: '⛺'
    },
    typologicalTheme: {
      themeTitle: 'Sacrifice on Mount Moriah',
      typeShadow: 'Isaac carrying wood up Mount Moriah; ram provided by God as a substitute.',
      antitypeFulfillment: 'God the Father offering His only Son Jesus carrying His cross on Calvary.'
    }
  },
  'Exodus 12': {
    reference: 'Exodus 12',
    chronologicalEra: {
      name: 'Exodus & Wilderness',
      timeline: '~1446 BC',
      dayNumber: 50
    },
    redemptiveEpoch: {
      id: 'mosaic',
      number: 3,
      title: 'Mosaic & Theocratic Epoch',
      covenant: 'Mosaic Covenant of Law & Tabernacle',
      icon: '📜'
    },
    typologicalTheme: {
      themeTitle: 'The Passover Lamb',
      typeShadow: 'Spotless lamb slain in Egypt; blood applied to doorposts to avert judgment.',
      antitypeFulfillment: 'Christ our Passover Lamb slain for the sins of the world (John 1:29, 1 Cor 5:7).'
    }
  },
  '2 Samuel 7': {
    reference: '2 Samuel 7',
    chronologicalEra: {
      name: 'United Kingdom (David)',
      timeline: '~1000 BC',
      dayNumber: 140
    },
    redemptiveEpoch: {
      id: 'prophetic',
      number: 4,
      title: 'Prophetic & Monarchical Epoch',
      covenant: 'Davidic Covenant of Kingdom',
      icon: '👑'
    },
    typologicalTheme: {
      themeTitle: 'The Davidic King & Eternal Throne',
      typeShadow: 'King David and Solomon building God an earthly house.',
      antitypeFulfillment: 'Jesus the Son of David sitting on an everlasting throne in the heavenly Jerusalem.'
    }
  },
  'Matthew 1': {
    reference: 'Matthew 1-4',
    chronologicalEra: {
      name: 'Messianic Realization',
      timeline: '1 AD - 33 AD',
      dayNumber: 274
    },
    redemptiveEpoch: {
      id: 'messianic',
      number: 5,
      title: 'Messianic Realization & Kingdom',
      covenant: 'New Covenant in Christ’s Blood',
      icon: '✝️'
    },
    typologicalTheme: {
      themeTitle: 'Fulfillment of All Shadows',
      typeShadow: 'Old Testament sacrifices, priesthood, tabernacle, and kingdom.',
      antitypeFulfillment: 'Christ as High Priest, True Temple, King of Kings, and Eternal Sabbath Rest.'
    }
  }
}

// Fallback generator for passages
export function getUnifiedHermeneutics(keyOrReference: string): UnifiedTriad {
  const match = Object.keys(UNIFIED_TRIAD_DATABASE).find((k) =>
    keyOrReference.toLowerCase().includes(k.toLowerCase())
  )

  if (match) {
    return UNIFIED_TRIAD_DATABASE[match]
  }

  // Generic intelligent fallback based on book name or day
  return {
    reference: keyOrReference || 'Scripture Passage',
    chronologicalEra: {
      name: 'Biblical History',
      timeline: 'Genesis to Revelation',
      dayNumber: 1
    },
    redemptiveEpoch: {
      id: 'messianic',
      number: 5,
      title: 'Messianic Realization',
      covenant: 'New Covenant',
      icon: '✝️'
    },
    typologicalTheme: {
      themeTitle: 'Redemptive Unity in Christ',
      typeShadow: 'Old Testament Types and Promises',
      antitypeFulfillment: 'Fulfilled in Jesus Christ'
    }
  }
}

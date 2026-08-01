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

// Intelligent mapper for any reference or passage string
export function getUnifiedHermeneutics(keyOrReference: string): UnifiedTriad {
  const ref = keyOrReference.toLowerCase()

  // 1. Direct or partial key match
  const matchKey = Object.keys(UNIFIED_TRIAD_DATABASE).find((k) =>
    ref.includes(k.toLowerCase()) || k.toLowerCase().includes(ref.split(' ')[0] || '')
  )

  if (matchKey) {
    return UNIFIED_TRIAD_DATABASE[matchKey]
  }

  // 2. Creation / Edenic (Genesis 1-11)
  if (ref.includes('genesis 1') || ref.includes('genesis 2') || ref.includes('genesis 3') || ref.includes('genesis 4') || ref.includes('genesis 5') || ref.includes('genesis 6') || ref.includes('genesis 7') || ref.includes('genesis 8') || ref.includes('genesis 9') || ref.includes('genesis 10') || ref.includes('genesis 11')) {
    return UNIFIED_TRIAD_DATABASE['Genesis 1-3']
  }

  // 3. Patriarchal (Genesis 12-50)
  if (ref.includes('genesis')) {
    return UNIFIED_TRIAD_DATABASE['Genesis 22']
  }

  // 4. Mosaic & Tabernacle (Exodus, Leviticus, Numbers, Deuteronomy)
  if (ref.includes('exodus') || ref.includes('leviticus') || ref.includes('numbers') || ref.includes('deuteronomy')) {
    return UNIFIED_TRIAD_DATABASE['Exodus 12']
  }

  // 5. Kingdom & Monarchical (Joshua, Judges, Ruth, Samuel, Kings, Chronicles)
  if (ref.includes('samuel') || ref.includes('kings') || ref.includes('chronicles') || ref.includes('joshua') || ref.includes('judges') || ref.includes('david') || ref.includes('psalm')) {
    return UNIFIED_TRIAD_DATABASE['2 Samuel 7']
  }

  // 6. Messianic Realization (Gospels & NT)
  return UNIFIED_TRIAD_DATABASE['Matthew 1']
}

export interface RedemptiveEpochInfo {
  id: string
  title: string
  covenantTitle: string
  icon: string
  badgeColor: string
}

export const EPOCH_INFO_MAP: Record<string, RedemptiveEpochInfo> = {
  'pre-fall': {
    id: 'pre-fall',
    title: 'Pre-Fall & Edenic Revelation',
    covenantTitle: 'Covenant of Works / Edenic Order',
    icon: '🌿',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
  },
  patriarchal: {
    id: 'patriarchal',
    title: 'Patriarchal Era',
    covenantTitle: 'Covenant of Promise (Abrahamic)',
    icon: '⛺',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
  },
  mosaic: {
    id: 'mosaic',
    title: 'Mosaic Era',
    covenantTitle: 'Mosaic Legal & Tabernacle Administration',
    icon: '📜',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
  },
  prophetic: {
    id: 'prophetic',
    title: 'Prophetic & Monarchical Era',
    covenantTitle: 'Davidic Kingdom & New Covenant Promise',
    icon: '👑',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30'
  },
  messianic: {
    id: 'messianic',
    title: 'Messianic Realization',
    covenantTitle: 'New Covenant Realization in Christ',
    icon: '☀️',
    badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
  }
}

export function getEpochForPerson(personName: string): RedemptiveEpochInfo {
  const name = personName.trim().toLowerCase()

  // Pre-Fall
  if (['adam', 'eve'].includes(name)) {
    return EPOCH_INFO_MAP['pre-fall']
  }

  // Patriarchal (Job, Noah, Abraham, Isaac, Jacob, Joseph, Sarah, Rebekah, Melchizedek, etc.)
  if (
    [
      'abraham',
      'sarah',
      'isaac',
      'jacob',
      'joseph',
      'melchizedek',
      'noah',
      'job',
      'lot',
      'rebekah',
      'rachel',
      'leah',
      'ishmael',
      'esau',
      'judah'
    ].includes(name)
  ) {
    return EPOCH_INFO_MAP['patriarchal']
  }

  // Mosaic Era (Moses, Aaron, Miriam, Joshua, Caleb, Gideon, Samson, Ruth, Samuel, etc.)
  if (
    [
      'moses',
      'aaron',
      'miriam',
      'joshua',
      'caleb',
      'rahab',
      'gideon',
      'samson',
      'ruth',
      'samuel',
      'eli',
      'boaz',
      'deborah',
      'barak'
    ].includes(name)
  ) {
    return EPOCH_INFO_MAP['mosaic']
  }

  // Prophetic & Monarchical (David, Solomon, Isaiah, Jeremiah, Ezekiel, Daniel, Elijah, Elisha, Hezekiah, Josiah, Malachi, etc.)
  if (
    [
      'david',
      'solomon',
      'saul',
      'isaiah',
      'jeremiah',
      'ezekiel',
      'daniel',
      'elijah',
      'elisha',
      'hezekiah',
      'josiah',
      'malachi',
      'zechariah',
      'hosea',
      'amos',
      'jonah',
      'nehemiah',
      'ezra',
      'esther'
    ].includes(name)
  ) {
    return EPOCH_INFO_MAP['prophetic']
  }

  // Messianic Realization (Jesus, Mary, Joseph, Peter, Paul, John, James, Stephen, Luke, Mark, Matthew, etc.)
  if (
    [
      'jesus',
      'christ',
      'mary',
      'peter',
      'paul',
      'john',
      'james',
      'stephen',
      'luke',
      'mark',
      'matthew',
      'thomas',
      'andrew',
      'philip',
      'barnabas',
      'timothy',
      'titus',
      'john the baptist'
    ].includes(name)
  ) {
    return EPOCH_INFO_MAP['messianic']
  }

  // Default fallback based on alphabetical heuristic or patriarchal
  return EPOCH_INFO_MAP['patriarchal']
}

export function getEpochForTimelineEvent(year: number | null, title: string = ''): RedemptiveEpochInfo {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('creation') || lowerTitle.includes('eden') || lowerTitle.includes('fall of man')) {
    return EPOCH_INFO_MAP['pre-fall']
  }

  if (year === null) {
    if (lowerTitle.includes('abraham') || lowerTitle.includes('flood') || lowerTitle.includes('babel')) {
      return EPOCH_INFO_MAP['patriarchal']
    }
    if (lowerTitle.includes('cross') || lowerTitle.includes('resurrection') || lowerTitle.includes('church')) {
      return EPOCH_INFO_MAP['messianic']
    }
    return EPOCH_INFO_MAP['mosaic']
  }

  // Timeline year mapping (BCE is negative)
  if (year <= -4000) {
    return EPOCH_INFO_MAP['pre-fall']
  }
  if (year > -4000 && year <= -1450) {
    return EPOCH_INFO_MAP['patriarchal']
  }
  if (year > -1450 && year <= -1000) {
    return EPOCH_INFO_MAP['mosaic']
  }
  if (year > -1000 && year < 4) {
    return EPOCH_INFO_MAP['prophetic']
  }

  return EPOCH_INFO_MAP['messianic']
}

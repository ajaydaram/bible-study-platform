export interface ResponseOption {
  id: string
  type: 'reflection' | 'prayer' | 'obedience'
  label: string
  promptText: string
  placeholder: string
}

export interface CallAndResponseItem {
  targetEpochId: string
  targetEpochTitle: string
  callTitle: string
  callScripture: string
  callPassage: string
  callTheologicalInsight: string
  responseOptions: ResponseOption[]
}

export const callAndResponseData: Record<string, CallAndResponseItem> = {
  'patriarchal': {
    targetEpochId: 'patriarchal',
    targetEpochTitle: 'Patriarchal Era',
    callTitle: 'The Call of Abram & The Promise of the Seed',
    callScripture: 'Genesis 12:1-3 & Genesis 15:5-6',
    callPassage: 'God commands Abram: "Go from your country... to the land I will show you. I will make of you a great nation... and in you all the families of the earth shall be blessed." Abraham believed the LORD, and He counted it to him as righteousness.',
    callTheologicalInsight: 'Geerhardus Vos observed that election in the Patriarchal era is not a reward for merit, but the sovereign introduction of unmerited grace into a world dead in sin. Faith is pilgrim trust in the God of promise.',
    responseOptions: [
      {
        id: 'abram-reflection',
        type: 'reflection',
        label: 'Draft a Reflective Journal Entry',
        promptText: 'What is one area of your life where God is calling you to step out in pilgrim faith, relying on His promise rather than visible security?',
        placeholder: 'Reflect on stepping out in pilgrim faith...'
      },
      {
        id: 'abram-prayer',
        type: 'prayer',
        label: 'Submit a Guided Prayer of Trust',
        promptText: 'Draft a prayer yielding your future, your plans, and your legacy to the God of Abraham.',
        placeholder: 'Lord, as Abraham trusted Your promise...'
      },
      {
        id: 'abram-obedience',
        type: 'obedience',
        label: 'Log an Act of Pilgrim Obedience',
        promptText: 'Describe one concrete action you will take today to demonstrate that your true citizenship is in God’s kingdom.',
        placeholder: 'Today I will obey God by...'
      }
    ]
  },
  'mosaic': {
    targetEpochId: 'mosaic',
    targetEpochTitle: 'Mosaic & Kingdom Era',
    callTitle: 'The Passover Lamb & Mount Sinai Tabernacle',
    callScripture: 'Exodus 12:12-13 & Exodus 25:8-9',
    callPassage: 'The blood of the unblemished lamb shields Israel from judgment; God brings His people out on eagle wings and gives them the pattern of the Holy Tabernacle so He may dwell in their midst.',
    callTheologicalInsight: 'The Mosaic economy introduces the pedagogical types of sacrificial atonement and sanctuary presence. The earthly tabernacle was a copy showing that sinful man can only approach God through blood and mediation.',
    responseOptions: [
      {
        id: 'mosaic-reflection',
        type: 'reflection',
        label: 'Draft a Reflective Journal Entry',
        promptText: 'How does knowing that Christ is your true Passover Lamb change how you respond to guilt and Satan’s accusations today?',
        placeholder: 'Knowing Christ’s blood covers me...'
      },
      {
        id: 'mosaic-prayer',
        type: 'prayer',
        label: 'Submit a Guided Prayer of Thanksgiving',
        promptText: 'Offer a prayer praising God for tearing the veil through Christ and making your heart His Holy Sanctuary.',
        placeholder: 'Father, thank You that the veil is torn...'
      },
      {
        id: 'mosaic-obedience',
        type: 'obedience',
        label: 'Log an Act of Sanctuary Purity',
        promptText: 'Log one intentional step you will take today to honor the Holy Spirit’s dwelling within your body and home.',
        placeholder: 'To honor Your sanctuary presence, I will...'
      }
    ]
  },
  'prophetic': {
    targetEpochId: 'prophetic',
    targetEpochTitle: 'Prophetic Era',
    callTitle: 'The Suffering Servant & The New Covenant',
    callScripture: 'Isaiah 53:4-6 & Jeremiah 31:31-34',
    callPassage: 'Surrounded by Israel’s covenant failure, the prophets foresee One who will be wounded for our transgressions, and a New Covenant written directly upon human hearts.',
    callTheologicalInsight: 'Prophecy projects redemptive history onto the eschatological horizon, revealing that true heart transformation and divine forgiveness cannot be achieved by legal works, but by the Servant’s self-offering.',
    responseOptions: [
      {
        id: 'prophetic-reflection',
        type: 'reflection',
        label: 'Draft a Reflective Journal Entry',
        promptText: 'In what ways do you still try to earn God’s favor through legalistic effort rather than resting in the New Covenant written on your heart?',
        placeholder: 'I recognize my tendency to self-justify in...'
      },
      {
        id: 'prophetic-prayer',
        type: 'prayer',
        label: 'Submit a Guided Prayer for Heart Transformation',
        promptText: 'Ask the Holy Spirit to deeply etch God’s law of love onto your heart today.',
        placeholder: 'Holy Spirit, write Your law upon my heart...'
      },
      {
        id: 'prophetic-obedience',
        type: 'obedience',
        label: 'Log an Act of Servant Love',
        promptText: 'Log an act of self-giving servant ministry to someone in need today, following the Servant of the Lord.',
        placeholder: 'I will serve my neighbor by...'
      }
    ]
  },
  'messianic': {
    targetEpochId: 'messianic',
    targetEpochTitle: 'Messianic Realization',
    callTitle: 'The Word Made Flesh & Resurrection Firstfruits',
    callScripture: 'John 1:14 & 1 Corinthians 15:20-23',
    callPassage: 'The Word became flesh and tabernacled among us! Christ has been raised from the dead, the firstfruits of those who have fallen asleep—inaugurating the Age to Come in our midst.',
    callTheologicalInsight: 'The climax of revelation! In Christ’s resurrection, the heavenly future has broken into the present age. We live as citizens of the resurrected New Creation while waiting for the final consummation.',
    responseOptions: [
      {
        id: 'messianic-reflection',
        type: 'reflection',
        label: 'Draft a Reflective Journal Entry',
        promptText: 'How does the reality that Christ’s resurrection has already inaugurated the New Creation change your perspective on earthly death, suffering, and work?',
        placeholder: 'Because Christ is risen...'
      },
      {
        id: 'messianic-prayer',
        type: 'prayer',
        label: 'Submit a Guided Prayer of Kingdom Praise',
        promptText: 'Worship King Jesus as the Risen Lord of all creation.',
        placeholder: 'Lord Jesus, Risen Savior and King...'
      },
      {
        id: 'messianic-obedience',
        type: 'obedience',
        label: 'Log an Act of Age-to-Come Citizenship',
        promptText: 'Log one decision you will make today that reflects heavenly resurrection hope rather than worldly fear.',
        placeholder: 'In light of resurrection hope, I will...'
      }
    ]
  }
}

// Local Storage helpers for Call & Response progress
const LOCAL_STORAGE_PROGRESS_KEY = 'scriptorium_epoch_progress_v2'
const LOCAL_STORAGE_RESPONSES_KEY = 'scriptorium_epoch_responses_v2'

export interface UserEpochProgress {
  unlockedEpochIds: string[]
  completedResponseEpochIds: string[]
  pauseTimestamps: Record<string, number> // epochId -> timestamp when pause starts
}

export function getUserEpochProgress(): UserEpochProgress {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error reading epoch progress:', e)
  }
  // Default: Pre-Fall unlocked
  return {
    unlockedEpochIds: ['pre-fall'],
    completedResponseEpochIds: [],
    pauseTimestamps: {}
  }
}

export function saveUserEpochProgress(progress: UserEpochProgress) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(progress))
  } catch (e) {
    console.error('Error saving epoch progress:', e)
  }
}

export function isEpochUnlocked(epochId: string): boolean {
  if (epochId === 'pre-fall') return true
  const progress = getUserEpochProgress()
  return progress.unlockedEpochIds.includes(epochId)
}

export function isPauseActive(epochId: string, hours: number = 24): { active: boolean; remainingSeconds: number } {
  const progress = getUserEpochProgress()
  const startMs = progress.pauseTimestamps[epochId]
  if (!startMs) return { active: false, remainingSeconds: 0 }
  
  const elapsedMs = Date.now() - startMs
  const durationMs = hours * 60 * 60 * 1000
  if (elapsedMs < durationMs) {
    return {
      active: true,
      remainingSeconds: Math.ceil((durationMs - elapsedMs) / 1000)
    }
  }
  return { active: false, remainingSeconds: 0 }
}

export function submitEpochResponse(
  targetEpochId: string,
  responseOptionId: string,
  responseText: string
) {
  const progress = getUserEpochProgress()
  
  if (!progress.completedResponseEpochIds.includes(targetEpochId)) {
    progress.completedResponseEpochIds.push(targetEpochId)
  }
  
  // Set pause timestamp for digestion
  progress.pauseTimestamps[targetEpochId] = Date.now()
  
  // Unlock target epoch
  if (!progress.unlockedEpochIds.includes(targetEpochId)) {
    progress.unlockedEpochIds.push(targetEpochId)
  }

  saveUserEpochProgress(progress)

  // Save response text
  try {
    const savedResponses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESPONSES_KEY) || '{}')
    savedResponses[targetEpochId] = {
      responseOptionId,
      responseText,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem(LOCAL_STORAGE_RESPONSES_KEY, JSON.stringify(savedResponses))
  } catch (e) {
    console.error('Error saving response text:', e)
  }
}

export function bypassPauseForStudy(targetEpochId: string) {
  const progress = getUserEpochProgress()
  delete progress.pauseTimestamps[targetEpochId]
  if (!progress.unlockedEpochIds.includes(targetEpochId)) {
    progress.unlockedEpochIds.push(targetEpochId)
  }
  saveUserEpochProgress(progress)
}

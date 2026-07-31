// Sacred Homiletical Rhetoric Dataset
// Integrates Aristotle, Cicero, Augustine, Bryan Chapell (FCF), and Pauline Diatribe

export interface RhetoricCanon {
  id: string
  name: string
  latinName: string
  description: string
  preacherChecklist: string[]
  sampleApplication: string
}

export interface AugustinianPrinciple {
  id: string
  title: string
  phase: 'Modus Inveniendi' | 'Modus Proferendi'
  principle: string
  biblicalQuote: string
  homileticalGuidance: string
}

export interface FcfFramework {
  fcfDefinition: string
  threeQuestions: { question: string; explanation: string }[]
  redemptiveStructure: { stage: string; focus: string; description: string }[]
}

export interface PaulineDiatribeDevice {
  device: string
  greekTerm: string
  definition: string
  biblicalExample: string
  homileticalUse: string
}

export const ARISTOTELIAN_TRIAD = [
  {
    mode: 'Logos',
    title: 'Exegetical Clarity & Logical Argument',
    description: 'The rational force of Scripture truth, sound exegesis, and coherent sermon structure.',
    keyQuestion: 'Is the biblical text accurately interpreted and logically presented?'
  },
  {
    mode: 'Ethos',
    title: 'Preacher’s Character & Pastoral Integrity',
    description: 'The moral credibility and genuine spiritual authority of the preacher living out the Word.',
    keyQuestion: 'Does the preacher embody the humility and holiness of Christ?'
  },
  {
    mode: 'Pathos',
    title: 'Holy Affection & Heart Engagement',
    description: 'The Spirit-empowered emotional resonance that moves hearers to repentance and joy.',
    keyQuestion: 'Does the sermon ignite holy affections and deep love for God?'
  }
]

export const CICERO_CANONS: RhetoricCanon[] = [
  {
    id: 'inventio',
    name: 'Invention',
    latinName: 'Inventio',
    description: 'Finding and gathering valid exegetical arguments, biblical proofs, and theological truths from the text.',
    preacherChecklist: [
      'Have I extracted the central Big Idea from the text?',
      'What Old/New Testament cross-references support this point?',
      'What redemptive-historical covenant context is active?'
    ],
    sampleApplication: 'Exegetical study, Hebrew/Greek word studies, and consulting solid commentaries.'
  },
  {
    id: 'dispositio',
    name: 'Arrangement',
    latinName: 'Dispositio',
    description: 'Ordering the sermon points logically and persuasively for maximum listener clarity.',
    preacherChecklist: [
      'Is the sermon outline natural to the text’s flow?',
      'Does the introduction arrest attention and state the Fallen Condition Focus?',
      'Is there a clear climax pointing to the cross of Christ?'
    ],
    sampleApplication: 'Crafting Exordium, Exposition, FCF Application, and Peroration (Conclusion).'
  },
  {
    id: 'elocutio',
    name: 'Style',
    latinName: 'Elocutio',
    description: 'Selecting vivid, memorable, and biblically reverent language.',
    preacherChecklist: [
      'Am I using clear, vivid metaphors rather than dry jargon?',
      'Does my tone match the mood of the biblical text (lament vs. praise)?',
      'Are transitions seamless between points?'
    ],
    sampleApplication: 'Using figures of speech, illustrations, and plain gospel speech.'
  },
  {
    id: 'memoria',
    name: 'Memory & Internalization',
    latinName: 'Memoria',
    description: 'Internalizing the sermon flow so thoroughly that preaching flows naturally from the heart.',
    preacherChecklist: [
      'Do I know my sermon structure without staring at manuscript notes?',
      'Have I prayed the message into my own soul first?',
      'Can I maintain warm eye contact with the congregation?'
    ],
    sampleApplication: 'Internalizing main points, transitions, and key Scripture quotations.'
  },
  {
    id: 'pronuntiatio',
    name: 'Delivery',
    latinName: 'Pronuntiatio / Actio',
    description: 'Vocal modulation, cadence, facial expression, and bodily posture in preaching.',
    preacherChecklist: [
      'Is my voice clear, varied, and appropriate in volume?',
      'Do my gestures reinforce the message without distracting?',
      'Am I speaking with earnestness, solemnity, and joy?'
    ],
    sampleApplication: 'Pacing, pauses after heavy truths, and natural vocal passion.'
  }
]

export const AUGUSTINE_PRINCIPLES: AugustinianPrinciple[] = [
  {
    id: 'inveniendi',
    title: 'The Mode of Discovery',
    phase: 'Modus Inveniendi',
    principle: 'Understanding what is to be understood from Holy Scripture.',
    biblicalQuote: '2 Timothy 2:15 - "Do your best to present yourself to God as one approved..."',
    homileticalGuidance: 'The preacher must be a humble student of Scripture before becoming a teacher, using faith and prayer to illuminate obscure passages.'
  },
  {
    id: 'proferendi',
    title: 'The Mode of Expression',
    phase: 'Modus Proferendi',
    principle: 'Expressing what has been understood so that others may believe and obey.',
    biblicalQuote: 'Colossians 4:4 - "That I may make it clear, which is how I ought to speak."',
    homileticalGuidance: 'The Christian orator aims to teach (docere), to delight (delectare), and to persuade (flectere).'
  }
]

export const CHAPELL_FCF_FRAMEWORK: FcfFramework = {
  fcfDefinition: 'The Fallen Condition Focus (FCF) is the mutual human sin, weakness, or brokenness that the text addresses and that requires God’s redemptive grace.',
  threeQuestions: [
    {
      question: '1. What does the text say?',
      explanation: 'Exposition: Establishing the historical and grammatical meaning of the passage.'
    },
    {
      question: '2. What concern does the text address?',
      explanation: 'FCF Identification: Pinpointing the human weakness, guilt, or fallen condition the passage targets.'
    },
    {
      question: '3. How does God solve it through Christ?',
      explanation: 'Redemptive Resolution: Showing how divine grace in Christ remedies the Fallen Condition.'
    }
  ],
  redemptiveStructure: [
    { stage: 'Textual Observation', focus: 'Original Hearers', description: 'What problem were the original recipients facing under law or trial?' },
    { stage: 'Universal Human FCF', focus: 'Contemporary Hearers', description: 'How does that same fallen condition manifest in our lives today?' },
    { stage: 'Grace Solution in Christ', focus: 'Gospel Redemption', description: 'How does Christ’s person, work, or spirit solve what we cannot fix?' },
    { stage: 'Kingdom Application', focus: 'Obedience of Faith', description: 'How do we now live in gratitude and holiness empowered by grace?' }
  ]
}

export const PAULINE_DIATRIBE_DEVICES: PaulineDiatribeDevice[] = [
  {
    device: 'Objection & Rebuttal',
    greekTerm: 'Me Genoito (Μὴ γένοιτο)',
    definition: 'Raising a hypothetical opponent’s objection and forcefully rejecting it ("By no means!").',
    biblicalExample: 'Romans 6:1-2 - "Shall we go on sinning so that grace may increase? By no means!"',
    homileticalUse: 'Anticipate modern skeptical objections in the sermon and answer them with apostolic authority.'
  },
  {
    device: 'Rhetorical Question',
    greekTerm: 'Erotesis (Ἐρώτησις)',
    definition: 'Asking questions not for information, but to force the listener’s conscience to assent.',
    biblicalExample: 'Romans 8:31 - "If God is for us, who can be against us?"',
    homileticalUse: 'Drive listeners to self-examination and confident faith.'
  }
]

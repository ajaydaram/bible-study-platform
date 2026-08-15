/**
 * Biblical Typology & Prophecy Network Dataset
 * Old Testament Shadows & Types radiating to New Testament Fulfillments in Christ
 */

export interface TypologyNode {
  id: string
  otType: string
  otPassage: string
  category: 'Sacrificial & Temple' | 'Prophetic Figures' | 'Covenantal Frameworks' | 'Redemptive Events'
  ntFulfillment: string
  ntPassage: string
  theologicalConnection: string
  hermeneuticalSignificance: string
}

export const TYPOLOGY_NETWORK_DATA: TypologyNode[] = [
  // 1. Sacrificial & Temple
  {
    id: 'typ-1',
    otType: 'The Passover Lamb',
    otPassage: 'Exodus 12:1-13',
    category: 'Sacrificial & Temple',
    ntFulfillment: 'Christ, Our Passover Lamb Slain',
    ntPassage: '1 Corinthians 5:7; John 1:29; 1 Peter 1:19',
    theologicalConnection: 'An unblemished male lamb whose blood shielded from divine judgment, eaten with unleavened bread, fulfilling Christ’s substitutionary blood on the cross.',
    hermeneuticalSignificance: 'Typifies propitiation, substitution, and liberation from spiritual slavery.'
  },
  {
    id: 'typ-2',
    otType: 'The Day of Atonement (Yom Kippur Scapegoat)',
    otPassage: 'Leviticus 16:1-34',
    category: 'Sacrificial & Temple',
    ntFulfillment: 'The Perfect Sacrifice & Great High Priest Entering the Holy Place',
    ntPassage: 'Hebrews 9:11-14, 10:1-14',
    theologicalConnection: 'One goat sacrificed for blood cleansing; the scapegoat carrying sins into the wilderness, prefiguring expiation and complete sin-removal in Christ.',
    hermeneuticalSignificance: 'Demonstrates dual aspects of atonement: blood propitiation and complete remission of guilt.'
  },
  {
    id: 'typ-3',
    otType: 'The Bronze Serpent on the Pole',
    otPassage: 'Numbers 21:4-9',
    category: 'Sacrificial & Temple',
    ntFulfillment: 'The Son of Man Lifted Up on the Cross',
    ntPassage: 'John 3:14-15; 2 Corinthians 5:21',
    theologicalConnection: 'God provided life for dying Israel by looking in faith upon the emblem of the curse made harmless, directly foreshadowing Christ made sin for us.',
    hermeneuticalSignificance: 'Typology of salvation through faith alone by looking upon the crucified Redeemer.'
  },
  {
    id: 'typ-4',
    otType: 'The Wilderness Manna & Water from the Rock',
    otPassage: 'Exodus 16:1-36; 17:1-7',
    category: 'Sacrificial & Temple',
    ntFulfillment: 'Christ the Living Bread & Smitten Rock of Living Waters',
    ntPassage: 'John 6:35, 48-51; 1 Corinthians 10:4',
    theologicalConnection: 'Bread rained from heaven and the smitten rock releasing living water in the desert prefigure Christ sustaining believers through the spiritual wilderness.',
    hermeneuticalSignificance: 'Sacramental anticipation of Christ’s body and blood sustaining the new covenant pilgrim community.'
  },

  // 2. Prophetic Figures
  {
    id: 'typ-5',
    otType: 'Melchizedek (King of Righteousness & Peace)',
    otPassage: 'Genesis 14:18-20; Psalm 110:4',
    category: 'Prophetic Figures',
    ntFulfillment: 'Christ’s Eternal Royal Priesthood',
    ntPassage: 'Hebrews 5:6-10, 7:1-28',
    theologicalConnection: 'A priest-king higher than Abraham who brings bread and wine without recorded genealogy, prefiguring Christ’s unchangeable, non-Levitical eternal priesthood.',
    hermeneuticalSignificance: 'Establishes the supremacy of Christ’s royal priesthood over the temporary Aaronite order.'
  },
  {
    id: 'typ-6',
    otType: 'Isaac Bound on Mount Moriah (The Akedah)',
    otPassage: 'Genesis 22:1-19',
    category: 'Prophetic Figures',
    ntFulfillment: 'God the Father Offering His Beloved Only Son with the Substitute Ram',
    ntPassage: 'Romans 8:32; Hebrews 11:17-19; John 3:16',
    theologicalConnection: 'The father offers his only beloved son who carries the wood up the mountain; God provides the substitute ram caught in the thorns.',
    hermeneuticalSignificance: 'The ultimate Old Testament picture of the Father’s sovereign love and substitutionary atonement.'
  },
  {
    id: 'typ-7',
    otType: 'David the Anointed King in Exile & Triumph',
    otPassage: '1 Samuel 16–2 Samuel 7',
    category: 'Prophetic Figures',
    ntFulfillment: 'Jesus the True Son of David & Eternal King of Kings',
    ntPassage: 'Luke 1:32-33; Revelation 22:16; Matthew 21:9',
    theologicalConnection: 'Anointed in obscurity, suffering persecution by Saul, ascending to reign in Zion, establishing an everlasting covenant throne.',
    hermeneuticalSignificance: 'Royal covenant typology: Christ reigning over an unshakable kingdom from the New Jerusalem.'
  },
  {
    id: 'typ-8',
    otType: 'Joseph Betrayed by Brothers, Exalted to Save the World',
    otPassage: 'Genesis 37–50',
    category: 'Prophetic Figures',
    ntFulfillment: 'Christ Rejected by His Own, Exalted to the Right Hand of the Throne',
    ntPassage: 'Acts 2:23-24, 7:9-14; Philippians 2:9-11',
    theologicalConnection: 'Beloved son stripped of robe, sold for silver, thrown in pit, falsely accused, exalted to Pharaoh’s right hand to preserve life in famine.',
    hermeneuticalSignificance: '"You meant evil against me, but God meant it for good"—sovereign redemption through suffering.'
  },

  // 3. Covenantal Frameworks & Events
  {
    id: 'typ-9',
    otType: 'The Noahic Ark & The Flood',
    otPassage: 'Genesis 6–9',
    category: 'Redemptive Events',
    ntFulfillment: 'Baptismal Union with Christ Passing Through Judgment',
    ntPassage: '1 Peter 3:20-21; 2 Peter 2:5',
    theologicalConnection: 'The single wooden vessel preserving the chosen family through cosmic waters of judgment into a cleansed new creation.',
    hermeneuticalSignificance: 'Christ as the true sanctuary shielding the elect from the deluge of divine wrath.'
  },
  {
    id: 'typ-10',
    otType: 'The Red Sea Crossing & Pillar of Fire',
    otPassage: 'Exodus 14–15',
    category: 'Redemptive Events',
    ntFulfillment: 'Redemption from Pharaoh (Satan) & Guidance by the Holy Spirit',
    ntPassage: '1 Corinthians 10:1-2; Jude 1:5',
    theologicalConnection: 'Israel baptized into Moses in the sea, delivered from bondage through water while the pursuing enemy was destroyed.',
    hermeneuticalSignificance: 'Definitive Old Testament paradigm of salvation through judgment and divine victory.'
  }
]

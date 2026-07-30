export interface TypologyStage {
  epochId: string
  epochName: string
  title: string
  scripture: string
  description: string
  typeOrAntitype: 'shadow' | 'development' | 'antitype'
}

export interface TypologyTheme {
  id: string
  title: string
  subtitle: string
  icon: string
  category: 'Sanctuary & Presence' | 'Covenant & Priesthood' | 'Sacrifice & Redemption' | 'Kingdom & Royalty'
  summary: string
  stages: TypologyStage[]
  antitypeSummary: string
  keyCrossReferences: { ot: string; nt: string; note: string }[]
}

export const typologyThemes: TypologyTheme[] = [
  {
    id: 'temple',
    title: 'The Temple & Divine Presence',
    subtitle: 'From Edenic Sanctuary to Christ and the New Jerusalem',
    icon: '🏛️',
    category: 'Sanctuary & Presence',
    summary: 'The desire of God to dwell with humanity progresses from the primordial garden sanctuary of Eden, through the portable Tabernacle and stone Temple, to its full embodiment in Jesus Christ and the church.',
    antitypeSummary: 'Jesus Christ is the true Temple where God and humanity meet without veil. Through the Holy Spirit, believers are built into a living temple, awaiting the New Jerusalem where God and the Lamb ARE the temple.',
    stages: [
      {
        epochId: 'pre-fall',
        epochName: 'Pre-Fall',
        title: 'Eden: The Original Cosmic Sanctuary',
        scripture: 'Genesis 2:8-15',
        description: 'Eden is depicted as an ancient mountain temple facing East, where God walks in the cool of the day and Adam serves as a priest-gardener ("keep and guard").',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'patriarchal',
        epochName: 'Patriarchal',
        title: 'Altars of Bethel & Moriah',
        scripture: 'Genesis 12:7-8, 28:16-19',
        description: 'Abraham and Jacob build altars at sacred encounters, marking spots where heaven touches earth ("Gate of Heaven").',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'mosaic',
        epochName: 'Mosaic',
        title: 'The Tabernacle & Solomon’s Temple',
        scripture: 'Exodus 25:8-9, 1 Kings 8:10-11',
        description: 'God grants Moses the heavenly blueprint for the Tabernacle. The Shekinah glory fills the Holy of Holies, separated from the people by the thick veil.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'prophetic',
        epochName: 'Prophetic',
        title: 'Ezekiel’s Vision of the Heavenly Temple',
        scripture: 'Ezekiel 43:1-7, Haggai 2:7-9',
        description: 'As the earthly temple is destroyed for covenant unfaithfulness, prophets foresee a glorious future temple where life-giving water flows from the altar.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'messianic',
        epochName: 'Messianic Realization',
        title: 'Christ the Incarnate Temple & The Church',
        scripture: 'John 1:14, 2:19-21, Revelation 21:22',
        description: 'Jesus declares, "Destroy this temple, and in three days I will raise it up"—speaking of His body. At His death, the veil is torn; believers become indwelt by the Spirit.',
        typeOrAntitype: 'antitype'
      }
    ],
    keyCrossReferences: [
      { ot: 'Exodus 25:40', nt: 'Hebrews 8:5', note: 'Earthly tabernacle was a copy/shadow of the heavenly reality.' },
      { ot: 'Ezekiel 47:1', nt: 'Revelation 22:1', note: 'Life-giving river flowing from God’s throne and the Lamb.' }
    ]
  },
  {
    id: 'sabbath',
    title: 'The Sabbath & Heavenly Rest',
    subtitle: 'From Creation Rest to Christ’s Finished Work',
    icon: '🌅',
    category: 'Sanctuary & Presence',
    summary: 'The Sabbath is not merely a cessation from labor, but an eschatological goal: entering into God’s own unshakeable creation rest.',
    antitypeSummary: 'Jesus fulfills the Sabbath by taking our labor under the law and granting eternal spiritual rest. Believers cease from dead works and rest in His completed salvation.',
    stages: [
      {
        epochId: 'pre-fall',
        epochName: 'Pre-Fall',
        title: 'God’s Creation Rest on the Seventh Day',
        scripture: 'Genesis 2:1-3',
        description: 'God rests on the seventh day—a day without an "evening and morning" formula, pointing to an eternal eschatological goal held before Adam.',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'patriarchal',
        epochName: 'Patriarchal',
        title: 'Pilgrim Longing for a Heavenly Country',
        scripture: 'Genesis 47:9, Hebrews 11:13-16',
        description: 'Patriarchs live as sojourners without permanent rest, seeking a country of divine foundation.',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'mosaic',
        epochName: 'Mosaic',
        title: 'Sabbath Commandment & Land Rest',
        scripture: 'Exodus 20:8-11, Deuteronomy 5:12-15',
        description: 'Sabbath is codified as a sign of creation and redemption from Egypt. Israel’s entry into Canaan is pictured as entering God’s rest.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'prophetic',
        epochName: 'Prophetic',
        title: 'Warning of Forfeited Rest & Future Sabbath',
        scripture: 'Psalm 95:7-11, Isaiah 66:22-23',
        description: 'Because of unbelief, Israel failed to enter true rest. The Psalmist warns that "today" a deeper rest still remains.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'messianic',
        epochName: 'Messianic Realization',
        title: 'Christ our Sabbath Rest',
        scripture: 'Matthew 11:28-30, Hebrews 4:1-11',
        description: 'Jesus calls: "Come to me... and I will give you rest." Hebrews 4 confirms: "There remains a Sabbath rest for the people of God," anchored in Christ’s finished work.',
        typeOrAntitype: 'antitype'
      }
    ],
    keyCrossReferences: [
      { ot: 'Genesis 2:2', nt: 'Hebrews 4:4,10', note: 'Whoever enters God’s rest rests from works as God did from His.' },
      { ot: 'Deuteronomy 5:15', nt: 'Colossians 2:16-17', note: 'Sabbath days were a shadow of things to come; the substance belongs to Christ.' }
    ]
  },
  {
    id: 'priest',
    title: 'The Great High Priest',
    subtitle: 'From Melchizedek & Aaron to the Eternal Intercessor',
    icon: '⚖️',
    category: 'Covenant & Priesthood',
    summary: 'Humanity needed a mediator to guard sacred space, offer gifts/sacrifices, and intercede before a holy God.',
    antitypeSummary: 'Jesus is our sinless Great High Priest according to the order of Melchizedek. Having offered Himself once for all, He forever lives at the Father’s right hand to intercede for us.',
    stages: [
      {
        epochId: 'pre-fall',
        epochName: 'Pre-Fall',
        title: 'Adam’s Royal-Priestly Commission',
        scripture: 'Genesis 2:15',
        description: 'Adam was commanded to "work" (*abad*) and "keep/guard" (*shamar*) Eden—the exact Hebrew verbs used later for Levitical priests guarding the sanctuary.',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'patriarchal',
        epochName: 'Patriarchal',
        title: 'Melchizedek: King of Salem & Priest of God Most High',
        scripture: 'Genesis 14:18-20',
        description: 'Melchizedek combines royalty and priesthood, bringing bread and wine to bless Abraham, receiving tithes without genealogy.',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'mosaic',
        epochName: 'Mosaic',
        title: 'The Levitical & Aaronic Priesthood',
        scripture: 'Exodus 28:1-4, Leviticus 16:1-19',
        description: 'Aaron and his sons are clothed in holy garments. They enter the Holy Place daily and the Most Holy Place once a year with blood, burdened by their own infirmity and death.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'prophetic',
        epochName: 'Prophetic',
        title: 'The Promise of a Priest-King after Melchizedek',
        scripture: 'Psalm 110:1-4, Zechariah 6:12-13',
        description: 'David prophesies that the Lord swears: "You are a priest forever after the order of Melchizedek." Zechariah foretells a Branch who will wear royal robes and sit on a priestly throne.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'messianic',
        epochName: 'Messianic Realization',
        title: 'Jesus the Ultimate High Priest',
        scripture: 'Hebrews 7:23-28, 9:24-28',
        description: 'Because Jesus holds His priesthood permanently through an indestructible life, He is able to save to the uttermost those who draw near to God through Him.',
        typeOrAntitype: 'antitype'
      }
    ],
    keyCrossReferences: [
      { ot: 'Psalm 110:4', nt: 'Hebrews 7:17', note: 'Christ’s superior priesthood based on oath and resurrection life.' },
      { ot: 'Leviticus 16:15', nt: 'Hebrews 9:12', note: 'He entered once for all into the holy places, securing eternal redemption.' }
    ]
  },
  {
    id: 'sacrifice',
    title: 'The Substitutionary Sacrifice',
    subtitle: 'From Animal Skins to the Lamb of God',
    icon: '🔥',
    category: 'Sacrifice & Redemption',
    summary: 'Sin demands death to satisfy divine justice. God graciously provided the principle of substitutionary sacrifice so that guilty sinners could be redeemed.',
    antitypeSummary: 'Jesus Christ is the true Passover Lamb and ultimate sin offering. His death on Golgotha satisfied the wrath of God once for all, rendering animal sacrifices obsolete.',
    stages: [
      {
        epochId: 'pre-fall',
        epochName: 'Pre-Fall',
        title: 'The First Bloodshed: Garments of Skin',
        scripture: 'Genesis 3:21',
        description: 'After the Fall, God Himself slays an innocent animal to cover the nakedness and shame of Adam and Eve.',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'patriarchal',
        epochName: 'Patriarchal',
        title: 'Abraham’s Ram on Mount Moriah',
        scripture: 'Genesis 22:11-14',
        description: 'When Isaac asks "Where is the lamb?", Abraham answers: "God will provide for Himself the lamb." A ram caught in a thicket is offered in Isaac’s stead.',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'mosaic',
        epochName: 'Mosaic',
        title: 'The Passover Lamb & Day of Atonement',
        scripture: 'Exodus 12:3-13, Leviticus 16:20-22',
        description: 'Blood on the doorposts shields Israel from the destroyer. The scapegoat carries Israel’s sins away into the wilderness.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'prophetic',
        epochName: 'Prophetic',
        title: 'The Suffering Servant Crushed for Our Iniquities',
        scripture: 'Isaiah 53:4-7,10-12',
        description: 'Isaiah foretells a human Servant who will be "led like a lamb to the slaughter" and make His soul a guilt offering for many.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'messianic',
        epochName: 'Messianic Realization',
        title: 'Jesus: The Lamb of God Who Takes Away the Sin of the World',
        scripture: 'John 1:29, 1 Corinthians 5:7, Hebrews 10:11-14',
        description: 'John the Baptist cries out: "Behold, the Lamb of God!" By one single offering, Christ has perfected forever those who are being sanctified.',
        typeOrAntitype: 'antitype'
      }
    ],
    keyCrossReferences: [
      { ot: 'Isaiah 53:7', nt: '1 Peter 1:18-19', note: 'Redeemed with the precious blood of Christ, like that of a lamb without blemish.' },
      { ot: 'Leviticus 17:11', nt: 'Hebrews 9:22', note: 'Without the shedding of blood there is no forgiveness of sins.' }
    ]
  },
  {
    id: 'king',
    title: 'The Davidic King & Kingdom',
    subtitle: 'From Fallen Royalty to King of Kings on Mount Zion',
    icon: '👑',
    category: 'Kingdom & Royalty',
    summary: 'God designed humanity for dominion. When human kingship failed in Israel, God promised an Anointed One whose throne would endure forever.',
    antitypeSummary: 'Jesus is the true Son of David and King of Kings. Through His cross and resurrection, He defeated Satan, ascended to the heavenly throne, and reigns over an everlasting kingdom.',
    stages: [
      {
        epochId: 'pre-fall',
        epochName: 'Pre-Fall',
        title: 'Adam’s Dominion Mandate',
        scripture: 'Genesis 1:26-28',
        description: 'Adam was created as God’s vice-regent to exercise benevolent dominion over all creation in humble submission to the Great King.',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'patriarchal',
        epochName: 'Patriarchal',
        title: 'The Scepter Promised to Judah',
        scripture: 'Genesis 49:8-10',
        description: 'Jacob blesses Judah: "The scepter shall not depart from Judah... until Shiloh comes; and to Him shall be the obedience of the peoples."',
        typeOrAntitype: 'shadow'
      },
      {
        epochId: 'mosaic',
        epochName: 'Mosaic',
        title: 'King David & The Eternal Kingdom Covenant',
        scripture: '2 Samuel 7:12-16, Psalm 2:1-12',
        description: 'God covenants with David: "I will establish the throne of his kingdom forever." David reigns over Israel as a man after God’s own heart, though flawed.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'prophetic',
        epochName: 'Prophetic',
        title: 'The Branch of Righteousness & The Prince of Peace',
        scripture: 'Isaiah 9:6-7, Daniel 7:13-14',
        description: 'Prophets promise a King born of a virgin upon David’s throne, whose dominion will be an everlasting dominion that shall not pass away.',
        typeOrAntitype: 'development'
      },
      {
        epochId: 'messianic',
        epochName: 'Messianic Realization',
        title: 'Jesus Christ: King of Kings & Lord of Lords',
        scripture: 'Luke 1:31-33, Acts 2:30-36, Revelation 19:16',
        description: 'Jesus is declared Son of God in power by His resurrection. He sits at God’s right hand until all enemies are made His footstool.',
        typeOrAntitype: 'antitype'
      }
    ],
    keyCrossReferences: [
      { ot: '2 Samuel 7:13', nt: 'Luke 1:32-33', note: 'The Lord God will give to Him the throne of His father David.' },
      { ot: 'Psalm 110:1', nt: 'Acts 2:34-36', note: 'God has made Him both Lord and Christ, this Jesus whom you crucified.' }
    ]
  }
]

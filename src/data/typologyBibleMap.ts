export interface TypologyMapping {
  id: string
  otBook: string
  otChapter: number
  otVerseStart: number
  otVerseEnd: number
  otReference: string
  otPassageTitle: string
  otSummary: string
  themeTitle: string
  themeIcon: string
  ntReference: string
  ntPassageTitle: string
  ntPassageText: string
  ntFulfillmentSummary: string
  vosianInsight: string
}

export const typologyBibleMap: TypologyMapping[] = [
  {
    id: 'gen-3-15-seed',
    otBook: 'Genesis',
    otChapter: 3,
    otVerseStart: 15,
    otVerseEnd: 15,
    otReference: 'Genesis 3:15',
    otPassageTitle: 'The Protoevangelium (First Gospel Promise)',
    otSummary: 'God declares enmity between the Serpent and the woman, and between its seed and her Seed. He shall crush your head, and you shall bruise his heel.',
    themeTitle: 'The Seed of the Woman',
    themeIcon: '🌱',
    ntReference: 'Galatians 4:4-5 & Hebrews 2:14',
    ntPassageTitle: 'Christ Born of Woman to Destroy the Devil',
    ntPassageText: 'When the fullness of time had come, God sent forth his Son, born of woman, born under the law... Since therefore the children share in flesh and blood, he himself likewise partook of the same things, that through death he might destroy the one who has the power of death, that is, the devil.',
    ntFulfillmentSummary: 'Jesus Christ is the virgin-born Seed who suffered the heel-bruising of the cross while dealing the fatal head-crushing blow to Satan through His resurrection.',
    vosianInsight: 'Genesis 3:15 is the embryonic seed-form of all special revelation. Every covenant that follows simply unfolds what is latently contained in this first gospel promise.'
  },
  {
    otBook: 'Genesis',
    otChapter: 14,
    otVerseStart: 18,
    otVerseEnd: 20,
    id: 'gen-14-melchizedek',
    otReference: 'Genesis 14:18-20',
    otPassageTitle: 'Melchizedek Blesses Abraham',
    otSummary: 'Melchizedek king of Salem brought out bread and wine. He was priest of God Most High, and he blessed Abram, and Abram gave him a tenth of everything.',
    themeTitle: 'The Royal Priesthood',
    themeIcon: '⚖️',
    ntReference: 'Hebrews 7:1-3, 17-26',
    ntPassageTitle: 'Christ: High Priest After the Order of Melchizedek',
    ntPassageText: 'This Melchizedek, king of Salem, priest of the Most High God, met Abraham... He is first, by translation of his name, king of righteousness, and then he is also king of Salem, that is, king of peace. He is without father or mother or genealogy... resembling the Son of God he continues a priest forever.',
    ntFulfillmentSummary: 'Jesus combines royalty and priesthood according to an indestructible life, transcending the temporary Levitical order to offer eternal salvation.',
    vosianInsight: 'Melchizedek anticipates the eschatological ideal of the Messiah: a King-Priest reigning in righteousness and peace before the Mosaic law was ever given.'
  },
  {
    id: 'gen-22-isaac-ram',
    otBook: 'Genesis',
    otChapter: 22,
    otVerseStart: 1,
    otVerseEnd: 14,
    otReference: 'Genesis 22:9-14',
    otPassageTitle: 'The Binding of Isaac on Mount Moriah',
    otSummary: 'Abraham bound Isaac and laid him on the altar. The angel called out: "Do not lay your hand on the boy." Abraham lifted his eyes and saw a ram caught in a thicket and offered it in place of his son.',
    themeTitle: 'The Substitutionary Sacrifice',
    themeIcon: '🔥',
    ntReference: 'Romans 8:32 & Hebrews 11:17-19',
    ntPassageTitle: 'God Spared Not His Own Son',
    ntPassageText: 'He who did not spare his own Son but gave him up for us all, how will he not also with him graciously give us all things? By faith Abraham offered up Isaac... figuratively speaking, he did receive him back.',
    ntFulfillmentSummary: 'What God stayed Abraham from doing to Isaac, God did not spare Himself: He gave His only begotten Son on the selfsame mountain ridge (Golgotha/Moriah) as our ultimate substitute.',
    vosianInsight: 'Moriah displays the profound principle of divine substitution: the Lord provides the lamb that satisfies His own justice.'
  },
  {
    id: 'ex-12-passover-lamb',
    otBook: 'Exodus',
    otChapter: 12,
    otVerseStart: 3,
    otVerseEnd: 13,
    otReference: 'Exodus 12:5-13',
    otPassageTitle: 'The Passover Lamb & Blood on Doorposts',
    otSummary: 'Your lamb shall be a male without blemish. The congregation shall kill their lambs at twilight. Take blood and put it on the two doorposts... when I see the blood, I will pass over you.',
    themeTitle: 'The Passover Lamb',
    themeIcon: '🐑',
    ntReference: '1 Corinthians 5:7 & 1 Peter 1:18-19',
    ntPassageTitle: 'Christ Our Passover Lamb Sacrificed',
    ntPassageText: 'Clean cleanse out the old leaven that you may be a new lump... For Christ, our Passover lamb, has been sacrificed... redeemed with the precious blood of Christ, like that of a lamb without blemish or spot.',
    ntFulfillmentSummary: 'Jesus is the unblemished Lamb of God whose shed blood delivers His people from divine wrath and death.',
    vosianInsight: 'Redemption from Egypt through Passover blood is the prototype of gospel salvation: judgment avoided only through substitutionary sacrifice.'
  },
  {
    id: 'ex-25-tabernacle-pattern',
    otBook: 'Exodus',
    otChapter: 25,
    otVerseStart: 8,
    otVerseEnd: 9,
    otReference: 'Exodus 25:8-9, 40',
    otPassageTitle: 'The Pattern of the Heavenly Tabernacle',
    otSummary: 'Let them make me a sanctuary, that I may dwell in their midst. Exactly as I show you concerning the pattern of the tabernacle... see that you make them after the pattern shown you on the mountain.',
    themeTitle: 'The Tabernacle & Heavenly Sanctuary',
    themeIcon: '🏛️',
    ntReference: 'Hebrews 8:1-6 & John 1:14',
    ntPassageTitle: 'Christ: The True Heavenly Tabernacle',
    ntPassageText: 'We have such a high priest, one who is seated at the right hand of the throne of the Majesty in heaven, a minister in the holy places, in the true tent that the Lord set up, not man... They serve a copy and shadow of the heavenly things.',
    ntFulfillmentSummary: 'The wilderness tabernacle was an earthly shadow of the heavenly sanctuary; Jesus tabernacled among us to bring us into the true heavenly presence of God.',
    vosianInsight: 'The tabernacle is a copy of heavenly realities. Earthly sacred space points toward the ultimate eschatological goal of God indwelling His creation.'
  },
  {
    id: 'lev-16-day-of-atonement',
    otBook: 'Leviticus',
    otChapter: 16,
    otVerseStart: 11,
    otVerseEnd: 22,
    otReference: 'Leviticus 16:15-22',
    otPassageTitle: 'Yom Kippur: Blood Atonement & Scapegoat',
    otSummary: 'Aaron shall kill the goat of the sin offering for the people and bring its blood inside the veil... Aaron shall lay both his hands on the head of the live goat, and confess over it all the iniquities of Israel, and send it away into the wilderness.',
    themeTitle: 'The Day of Atonement',
    themeIcon: '🩸',
    ntReference: 'Hebrews 9:11-14, 24-26',
    ntPassageTitle: 'Christ Entered Once for All into Holy Places',
    ntPassageText: 'When Christ appeared as a high priest of the good things that have come... he entered once for all into the holy places, not by means of the blood of goats and calves but by means of his own blood, thus securing an eternal redemption.',
    ntFulfillmentSummary: 'Jesus fulfills both goats of Yom Kippur: His blood propitiates God’s wrath inside the veil, and He bears our sins away into outer darkness.',
    vosianInsight: 'Leviticus 16 highlights the insufficiency of repeated animal sacrifices, pointing to the single, all-sufficient eschatological sacrifice of Christ.'
  },
  {
    id: '2sam-7-davidic-covenant',
    otBook: '2 Samuel',
    otChapter: 7,
    otVerseStart: 12,
    otVerseEnd: 16,
    otReference: '2 Samuel 7:12-16',
    otPassageTitle: 'The Covenant with David: Eternal Kingdom',
    otSummary: 'I will raise up your offspring after you, who shall come from your body, and I will establish his kingdom... I will establish the throne of his kingdom forever.',
    themeTitle: 'The Davidic King & Kingdom',
    themeIcon: '👑',
    ntReference: 'Luke 1:31-33 & Acts 2:30-36',
    ntPassageTitle: 'Jesus Received the Eternal Throne of David',
    ntPassageText: 'The Lord God will give to him the throne of his father David, and he will reign over the house of Jacob forever, and of his kingdom there will be no end... Being therefore a prophet, and knowing that God had sworn with an oath to him that he would set one of his descendants on his throne, he foresaw and spoke of the resurrection of the Christ.',
    ntFulfillmentSummary: 'David’s earthly throne was a shadow; Jesus is the resurrected Son of David whose reign over the cosmos will never end.',
    vosianInsight: 'The Davidic covenant establishes that true human dominion mandate given to Adam is realized only in the resurrected King of Kings.'
  },
  {
    id: 'ps-22-suffering-messiah',
    otBook: 'Psalms',
    otChapter: 22,
    otVerseStart: 1,
    otVerseEnd: 18,
    otReference: 'Psalm 22:1-18',
    otPassageTitle: 'My God, My God, Why Hast Thou Forsaken Me?',
    otSummary: 'My God, my god, why have you forsaken me?... They divide my garments among them, and for my clothing they cast lots.',
    themeTitle: 'The Suffering & Exalted Messiah',
    themeIcon: '✝️',
    ntReference: 'Matthew 27:35-46 & Hebrews 2:11-12',
    ntPassageTitle: 'The Crucifixion & Exaltation of Christ',
    ntPassageText: 'About the ninth hour Jesus cried out with a loud voice: "Eli, Eli, lema sabachthani?" that is, "My God, my god, why have you forsaken me?"... And when they had crucified him, they divided his garments by casting lots.',
    ntFulfillmentSummary: 'David’s prophetic lament describes line-by-line the exact agony, mockery, and garment-dividing of Jesus on Golgotha.',
    vosianInsight: 'David spoke in the Spirit, experiencing personal anguish that transcended his own life to picture the messianic cross.'
  },
  {
    id: 'ps-110-priest-king',
    otBook: 'Psalms',
    otChapter: 110,
    otVerseStart: 1,
    otVerseEnd: 4,
    otReference: 'Psalm 110:1-4',
    otPassageTitle: 'Sit at My Right Hand & Priest Forever',
    otSummary: 'The LORD says to my Lord: "Sit at my right hand, until I make your enemies your footstool." The LORD has sworn: "You are a priest forever after the order of Melchizedek."',
    themeTitle: 'The Enthroned Priest-King',
    themeIcon: '⚡',
    ntReference: 'Matthew 22:42-45 & Hebrews 5:5-10',
    ntPassageTitle: 'Jesus Exalted at the Father’s Right Hand',
    ntPassageText: 'If then David calls him Lord, how is he his son?... So also Christ did not exalt himself to become a high priest, but was appointed by him who said to him... "You are a priest forever, after the order of Melchizedek."',
    ntFulfillmentSummary: 'Psalm 110 is the most quoted OT passage in the New Testament, establishing Jesus’s ascension to the Father’s right hand as Priest-King.',
    vosianInsight: 'In Psalm 110, prophecy unites the royal throne and the priestly altar into one single eschatological Mediator.'
  },
  {
    id: 'isa-53-suffering-servant',
    otBook: 'Isaiah',
    otChapter: 53,
    otVerseStart: 1,
    otVerseEnd: 12,
    otReference: 'Isaiah 53:4-12',
    otPassageTitle: 'The Suffering Servant Crushed for Us',
    otSummary: 'He was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace... the LORD has laid on him the iniquity of us all.',
    themeTitle: 'The Suffering Servant',
    themeIcon: '📜',
    ntReference: 'Acts 8:32-35 & 1 Peter 2:22-25',
    ntPassageTitle: 'Christ Bore Our Sins in His Body on the Tree',
    ntPassageText: 'Like a sheep he was led to the slaughter and like a lamb before its shearer is silent... He himself bore our sins in his body on the tree, that we might die to sin and live to righteousness. By his wounds you have been healed.',
    ntFulfillmentSummary: 'Isaiah’s prophecy of the Suffering Servant finds literal fulfillment in Jesus, who gave His life as a ransom for many.',
    vosianInsight: 'Isaiah 53 penetrates deeper than any OT passage into the vicarious substitutionary nature of Christ’s atonement.'
  },
  {
    id: 'jer-31-new-covenant',
    otBook: 'Jeremiah',
    otChapter: 31,
    otVerseStart: 31,
    otVerseEnd: 34,
    otReference: 'Jeremiah 31:31-34',
    otPassageTitle: 'The New Covenant Written on the Heart',
    otSummary: 'Behold, the days are coming, declares the LORD, when I will make a new covenant with the house of Israel... I will put my law within them, and I will write it on their hearts... I will forgive their iniquity, and I will remember their sin no more.',
    themeTitle: 'The New Covenant',
    themeIcon: '🍷',
    ntReference: 'Luke 22:20 & Hebrews 8:8-12',
    ntPassageTitle: 'The New Covenant Sealed in Christ’s Blood',
    ntPassageText: 'And likewise the cup after they had eaten, saying, "This cup that is poured out for you is the new covenant in my blood."... For he finds fault with them when he says: "Behold, the days are coming, declares the Lord, when I will establish a new covenant."',
    ntFulfillmentSummary: 'At the Last Supper, Jesus inaugurated the New Covenant promised by Jeremiah, granting inward Spirit transformation and total sin forgiveness.',
    vosianInsight: 'The New Covenant is the definitive administration of grace where law is no longer an external code on stone, but inward life by the Spirit.'
  }
]

export function getTypologyForVerse(book: string, chapter: number, verse: number): TypologyMapping | undefined {
  return typologyBibleMap.find(
    (m) =>
      m.otBook.toLowerCase() === book.toLowerCase() &&
      m.otChapter === chapter &&
      verse >= m.otVerseStart &&
      verse <= m.otVerseEnd
  )
}

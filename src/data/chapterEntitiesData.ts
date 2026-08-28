/**
 * Chapter Entities Metadata (People, Places, and Redemptive Context)
 * Provides verse-level and chapter-level entity intelligence for the Bible Reader
 */

export interface ChapterPersonEntity {
  name: string
  hebrewOrGreek?: string
  role: string
  tribeOrOrigin?: string
  bio: string
  verseMention?: string
  genealogyId?: string
}

export interface ChapterPlaceEntity {
  name: string
  modernName: string
  country: string
  coordinates: { lat: number; lng: number }
  elevationMeters?: number
  distanceFromJerusalemKm?: number
  significance: string
  verseMention?: string
}

export interface ChapterContextData {
  book: string
  chapter: number
  era: string
  historicalSetting: string
  people: ChapterPersonEntity[]
  places: ChapterPlaceEntity[]
}

export const CHAPTER_ENTITIES_DATABASE: Record<string, ChapterContextData> = {
  'Genesis-1': {
    book: 'Genesis',
    chapter: 1,
    era: 'Creation & Primeval History',
    historicalSetting: 'The cosmic dawn; God creates the heavens and the earth ex nihilo in six days, culminating in humanity made in the Imago Dei.',
    people: [
      { name: 'Adam', hebrewOrGreek: 'אָדָם', role: 'First Man & Covenant Head', tribeOrOrigin: 'Dust of the Earth', bio: 'Created in the image and likeness of God to exercise dominion under the Covenant of Works.', verseMention: 'Genesis 1:26-28' },
      { name: 'Eve', hebrewOrGreek: 'חַוָּה', role: 'First Woman & Mother of All Living', tribeOrOrigin: 'Side of Adam', bio: 'Created as suitable companion and co-ruler over creation.', verseMention: 'Genesis 1:27-28' }
    ],
    places: [
      { name: 'Heavens & Earth', modernName: 'Cosmos', country: 'Creation', coordinates: { lat: 31.7683, lng: 35.2137 }, significance: 'The cosmic temple fashioned by the Word of God.', verseMention: 'Genesis 1:1' }
    ]
  },
  'Genesis-3': {
    book: 'Genesis',
    chapter: 3,
    era: 'Creation & Fall',
    historicalSetting: 'The serpent deceives Eve; Adam violates the covenant of works; God pronounces the curse and the Protoevangelium promise of the Redeemer.',
    people: [
      { name: 'Adam', hebrewOrGreek: 'אָדָם', role: 'Fallen Covenant Head', bio: 'Ate the forbidden fruit, plunging the human race into sin and spiritual death.', verseMention: 'Genesis 3:6-19' },
      { name: 'Eve', hebrewOrGreek: 'חַוָּה', role: 'Wife of Adam', bio: 'Deceived by the serpent; promised that her Seed will crush the serpent’s head.', verseMention: 'Genesis 3:1-16' },
      { name: 'The Serpent (Satan)', role: 'Adversary & Tempter', bio: 'Crafty creature used by Satan to entice humanity to doubt God’s Word.', verseMention: 'Genesis 3:1-15' }
    ],
    places: [
      { name: 'Garden of Eden', modernName: 'Mesopotamia / Fertile Crescent', country: 'Ancient Near East', coordinates: { lat: 31.0, lng: 47.0 }, significance: 'The primordial sanctuary garden where God walked with man.', verseMention: 'Genesis 3:8, 23-24' }
    ]
  },
  'Genesis-12': {
    book: 'Genesis',
    chapter: 12,
    era: 'Patriarchal Era',
    historicalSetting: 'God calls Abram to leave Ur and Haran for the Promised Land of Canaan; Abram builds altars at Shechem and Bethel.',
    people: [
      { name: 'Abram (Abraham)', hebrewOrGreek: 'אַבְרָהָם', role: 'Father of the Faithful', tribeOrOrigin: 'Semite (Terah line)', bio: 'Departed Haran at age 75 in obedience to God’s promise of land, seed, and blessing.', verseMention: 'Genesis 12:1-9', genealogyId: 'abraham' },
      { name: 'Sarai (Sarah)', hebrewOrGreek: 'שָׂרָה', role: 'Wife of Abram', bio: 'Accompanied Abram to Canaan and Egypt; preserved by God from Pharaoh.', verseMention: 'Genesis 12:5, 11-20', genealogyId: 'sarah' },
      { name: 'Lot', hebrewOrGreek: 'לוֹט', role: 'Nephew of Abram', bio: 'Son of Haran who journeyed with Abram into Canaan.', verseMention: 'Genesis 12:5' },
      { name: 'Pharaoh of Egypt', role: 'Monarch of Egypt', bio: 'Took Sarai into his household until stricken by plagues from the LORD.', verseMention: 'Genesis 12:15-20' }
    ],
    places: [
      { name: 'Haran', modernName: 'Harran', country: 'Turkey', coordinates: { lat: 36.8647, lng: 39.0322 }, elevationMeters: 375, distanceFromJerusalemKm: 650, significance: 'City where Terah died and Abram received the divine call.', verseMention: 'Genesis 12:4-5' },
      { name: 'Shechem', modernName: 'Nablus (Tel Balata)', country: 'West Bank', coordinates: { lat: 32.2141, lng: 35.2689 }, elevationMeters: 550, distanceFromJerusalemKm: 50, significance: 'First altar Abram built in the Promised Land under the Oak of Moreh.', verseMention: 'Genesis 12:6-7' },
      { name: 'Bethel', modernName: 'Beitin', country: 'West Bank', coordinates: { lat: 31.9364, lng: 35.2233 }, elevationMeters: 880, distanceFromJerusalemKm: 18, significance: 'Abram pitched his tent and called on the name of Yahweh.', verseMention: 'Genesis 12:8' }
    ]
  },
  'Genesis-22': {
    book: 'Genesis',
    chapter: 22,
    era: 'Patriarchal Era',
    historicalSetting: 'God tests Abraham on Mount Moriah by commanding the offering of Isaac; God provides the substitute ram in the thicket.',
    people: [
      { name: 'Abraham', role: 'Friend of God', bio: 'In unwavering faith that God could raise the dead, stretched out his hand to offer Isaac.', verseMention: 'Genesis 22:1-19', genealogyId: 'abraham' },
      { name: 'Isaac', role: 'Son of the Promise', bio: 'Submissively carried the wood up Mount Moriah for the burnt offering.', verseMention: 'Genesis 22:6-10', genealogyId: 'isaac' },
      { name: 'The Angel of the LORD', role: 'Pre-incarnate Christ', bio: 'Halted the knife from heaven and confirmed the sworn covenant oath.', verseMention: 'Genesis 22:11-18' }
    ],
    places: [
      { name: 'Mount Moriah', modernName: 'Temple Mount, Jerusalem', country: 'Israel', coordinates: { lat: 31.778, lng: 35.2354 }, elevationMeters: 740, distanceFromJerusalemKm: 0, significance: 'Site of the Akedah sacrifice; later the location of Solomon’s Temple and Golgotha.', verseMention: 'Genesis 22:2' },
      { name: 'Beersheba', modernName: 'Be’er Sheva', country: 'Israel', coordinates: { lat: 31.2518, lng: 34.7913 }, elevationMeters: 260, distanceFromJerusalemKm: 75, significance: 'Abraham’s home base in the southern Negev.', verseMention: 'Genesis 22:19' }
    ]
  },
  'Exodus-3': {
    book: 'Exodus',
    chapter: 3,
    era: 'Exodus & Wilderness',
    historicalSetting: 'Moses encounters Yahweh in the burning bush on Mount Horeb; God reveals His memorial covenant name: "I AM WHO I AM".',
    people: [
      { name: 'Moses', hebrewOrGreek: 'מֹשֶׁה', role: 'Shepherd & Chosen Deliverer', tribeOrOrigin: 'Levi', bio: 'Fled Pharaoh to Midian; commissioned by God to confront Egypt and lead Israel out.', verseMention: 'Exodus 3:1-15', genealogyId: 'moses' },
      { name: 'Jethro (Reuel)', role: 'Priest of Midian & Father-in-law', bio: 'Priest whose flock Moses was tending near Mount Horeb.', verseMention: 'Exodus 3:1' }
    ],
    places: [
      { name: 'Mount Horeb (Mount Sinai)', modernName: 'Jabal Musa / Jebel al-Lawz', country: 'Egypt / Saudi Arabia', coordinates: { lat: 28.5394, lng: 33.9753 }, elevationMeters: 2285, distanceFromJerusalemKm: 380, significance: 'The Mountain of God where the burning bush appeared and the Law was given.', verseMention: 'Exodus 3:1-2' },
      { name: 'Land of Midian', modernName: 'Northwestern Arabian Peninsula', country: 'Saudi Arabia', coordinates: { lat: 28.0, lng: 35.5 }, significance: 'Where Moses spent 40 years in exile tending sheep.', verseMention: 'Exodus 3:1' }
    ]
  },
  'Exodus-14': {
    book: 'Exodus',
    chapter: 14,
    era: 'Exodus & Wilderness',
    historicalSetting: 'Israel is trapped between Pharaoh’s army and the Red Sea; God parts the waters with a strong east wind, delivering Israel and drowning Egypt.',
    people: [
      { name: 'Moses', role: 'Mediator of Israel', bio: 'Stretched out his rod over the sea by divine command: "The LORD will fight for you, and you have only to be silent."', verseMention: 'Exodus 14:13-21', genealogyId: 'moses' },
      { name: 'Pharaoh', role: 'Ruler of Egypt', bio: 'Hardened his heart and pursued Israel with 600 chosen chariots into the seabed.', verseMention: 'Exodus 14:5-10, 23-28' }
    ],
    places: [
      { name: 'Pi-hahiroth / Baal-zephon', modernName: 'Gulf of Suez / Bitter Lakes', country: 'Egypt', coordinates: { lat: 29.9668, lng: 32.5498 }, significance: 'Campsite where Israel was hemmed in before the crossing.', verseMention: 'Exodus 14:2, 9' },
      { name: 'The Red Sea (Yam Suph)', modernName: 'Red Sea / Gulf of Aqaba', country: 'Egypt / Jordan', coordinates: { lat: 28.0, lng: 34.0 }, significance: 'Site of the miraculous parting and definitive redemptive deliverance of Israel.', verseMention: 'Exodus 14:21-31' }
    ]
  },
  'Matthew-1': {
    book: 'Matthew',
    chapter: 1,
    era: 'The Life of Christ',
    historicalSetting: 'The royal genealogy of Jesus Christ through Abraham and King David, and the angelic annunciation to Joseph of the virgin conception of Emmanuel.',
    people: [
      { name: 'Jesus Christ', hebrewOrGreek: 'Ἰησοῦς Χριστός', role: 'Messiah & King of Kings', tribeOrOrigin: 'Tribe of Judah (Davidic heir)', bio: 'Conceived of the Holy Spirit to save His people from their sins.', verseMention: 'Matthew 1:1, 16, 21-25', genealogyId: 'jesus_christ' },
      { name: 'Joseph of Nazareth', role: 'Adoptive Legal Father', tribeOrOrigin: 'Judah (Davidic line)', bio: 'Righteous son of David who took Mary as his wife in obedience to the angel’s vision.', verseMention: 'Matthew 1:16-25', genealogyId: 'joseph_carpenter' },
      { name: 'Mary', role: 'Virgin Mother of Jesus', tribeOrOrigin: 'Judah', bio: 'Conceived the Messiah by the power of the Holy Spirit, fulfilling Isaiah 7:14.', verseMention: 'Matthew 1:16, 18-23', genealogyId: 'mary_mother' },
      { name: 'King David', role: 'Royal Covenant Forebearer', tribeOrOrigin: 'Judah', bio: 'Anointed King whose royal succession flows directly to Christ.', verseMention: 'Matthew 1:6', genealogyId: 'david' }
    ],
    places: [
      { name: 'Bethlehem of Judea', modernName: 'Bethlehem', country: 'West Bank', coordinates: { lat: 31.7054, lng: 35.2024 }, elevationMeters: 775, distanceFromJerusalemKm: 8, significance: 'City of David and prophesied birthplace of the Messiah (Micah 5:2).', verseMention: 'Matthew 1:25' },
      { name: 'Nazareth of Galilee', modernName: 'Nazareth', country: 'Israel', coordinates: { lat: 32.7019, lng: 35.3035 }, elevationMeters: 350, distanceFromJerusalemKm: 105, significance: 'Hometown of Joseph and Mary in Lower Galilee.', verseMention: 'Matthew 1:18' }
    ]
  },
  'John-1': {
    book: 'John',
    chapter: 1,
    era: 'The Life of Christ',
    historicalSetting: 'The majestic prologue declaring the Eternal Logos made flesh; John the Baptist’s testimony pointing to the Lamb of God; the calling of the first disciples.',
    people: [
      { name: 'Jesus (The Logos / Lamb of God)', hebrewOrGreek: 'ὁ Λόγος', role: 'Eternal Son of God', bio: 'In the beginning with God, and was God; became flesh and tabernacled among us.', verseMention: 'John 1:1-18, 29-51', genealogyId: 'jesus_christ' },
      { name: 'John the Baptist', role: 'The Forerunner & Voice in the Wilderness', tribeOrOrigin: 'Levi (Aaronite line)', bio: 'Baptized with water and identified Jesus: "Behold, the Lamb of God who takes away the sin of the world!"', verseMention: 'John 1:6-8, 19-36' },
      { name: 'Andrew', role: 'Apostle & Brother of Peter', tribeOrOrigin: 'Galilee', bio: 'Former disciple of John who immediately brought his brother Simon to Jesus.', verseMention: 'John 1:40-42' },
      { name: 'Simon Peter (Cephas)', role: 'Apostle & Leader of the Twelve', tribeOrOrigin: 'Galilee (Bethsaida)', bio: 'Given the name Cephas (Peter / Rock) upon meeting the Messiah.', verseMention: 'John 1:42' },
      { name: 'Philip & Nathanael', role: 'Apostles', bio: 'Philip declared "We have found him of whom Moses in the Law and the prophets wrote"; Nathanael confessed "You are the Son of God!"', verseMention: 'John 1:43-51' }
    ],
    places: [
      { name: 'Bethany Beyond the Jordan', modernName: 'Al-Maghtas', country: 'Jordan', coordinates: { lat: 31.8372, lng: 35.5511 }, elevationMeters: -380, distanceFromJerusalemKm: 35, significance: 'Where John the Baptist was baptizing and confessed Jesus as the Lamb of God.', verseMention: 'John 1:28' },
      { name: 'Bethsaida of Galilee', modernName: 'et-Tell', country: 'Israel', coordinates: { lat: 32.9103, lng: 35.6308 }, elevationMeters: -200, distanceFromJerusalemKm: 130, significance: 'Fishing village on the Sea of Galilee; hometown of Philip, Andrew, and Peter.', verseMention: 'John 1:44' }
    ]
  },
  'Acts-9': {
    book: 'Acts',
    chapter: 9,
    era: 'Apostolic Church Expansion',
    historicalSetting: 'The dramatic conversion of Saul of Tarsus on the Damascus Road; Ananias restores his sight; Peter heals Aeneas in Lydda and raises Dorcas in Joppa.',
    people: [
      { name: 'Saul of Tarsus (Apostle Paul)', hebrewOrGreek: 'Σαῦλος', role: 'Persecutor turned Apostle to the Gentiles', tribeOrOrigin: 'Benjamin / Tarsus', bio: 'Blinded by the risen Christ on the road to Damascus; commissioned as God’s chosen instrument to carry His name before the Gentiles.', verseMention: 'Acts 9:1-30' },
      { name: 'Ananias of Damascus', role: 'Faithful Disciple', bio: 'Sent by the Lord to lay hands on Saul on Straight Street to restore his sight.', verseMention: 'Acts 9:10-19' },
      { name: 'Simon Peter', role: 'Apostle', bio: 'Traveled through the Judean coast; healed paralytic Aeneas and raised Tabitha (Dorcas) from the dead.', verseMention: 'Acts 9:32-43' }
    ],
    places: [
      { name: 'Damascus', modernName: 'Damascus', country: 'Syria', coordinates: { lat: 33.5138, lng: 36.2765 }, elevationMeters: 680, distanceFromJerusalemKm: 220, significance: 'Ancient city on the Barada River where Saul saw the blinding light of Christ.', verseMention: 'Acts 9:2-3, 19' },
      { name: 'Jerusalem', modernName: 'Jerusalem', country: 'Israel', coordinates: { lat: 31.7683, lng: 35.2137 }, elevationMeters: 754, distanceFromJerusalemKm: 0, significance: 'Headquarters of the Apostles where Barnabas introduced Saul to the Church.', verseMention: 'Acts 9:26-28' },
      { name: 'Joppa', modernName: 'Jaffa (Tel Aviv)', country: 'Israel', coordinates: { lat: 32.0536, lng: 34.7567 }, elevationMeters: 30, distanceFromJerusalemKm: 55, significance: 'Mediterranean port city where Peter raised Dorcas and lodged with Simon the Tanner.', verseMention: 'Acts 9:36-43' }
    ]
  },
  'Romans-8': {
    book: 'Romans',
    chapter: 8,
    era: 'Apostolic Epistles',
    historicalSetting: 'The pinnacle of Pauline theology: No condemnation in Christ Jesus, life in the Holy Spirit, the groaning of creation, the Golden Chain of redemption, and eternal security in God’s love.',
    people: [
      { name: 'Paul the Apostle', role: 'Author & Apostle of Jesus Christ', bio: 'Writing to the Church in Rome from Corinth, proclaiming the glorious triumph of sovereign grace.', verseMention: 'Romans 1:1, 8:1' },
      { name: 'Jesus Christ', role: 'Interceding Lord', bio: 'Died, was raised, and is now seated at the right hand of God, continually making intercession for the elect.', verseMention: 'Romans 8:1, 34, 39', genealogyId: 'jesus_christ' }
    ],
    places: [
      { name: 'Rome', modernName: 'Rome', country: 'Italy', coordinates: { lat: 41.9028, lng: 12.4964 }, elevationMeters: 21, distanceFromJerusalemKm: 2300, significance: 'Capital of the Roman Empire and destination community of Paul’s magnum opus epistle.', verseMention: 'Romans 1:7, 15' },
      { name: 'Corinth', modernName: 'Ancient Corinth', country: 'Greece', coordinates: { lat: 37.9056, lng: 22.8797 }, elevationMeters: 60, distanceFromJerusalemKm: 1350, significance: 'Where Paul penned the Epistle to the Romans during his 3-month stay.', verseMention: 'Romans 16:23' }
    ]
  }
}

export function getChapterEntities(book: string, chapter: number): ChapterContextData {
  const key = `${book}-${chapter}`
  if (CHAPTER_ENTITIES_DATABASE[key]) {
    return CHAPTER_ENTITIES_DATABASE[key]
  }

  // Generative Smart Fallback
  return {
    book,
    chapter,
    era: 'Biblical Narrative Context',
    historicalSetting: `Historical and theological context for ${book} chapter ${chapter}.`,
    people: [
      {
        name: `${book} Characters`,
        role: 'Biblical Figures',
        bio: `Explore the people and covenant actors recorded across ${book} chapter ${chapter}.`,
        verseMention: `${book} ${chapter}:1`
      }
    ],
    places: [
      {
        name: 'Biblical Near East',
        modernName: 'Israel & Surrounding Lands',
        country: 'Middle East',
        coordinates: { lat: 31.7683, lng: 35.2137 },
        significance: `Geography and historical setting of ${book} chapter ${chapter}.`,
        verseMention: `${book} ${chapter}:1`
      }
    ]
  }
}

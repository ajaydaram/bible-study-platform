// Living Word Bible Journey - 100 Essential Redemptive Bible Stories & 4 Narrative Movements

export interface BibleStory {
  id: number
  title: string
  reference: string
  category: string
  context: string
}

export type NarrativeMovementId = 'creation' | 'fall' | 'redemption' | 'restoration'

export interface NarrativeMovement {
  id: NarrativeMovementId
  label: string
  shortLabel: string
  description: string
  range: [number, number]
  accent: string
  icon: string
}

export const narrativeMovements: NarrativeMovement[] = [
  {
    id: 'creation',
    label: 'Creation',
    shortLabel: 'Creation',
    description: 'God establishes the cosmos, orders humanity in His image, and institutes the Covenant of Works.',
    range: [1, 5],
    accent: '#10B981', // emerald
    icon: '🌿'
  },
  {
    id: 'fall',
    label: 'Fall & Exile',
    shortLabel: 'Fall',
    description: 'Humanity rebels, entering guilt and exile; God promises the Seed of the woman.',
    range: [6, 25],
    accent: '#F59E0B', // amber
    icon: '🍂'
  },
  {
    id: 'redemption',
    label: 'Redemption & Kingdom',
    shortLabel: 'Redemption',
    description: 'God raises up prophets, priests, and kings, culminating in Christ’s incarnation, cross, and resurrection.',
    range: [26, 85],
    accent: '#8B5CF6', // purple
    icon: '✝️'
  },
  {
    id: 'restoration',
    label: 'Restoration & Consummation',
    shortLabel: 'Restoration',
    description: 'The Spirit empowers the Church; Christ returns to renew all creation in the New Jerusalem.',
    range: [86, 100],
    accent: '#3B82F6', // blue
    icon: '✨'
  }
]

export const bibleStories: BibleStory[] = [
  // IN THE BEGINNING
  { id: 1, title: "Creation", reference: "Genesis 1:1–2:25", category: "IN THE BEGINNING", context: "The foundation of all things. God creates the universe, setting the stage for the Covenant of Creation." },
  { id: 2, title: "The Fall", reference: "Genesis 3:1–3:24", category: "IN THE BEGINNING", context: "Humanity's initial disobedience and the entrance of sin into the world, met with the promise of the Seed." },
  { id: 3, title: "The Flood", reference: "Genesis 6:5–7:24", category: "IN THE BEGINNING", context: "God's judgment on a world filled with violence, while showing mercy to Noah and his family in the Ark." },
  { id: 4, title: "God's Covenant with Noah", reference: "Genesis 8:1–9:17", category: "IN THE BEGINNING", context: "After the flood, God establishes a covenant with creation, promising never again to destroy the earth by water." },
  { id: 5, title: "Tower of Babel", reference: "Genesis 11:1–11:9", category: "IN THE BEGINNING", context: "Humanity's prideful attempt to build a name for themselves independent of God, leading to dispersed languages." },
  
  // ABRAHAM, ISAAC AND JACOB
  { id: 6, title: "The Call of Abram", reference: "Genesis 12:1–12:20", category: "ABRAHAM, ISAAC AND JACOB", context: "The beginning of God's redemptive plan through one family. Abram is called with a promise to bless all nations." },
  { id: 7, title: "God's Covenant with Abram", reference: "Genesis 15:1–15:21", category: "ABRAHAM, ISAAC AND JACOB", context: "God formalizes His promise to Abram, counting his faith as righteousness and ratifying the blood covenant." },
  { id: 8, title: "Hagar and Ishmael", reference: "Genesis 16:1–16:16", category: "ABRAHAM, ISAAC AND JACOB", context: "Abram and Sarai attempt to fulfill God's promise by human effort, producing conflict and hardship." },
  { id: 9, title: "Covenant of Circumcision", reference: "Genesis 17:1–17:27", category: "ABRAHAM, ISAAC AND JACOB", context: "God renames Abraham and Sarah, instituting circumcision as the sign of the covenant of promise." },
  { id: 10, title: "Sodom and Gomorrah", reference: "Genesis 18:16–19:29", category: "ABRAHAM, ISAAC AND JACOB", context: "God's righteous judgment on wicked cities, while Abraham intercedes and Lot is rescued." },
  { id: 11, title: "The Birth of Isaac", reference: "Genesis 21:1–21:21", category: "ABRAHAM, ISAAC AND JACOB", context: "God fulfills His promise as Sarah gives birth to Isaac in her old age, proving His divine faithfulness." },
  { id: 12, title: "The Testing of Abraham", reference: "Genesis 22:1–22:19", category: "ABRAHAM, ISAAC AND JACOB", context: "Abraham's faith is tested on Mount Moriah. God provides a substitute ram, pointing to Christ." },
  { id: 13, title: "Isaac and Rebekah", reference: "Genesis 24:1–24:67", category: "ABRAHAM, ISAAC AND JACOB", context: "Abraham's servant seeks a wife for Isaac, demonstrating God's providential guidance for the covenant line." },
  { id: 14, title: "Jacob and Esau", reference: "Genesis 25:19–25:34", category: "ABRAHAM, ISAAC AND JACOB", context: "The birth of twin brothers and the selling of the birthright, establishing election according to God's purpose." },
  { id: 15, title: "Jacob's Deception", reference: "Genesis 27:1–27:46", category: "ABRAHAM, ISAAC AND JACOB", context: "Jacob deceives his father Isaac to receive the blessing, leading to family conflict and flight." },
  { id: 16, title: "Jacob's Ladder", reference: "Genesis 28:10–28:22", category: "ABRAHAM, ISAAC AND JACOB", context: "Jacob dreams of a ladder to heaven at Bethel; God confirms the covenant of Abraham to him." },
  { id: 17, title: "Jacob Struggles with God", reference: "Genesis 32:22–32:32", category: "ABRAHAM, ISAAC AND JACOB", context: "Jacob wrestles with a divine figure at Peniel, receives the name Israel, and is transformed." },
  
  // JOSEPH AND EGYPT
  { id: 18, title: "Joseph's Dreams", reference: "Genesis 37:1–37:36", category: "JOSEPH AND EGYPT", context: "Joseph's brothers sell him into slavery out of jealousy, but God uses it to preserve the covenant family." },
  { id: 19, title: "Joseph in Potiphar's House", reference: "Genesis 39:1–39:23", category: "JOSEPH AND EGYPT", context: "Joseph resists temptation and maintains integrity, though falsely accused and imprisoned." },
  { id: 20, title: "Joseph Interprets Pharaoh's Dreams", reference: "Genesis 41:1–41:57", category: "JOSEPH AND EGYPT", context: "God enables Joseph to interpret dreams, elevating him to second in command over Egypt." },
  { id: 21, title: "Joseph Reconciles with His Brothers", reference: "Genesis 42:1–45:28", category: "JOSEPH AND EGYPT", context: "Joseph tests and forgives his brothers: 'What you intended for evil, God intended for good.'" },
  { id: 22, title: "Jacob's Family Moves to Egypt", reference: "Genesis 46:1–47:31", category: "JOSEPH AND EGYPT", context: "The covenant family settles in Goshen, surviving the famine under Joseph's care." },
  { id: 23, title: "Israelites Bondage in Egypt", reference: "Exodus 1:1–1:22", category: "JOSEPH AND EGYPT", context: "A new Pharaoh arises who oppresses the growing Israelites, setting the stage for redemption." },
  
  // EXODUS AND THE LAW
  { id: 24, title: "The Birth and Call of Moses", reference: "Exodus 2:1–3:22", category: "EXODUS AND THE LAW", context: "God preserves baby Moses and calls him from the burning bush ('I AM WHO I AM') to deliver Israel." },
  { id: 25, title: "The Ten Plagues", reference: "Exodus 7:14–12:30", category: "EXODUS AND THE LAW", context: "God demonstrates His supremacy over Egypt's idols through mighty plagues culminating in the Passover." },
  { id: 26, title: "Crossing the Red Sea", reference: "Exodus 14:1–14:31", category: "EXODUS AND THE LAW", context: "God parts the Red Sea, delivering Israel and destroying Pharaoh's army—the classic Old Testament redemption." },
  { id: 27, title: "Bread from Heaven and Water from Rock", reference: "Exodus 16:1–17:7", category: "EXODUS AND THE LAW", context: "God provides manna, quail, and water from the rock in the desert, testing Israel's trust." },
  { id: 28, title: "The Ten Commandments at Sinai", reference: "Exodus 19:1–20:21", category: "EXODUS AND THE LAW", context: "God institutes the Mosaic Covenant at Mount Sinai, giving the moral law to His holy nation." },
  { id: 29, title: "The Golden Calf", reference: "Exodus 32:1–32:35", category: "EXODUS AND THE LAW", context: "Israel breaks the covenant by worshiping a golden calf; Moses intercedes for the people." },
  { id: 30, title: "The Tabernacle Completed", reference: "Exodus 40:1–40:38", category: "EXODUS AND THE LAW", context: "The portable dwelling place of God is set up, and His glory fills the Tabernacle." },

  // KINGS, PROPHETS AND EXILE
  { id: 31, title: "The Spies and Israel's Rebellion", reference: "Numbers 13:1–14:45", category: "WILDERNESS AND CONQUEST", context: "Israel fears the giants in Canaan and rebels, resulting in 40 years of wilderness wandering." },
  { id: 32, title: "The Bronze Serpent", reference: "Numbers 21:4–21:9", category: "WILDERNESS AND CONQUEST", context: "Moses lifts up a bronze serpent so that anyone bitten by fiery serpents who looks upon it is healed." },
  { id: 33, title: "Conquest of Jericho", reference: "Joshua 6:1–6:27", category: "WILDERNESS AND CONQUEST", context: "The walls of Jericho fall by faith as Israel obeys God's instructions to march." },
  { id: 34, title: "Gideon's Victory", reference: "Judges 6:1–7:25", category: "JUDGES AND KINGS", context: "God delivers Israel from Midian using Gideon and a small army of 300 to show His power." },
  { id: 35, title: "Ruth and Boaz", reference: "Ruth 1:1–4:22", category: "JUDGES AND KINGS", context: "A story of redemption and kinsman-redeemer in the days of the Judges, leading to King David." },
  { id: 36, title: "The Call of Samuel", reference: "1 Samuel 3:1–3:21", category: "JUDGES AND KINGS", context: "God speaks to young Samuel, establishing him as prophet and last judge of Israel." },
  { id: 37, title: "David Anointed King", reference: "1 Samuel 16:1–16:23", category: "JUDGES AND KINGS", context: "God rejects Saul and directs Samuel to anoint David, looking on the heart rather than appearance." },
  { id: 38, title: "David and Goliath", reference: "1 Samuel 17:1–17:58", category: "JUDGES AND KINGS", context: "David slays the Philistine champion in the name of the Lord of Hosts." },
  { id: 39, title: "Davidic Covenant", reference: "2 Samuel 7:1–7:29", category: "JUDGES AND KINGS", context: "God promises David an everlasting kingdom and throne, fulfilled in Jesus Christ." },
  { id: 40, title: "Solomon Dedicates the Temple", reference: "1 Kings 8:1–8:66", category: "JUDGES AND KINGS", context: "Solomon builds and dedicates the Temple in Jerusalem; God's glory fills the house." },
  { id: 41, title: "Elijah on Mount Carmel", reference: "1 Kings 18:16–18:46", category: "PROPHETS AND EXILE", context: "Elijah confronts the 450 prophets of Baal; God answers by fire, proving He alone is God." },
  { id: 42, title: "Isaiah's Vision of God", reference: "Isaiah 6:1–6:13", category: "PROPHETS AND EXILE", context: "Isaiah sees the Lord high and lifted up, is cleansed by an altar coal, and is sent to preach." },
  { id: 43, title: "The Suffering Servant", reference: "Isaiah 53:1–53:12", category: "PROPHETS AND EXILE", context: "Prophecy of the Messiah wounded for our transgressions and bearing the sin of many." },
  { id: 44, title: "Jeremiah and the New Covenant", reference: "Jeremiah 31:31–31:34", category: "PROPHETS AND EXILE", context: "Jeremiah foretells a New Covenant where God writes His law on hearts and remembers sin no more." },
  { id: 45, title: "Daniel in the Lions' Den", reference: "Daniel 6:1–6:28", category: "PROPHETS AND EXILE", context: "Daniel remains faithful to prayer under Persian persecution; God shuts the lions' mouths." },

  // GOSPELS AND CHRIST (46-85)
  { id: 46, title: "The Birth of Jesus", reference: "Luke 2:1–2:20", category: "CHRIST AND THE GOSPELS", context: "The Word becomes flesh in Bethlehem, announced by angels to humble shepherds." },
  { id: 47, title: "The Baptism of Jesus", reference: "Matthew 3:13–3:17", category: "CHRIST AND THE GOSPELS", context: "Jesus is baptized by John; the Father speaks from heaven and the Spirit descends like a dove." },
  { id: 48, title: "Temptation in the Wilderness", reference: "Matthew 4:1–4:11", category: "CHRIST AND THE GOSPELS", context: "Jesus resists Satan's temptations using Scripture, succeeding where Adam and Israel failed." },
  { id: 49, title: "Sermon on the Mount", reference: "Matthew 5:1–7:29", category: "CHRIST AND THE GOSPELS", context: "Jesus delivers the manifesto of the Kingdom of God, fulfilling the law." },
  { id: 50, title: "Jesus Calms the Storm", reference: "Mark 4:35–4:41", category: "CHRIST AND THE GOSPELS", context: "Jesus commands the wind and waves, demonstrating His divine authority over creation." },
  { id: 51, title: "Feeding of the 5,000", reference: "John 6:1–6:15", category: "CHRIST AND THE GOSPELS", context: "Jesus multiplies five loaves and two fish, revealing Himself as the Bread of Life." },
  { id: 52, title: "Peter's Confession of Christ", reference: "Matthew 16:13–16:20", category: "CHRIST AND THE GOSPELS", context: "Peter confesses Jesus as the Christ, Son of the Living God." },
  { id: 53, title: "The Transfiguration", reference: "Matthew 17:1–17:9", category: "CHRIST AND THE GOSPELS", context: "Jesus' divine glory is unveiled before Peter, James, and John alongside Moses and Elijah." },
  { id: 54, title: "The Good Samaritan", reference: "Luke 10:25–10:37", category: "CHRIST AND THE GOSPELS", context: "Parable demonstrating neighborly love that crosses boundaries." },
  { id: 55, title: "The Prodigal Son", reference: "Luke 15:11–15:32", category: "CHRIST AND THE GOSPELS", context: "Parable displaying the Father's lavish, forgiving grace toward repentant sinners." },
  { id: 56, title: "Raising of Lazarus", reference: "John 11:1–11:44", category: "CHRIST AND THE GOSPELS", context: "Jesus raises Lazarus from the dead: 'I am the Resurrection and the Life.'" },
  { id: 57, title: "The Triumphal Entry", reference: "Matthew 21:1–21:11", category: "CHRIST AND THE GOSPELS", context: "Jesus enters Jerusalem as the humble King riding on a donkey." },
  { id: 58, title: "The Last Supper", reference: "Luke 22:7–22:20", category: "CHRIST AND THE GOSPELS", context: "Jesus institutes the Lord's Supper, pointing to His body broken and blood shed for the New Covenant." },
  { id: 59, title: "Gethsemane", reference: "Matthew 26:36–26:46", category: "CHRIST AND THE GOSPELS", context: "Jesus prays in agony: 'Not my will, but yours be done,' submitting to the Father's cup." },
  { id: 60, title: "The Crucifixion", reference: "John 19:16–19:37", category: "CHRIST AND THE GOSPELS", context: "Jesus is crucified at Calvary, crying 'It is finished!' as He yields His spirit." },
  { id: 61, title: "The Resurrection", reference: "Matthew 28:1–28:10", category: "CHRIST AND THE GOSPELS", context: "The empty tomb reveals Christ's triumph over sin, death, and the grave." },
  { id: 62, title: "The Walk to Emmaus", reference: "Luke 24:13–24:35", category: "CHRIST AND THE GOSPELS", context: "The risen Christ opens the Scriptures, showing how Moses and Prophets spoke of Him." },
  { id: 63, title: "The Great Commission", reference: "Matthew 28:16–28:20", category: "CHRIST AND THE GOSPELS", context: "Jesus commands His disciples to make disciples of all nations." },
  { id: 64, title: "The Ascension", reference: "Acts 1:1–1:11", category: "CHRIST AND THE GOSPELS", context: "Jesus ascends to heaven, promising the Holy Spirit and His return." },

  // EARLY CHURCH AND RESTORATION (86-100)
  { id: 86, title: "Pentecost & The Holy Spirit", reference: "Acts 2:1–2:47", category: "THE CHURCH AND RESTORATION", context: "The Holy Spirit descends on the disciples, empowering the birth of the New Covenant Church." },
  { id: 87, title: "Stephen's Martyrdom", reference: "Acts 6:8–7:60", category: "THE CHURCH AND RESTORATION", context: "Stephen preaches redemptive history and becomes the first Christian martyr." },
  { id: 88, title: "Conversion of Saul", reference: "Acts 9:1–9:31", category: "THE CHURCH AND RESTORATION", context: "The risen Christ meets persecutor Saul on the Damascus road, transforming him into Paul." },
  { id: 89, title: "Gospel to Gentiles (Cornelius)", reference: "Acts 10:1–10:48", category: "THE CHURCH AND RESTORATION", context: "Peter receives a vision and preaches to Gentile Cornelius, showing God accepts all nations." },
  { id: 90, title: "The Jerusalem Council", reference: "Acts 15:1–15:35", category: "THE CHURCH AND RESTORATION", context: "Church leaders affirm salvation is by grace through faith alone without ceremonial law." },
  { id: 91, title: "Paul in Athens (Mars Hill)", reference: "Acts 17:16–17:34", category: "THE CHURCH AND RESTORATION", context: "Paul proclaims the Creator God and Resurrection to Greek philosophers." },
  { id: 92, title: "Armor of God", reference: "Ephesians 6:10–6:20", category: "THE CHURCH AND RESTORATION", context: "Instruction for spiritual warfare using Gospel truth, righteousness, and faith." },
  { id: 93, title: "Hymn of Christ's Humility", reference: "Philippians 2:1–2:11", category: "THE CHURCH AND RESTORATION", context: "Christ emptied Himself, taking the form of a servant, and is exalted above every name." },
  { id: 94, title: "Supremacy of Christ", reference: "Colossians 1:15–1:23", category: "THE CHURCH AND RESTORATION", context: "Christ is the image of the invisible God, firstborn over creation, and head of the Church." },
  { id: 95, title: "Hall of Faith", reference: "Hebrews 11:1–11:40", category: "THE CHURCH AND RESTORATION", context: "Commemoration of Old Testament saints who walked by faith looking for a heavenly city." },
  { id: 96, title: "Living Stones & Royal Priesthood", reference: "1 Peter 2:1–2:10", category: "THE CHURCH AND RESTORATION", context: "Believers are built together into a spiritual house and royal priesthood." },
  { id: 97, title: "God is Love", reference: "1 John 4:7–4:21", category: "THE CHURCH AND RESTORATION", context: "Love is from God; His love was manifested by sending His Son as propitiation." },
  { id: 98, title: "Vision of the Glorified Christ", reference: "Revelation 1:9–1:20", category: "THE CHURCH AND RESTORATION", context: "John sees the exalted Lord holding the keys of Death and Hades." },
  { id: 99, title: "Marriage Supper of the Lamb", reference: "Revelation 19:1–19:10", category: "THE CHURCH AND RESTORATION", context: "Heavenly celebration of Christ and His purified Bride, the Church." },
  { id: 100, title: "New Heavens and New Earth", reference: "Revelation 21:1–22:21", category: "THE CHURCH AND RESTORATION", context: "The grand consummation: God dwells with humanity in the New Jerusalem forever. Maranatha!" }
]

export function getStoryById(id: number): BibleStory {
  return bibleStories.find((s) => s.id === id) || bibleStories[0]
}

export function getMovementForStory(storyId: number): NarrativeMovement {
  return (
    narrativeMovements.find(
      (m) => storyId >= m.range[0] && storyId <= m.range[1]
    ) || narrativeMovements[0]
  )
}

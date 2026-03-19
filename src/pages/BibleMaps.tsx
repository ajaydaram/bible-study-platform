import { useState } from 'react'
import { Map, MapPin, Navigation, Book, ChevronRight, X, ExternalLink } from 'lucide-react'

interface BibleLocation {
  name: string
  modernName?: string
  coordinates: { lat: number; lng: number }
  description: string
  significance: string[]
  references: string[]
  region: string
  period: string[]
}

interface BibleMap {
  id: string
  title: string
  description: string
  period: string
  thumbnail: string
  locations: BibleLocation[]
}

const bibleMaps: BibleMap[] = [
  {
    id: 'patriarchs',
    title: "Journey of the Patriarchs",
    description: "Follow Abraham's journey from Ur to Canaan, and the travels of Isaac and Jacob",
    period: "c. 2000-1800 BC",
    thumbnail: "🏜️",
    locations: [
      {
        name: "Ur of the Chaldees",
        modernName: "Tell el-Muqayyar, Iraq",
        coordinates: { lat: 30.9627, lng: 46.1031 },
        description: "Ancient Sumerian city where Abraham was born and lived before God called him",
        significance: ["Birthplace of Abraham", "Major Sumerian city", "Center of moon god worship"],
        references: ["Genesis 11:28-31", "Genesis 15:7", "Nehemiah 9:7"],
        region: "Mesopotamia",
        period: ["Patriarchal"]
      },
      {
        name: "Haran",
        modernName: "Harran, Turkey",
        coordinates: { lat: 36.8647, lng: 39.0322 },
        description: "City where Abraham's family settled and where he received God's call to go to Canaan",
        significance: ["Abraham's departure point", "Death place of Terah", "Where Jacob fled to Laban"],
        references: ["Genesis 11:31-32", "Genesis 12:4-5", "Genesis 27:43"],
        region: "Upper Mesopotamia",
        period: ["Patriarchal"]
      },
      {
        name: "Shechem",
        modernName: "Nablus, West Bank",
        coordinates: { lat: 32.2141, lng: 35.2689 },
        description: "First place Abraham stopped in Canaan where God promised the land to his descendants",
        significance: ["First altar built by Abraham", "Jacob's well", "Joshua's covenant renewal"],
        references: ["Genesis 12:6-7", "Genesis 33:18-20", "Joshua 24:1"],
        region: "Canaan",
        period: ["Patriarchal", "Conquest"]
      },
      {
        name: "Bethel",
        modernName: "Beitin, West Bank",
        coordinates: { lat: 31.9364, lng: 35.2233 },
        description: "Sacred site where Jacob had his dream of the ladder reaching to heaven",
        significance: ["Jacob's ladder vision", "Abraham built altar", "House of God"],
        references: ["Genesis 12:8", "Genesis 28:10-22", "Genesis 35:1-7"],
        region: "Canaan",
        period: ["Patriarchal"]
      },
      {
        name: "Hebron",
        modernName: "Hebron, West Bank",
        coordinates: { lat: 31.5326, lng: 35.0998 },
        description: "City where Abraham, Isaac, Jacob, and their wives were buried in the Cave of Machpelah",
        significance: ["Cave of Machpelah", "David's first capital", "Abraham's residence"],
        references: ["Genesis 13:18", "Genesis 23:19", "2 Samuel 2:1-4"],
        region: "Canaan",
        period: ["Patriarchal", "United Monarchy"]
      },
      {
        name: "Beersheba",
        modernName: "Be'er Sheva, Israel",
        coordinates: { lat: 31.2518, lng: 34.7913 },
        description: "Southern boundary of Israel where Abraham made a covenant with Abimelech",
        significance: ["Well of the oath", "Isaac built altar", "Southern boundary of Israel"],
        references: ["Genesis 21:31-33", "Genesis 26:23-25", "1 Kings 4:25"],
        region: "Negev",
        period: ["Patriarchal"]
      }
    ]
  },
  {
    id: 'exodus',
    title: "The Exodus Route",
    description: "Trace Israel's journey from Egypt through the wilderness to the Promised Land",
    period: "c. 1446-1406 BC",
    thumbnail: "🌊",
    locations: [
      {
        name: "Goshen",
        modernName: "Wadi Tumilat, Egypt",
        coordinates: { lat: 30.5667, lng: 31.9167 },
        description: "Region in Egypt where the Israelites lived for 430 years before the Exodus",
        significance: ["Israel's home in Egypt", "Spared from plagues", "Starting point of Exodus"],
        references: ["Genesis 45:10", "Genesis 47:6", "Exodus 8:22"],
        region: "Egypt",
        period: ["Egyptian Sojourn"]
      },
      {
        name: "Red Sea Crossing",
        modernName: "Gulf of Aqaba (traditional)",
        coordinates: { lat: 28.7500, lng: 34.7500 },
        description: "Where God miraculously parted the waters for Israel to cross and destroyed Pharaoh's army",
        significance: ["Miraculous deliverance", "Pharaoh's army destroyed", "Song of Moses"],
        references: ["Exodus 14:21-31", "Exodus 15:1-21", "Hebrews 11:29"],
        region: "Sinai",
        period: ["Exodus"]
      },
      {
        name: "Mount Sinai",
        modernName: "Jebel Musa (traditional)",
        coordinates: { lat: 28.5394, lng: 33.9750 },
        description: "Holy mountain where God gave Moses the Ten Commandments and made covenant with Israel",
        significance: ["Ten Commandments given", "Golden calf incident", "Tabernacle instructions"],
        references: ["Exodus 19:1-20:21", "Exodus 24:12-18", "Exodus 32:1-35"],
        region: "Sinai",
        period: ["Exodus"]
      },
      {
        name: "Kadesh Barnea",
        modernName: "Ein el-Qudeirat",
        coordinates: { lat: 30.6167, lng: 34.4167 },
        description: "Major oasis where Israel camped and from where the 12 spies were sent into Canaan",
        significance: ["Spies sent to Canaan", "Israel's rebellion", "38 years wandering decreed"],
        references: ["Numbers 13:26", "Numbers 20:1", "Deuteronomy 1:46"],
        region: "Wilderness",
        period: ["Exodus", "Wilderness"]
      },
      {
        name: "Mount Nebo",
        modernName: "Mount Nebo, Jordan",
        coordinates: { lat: 31.7672, lng: 35.7253 },
        description: "Mountain where Moses viewed the Promised Land before his death",
        significance: ["Moses viewed Promised Land", "Moses' death", "End of wilderness journey"],
        references: ["Deuteronomy 32:49", "Deuteronomy 34:1-6"],
        region: "Moab",
        period: ["Wilderness"]
      }
    ]
  },
  {
    id: 'conquest',
    title: "Conquest of Canaan",
    description: "Joshua's military campaigns to conquer the Promised Land",
    period: "c. 1406-1375 BC",
    thumbnail: "⚔️",
    locations: [
      {
        name: "Jericho",
        modernName: "Tell es-Sultan",
        coordinates: { lat: 31.8710, lng: 35.4440 },
        description: "First city conquered in Canaan, its walls fell after Israel marched around it seven days",
        significance: ["First conquest", "Walls fell miraculously", "Rahab saved"],
        references: ["Joshua 2:1-24", "Joshua 6:1-27", "Hebrews 11:30-31"],
        region: "Jordan Valley",
        period: ["Conquest"]
      },
      {
        name: "Ai",
        modernName: "Et-Tell (disputed)",
        coordinates: { lat: 31.9175, lng: 35.2597 },
        description: "City near Bethel where Israel was initially defeated due to Achan's sin",
        significance: ["Achan's sin", "Initial defeat", "Second victory"],
        references: ["Joshua 7:1-26", "Joshua 8:1-29"],
        region: "Central Hill Country",
        period: ["Conquest"]
      },
      {
        name: "Gibeon",
        modernName: "El-Jib",
        coordinates: { lat: 31.8467, lng: 35.1856 },
        description: "City that deceived Joshua into making peace, later the site where the sun stood still",
        significance: ["Deceptive treaty", "Sun stood still", "Tabernacle location"],
        references: ["Joshua 9:3-27", "Joshua 10:12-14", "1 Kings 3:4-5"],
        region: "Central Hill Country",
        period: ["Conquest", "United Monarchy"]
      },
      {
        name: "Hazor",
        modernName: "Tell el-Qedah",
        coordinates: { lat: 33.0167, lng: 35.5667 },
        description: "Largest Canaanite city in the north, conquered and burned by Joshua",
        significance: ["Head of northern kingdoms", "Destroyed by Joshua", "Later rebuilt by Solomon"],
        references: ["Joshua 11:1-13", "Judges 4:2", "1 Kings 9:15"],
        region: "Upper Galilee",
        period: ["Conquest", "Judges", "United Monarchy"]
      }
    ]
  },
  {
    id: 'davidic',
    title: "David's Kingdom",
    description: "The united monarchy under David and Solomon at its greatest extent",
    period: "c. 1010-930 BC",
    thumbnail: "👑",
    locations: [
      {
        name: "Jerusalem",
        modernName: "Jerusalem, Israel",
        coordinates: { lat: 31.7683, lng: 35.2137 },
        description: "The holy city captured by David, made capital of Israel, where Solomon built the Temple",
        significance: ["City of David", "Solomon's Temple", "Center of worship"],
        references: ["2 Samuel 5:6-10", "1 Kings 6:1-38", "Psalm 122:1-9"],
        region: "Judean Hills",
        period: ["United Monarchy", "Divided Kingdom", "New Testament"]
      },
      {
        name: "Bethlehem",
        modernName: "Bethlehem, West Bank",
        coordinates: { lat: 31.7054, lng: 35.2024 },
        description: "David's hometown, where Samuel anointed him king, and birthplace of Jesus",
        significance: ["David's birthplace", "Ruth and Boaz", "Jesus' birthplace"],
        references: ["1 Samuel 16:1-13", "Ruth 4:11", "Matthew 2:1"],
        region: "Judean Hills",
        period: ["United Monarchy", "New Testament"]
      },
      {
        name: "Ziklag",
        modernName: "Tel Sera (possible)",
        coordinates: { lat: 31.3167, lng: 34.6833 },
        description: "Philistine city given to David by Achish of Gath during his exile from Saul",
        significance: ["David's base in exile", "Amalekite raid", "News of Saul's death"],
        references: ["1 Samuel 27:6", "1 Samuel 30:1-31", "2 Samuel 1:1"],
        region: "Negev",
        period: ["United Monarchy"]
      },
      {
        name: "Tyre",
        modernName: "Tyre, Lebanon",
        coordinates: { lat: 33.2705, lng: 35.2038 },
        description: "Phoenician city whose king Hiram supplied materials and craftsmen for the Temple",
        significance: ["Alliance with David/Solomon", "Temple materials", "Trading partner"],
        references: ["2 Samuel 5:11", "1 Kings 5:1-12", "1 Kings 9:11-14"],
        region: "Phoenicia",
        period: ["United Monarchy"]
      }
    ]
  },
  {
    id: 'jesus',
    title: "Life of Jesus",
    description: "Key locations in the ministry, death, and resurrection of Jesus Christ",
    period: "c. 4 BC - 30 AD",
    thumbnail: "✝️",
    locations: [
      {
        name: "Bethlehem",
        modernName: "Bethlehem, West Bank",
        coordinates: { lat: 31.7054, lng: 35.2024 },
        description: "Birthplace of Jesus, fulfilling Micah's prophecy about the Messiah's origin",
        significance: ["Jesus' birth", "Visit of shepherds", "Visit of Magi"],
        references: ["Matthew 2:1-12", "Luke 2:1-20", "Micah 5:2"],
        region: "Judea",
        period: ["New Testament"]
      },
      {
        name: "Nazareth",
        modernName: "Nazareth, Israel",
        coordinates: { lat: 32.6996, lng: 35.3035 },
        description: "Jesus' hometown where He grew up and was rejected in the synagogue",
        significance: ["Jesus' childhood home", "Rejected by hometown", "Annunciation to Mary"],
        references: ["Luke 1:26-38", "Luke 2:39-40", "Luke 4:16-30"],
        region: "Galilee",
        period: ["New Testament"]
      },
      {
        name: "Capernaum",
        modernName: "Kfar Nahum",
        coordinates: { lat: 32.8803, lng: 35.5750 },
        description: "Jesus' base of ministry in Galilee, home of Peter, site of many miracles",
        significance: ["Jesus' ministry base", "Peter's house", "Many healings"],
        references: ["Matthew 4:13", "Matthew 8:5-17", "Mark 2:1-12"],
        region: "Galilee",
        period: ["New Testament"]
      },
      {
        name: "Sea of Galilee",
        modernName: "Lake Kinneret",
        coordinates: { lat: 32.8231, lng: 35.5831 },
        description: "Lake where Jesus called His disciples, calmed the storm, and walked on water",
        significance: ["Disciples called", "Jesus walked on water", "Storm calmed"],
        references: ["Matthew 4:18-22", "Matthew 14:22-33", "Mark 4:35-41"],
        region: "Galilee",
        period: ["New Testament"]
      },
      {
        name: "Mount of Transfiguration",
        modernName: "Mount Tabor (traditional)",
        coordinates: { lat: 32.6867, lng: 35.3900 },
        description: "Mountain where Jesus was transfigured before Peter, James, and John",
        significance: ["Transfiguration", "Moses and Elijah appeared", "Voice from heaven"],
        references: ["Matthew 17:1-9", "Mark 9:2-8", "2 Peter 1:16-18"],
        region: "Galilee",
        period: ["New Testament"]
      },
      {
        name: "Jerusalem - Temple Mount",
        modernName: "Haram al-Sharif",
        coordinates: { lat: 31.7781, lng: 35.2353 },
        description: "Where Jesus taught, cleansed the temple, and was tried before His crucifixion",
        significance: ["Temple teaching", "Cleansing the temple", "Passion week events"],
        references: ["John 2:13-22", "Matthew 21:12-16", "Matthew 26:57-68"],
        region: "Judea",
        period: ["New Testament"]
      },
      {
        name: "Golgotha",
        modernName: "Church of Holy Sepulchre (traditional)",
        coordinates: { lat: 31.7785, lng: 35.2296 },
        description: "The place of the skull where Jesus was crucified for the sins of the world",
        significance: ["Crucifixion of Jesus", "Atonement accomplished", "Victory over sin"],
        references: ["Matthew 27:33-56", "John 19:17-30", "Hebrews 13:12"],
        region: "Judea",
        period: ["New Testament"]
      },
      {
        name: "Mount of Olives",
        modernName: "Mount of Olives, Jerusalem",
        coordinates: { lat: 31.7781, lng: 35.2458 },
        description: "Where Jesus taught, prayed in Gethsemane, and ascended to heaven",
        significance: ["Olivet Discourse", "Garden of Gethsemane", "Ascension"],
        references: ["Matthew 24-25", "Matthew 26:36-46", "Acts 1:9-12"],
        region: "Judea",
        period: ["New Testament"]
      }
    ]
  },
  {
    id: 'paul',
    title: "Paul's Missionary Journeys",
    description: "Follow the apostle Paul's three missionary journeys spreading the Gospel",
    period: "c. 46-58 AD",
    thumbnail: "🚢",
    locations: [
      {
        name: "Antioch (Syrian)",
        modernName: "Antakya, Turkey",
        coordinates: { lat: 36.2028, lng: 36.1597 },
        description: "The church that commissioned Paul and Barnabas; believers first called Christians here",
        significance: ["Mission sending church", "Christians first named", "Paul's home base"],
        references: ["Acts 11:26", "Acts 13:1-3", "Acts 14:26-28"],
        region: "Syria",
        period: ["New Testament"]
      },
      {
        name: "Cyprus",
        modernName: "Cyprus",
        coordinates: { lat: 35.1264, lng: 33.4299 },
        description: "Island where Paul began his first missionary journey and confronted the sorcerer Elymas",
        significance: ["First missionary journey begins", "Sergius Paulus converted", "Barnabas' homeland"],
        references: ["Acts 13:4-12", "Acts 15:39"],
        region: "Mediterranean",
        period: ["New Testament"]
      },
      {
        name: "Philippi",
        modernName: "Near Kavala, Greece",
        coordinates: { lat: 41.0117, lng: 24.2872 },
        description: "First European city to receive the Gospel; Lydia converted, Paul imprisoned",
        significance: ["First church in Europe", "Lydia's conversion", "Jailer's conversion"],
        references: ["Acts 16:11-40", "Philippians 1:1"],
        region: "Macedonia",
        period: ["New Testament"]
      },
      {
        name: "Athens",
        modernName: "Athens, Greece",
        coordinates: { lat: 37.9838, lng: 23.7275 },
        description: "Where Paul preached on Mars Hill about the unknown god to Greek philosophers",
        significance: ["Mars Hill sermon", "Unknown god", "Some believed"],
        references: ["Acts 17:16-34"],
        region: "Greece",
        period: ["New Testament"]
      },
      {
        name: "Corinth",
        modernName: "Near Corinth, Greece",
        coordinates: { lat: 37.9060, lng: 22.8788 },
        description: "Major city where Paul stayed 18 months and founded a significant church",
        significance: ["18-month ministry", "Two epistles written to church", "Aquila and Priscilla"],
        references: ["Acts 18:1-18", "1 Corinthians 1:2", "2 Corinthians 1:1"],
        region: "Greece",
        period: ["New Testament"]
      },
      {
        name: "Ephesus",
        modernName: "Near Selçuk, Turkey",
        coordinates: { lat: 37.9411, lng: 27.3419 },
        description: "Major city where Paul ministered three years; riot of silversmiths occurred",
        significance: ["Three-year ministry", "School of Tyrannus", "Silversmith riot"],
        references: ["Acts 19:1-41", "Acts 20:17-38", "Ephesians 1:1"],
        region: "Asia Minor",
        period: ["New Testament"]
      },
      {
        name: "Rome",
        modernName: "Rome, Italy",
        coordinates: { lat: 41.9028, lng: 12.4964 },
        description: "Capital of the empire where Paul was imprisoned and wrote several epistles",
        significance: ["Paul's imprisonment", "Prison epistles written", "Martyrdom tradition"],
        references: ["Acts 28:16-31", "Romans 1:7", "Philippians 1:13"],
        region: "Italy",
        period: ["New Testament"]
      }
    ]
  }
]

export default function BibleMaps() {
  const [selectedMap, setSelectedMap] = useState<BibleMap | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<BibleLocation | null>(null)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Map className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bible Maps</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore the geography and locations of Biblical events
          </p>
        </div>
      </div>

      {/* Map Categories */}
      {!selectedMap && (
        <div className="grid sm:grid-cols-2 gap-4">
          {bibleMaps.map((map) => (
            <button
              key={map.id}
              onClick={() => setSelectedMap(map)}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-left hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{map.thumbnail}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {map.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {map.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                      {map.period}
                    </span>
                    <span className="text-xs text-gray-400">
                      {map.locations.length} locations
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Map View */}
      {selectedMap && !selectedLocation && (
        <div className="space-y-4">
          {/* Back Button */}
          <button
            onClick={() => setSelectedMap(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to all maps
          </button>

          {/* Map Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{selectedMap.thumbnail}</div>
              <div>
                <h2 className="text-2xl font-bold">{selectedMap.title}</h2>
                <p className="text-green-100 mt-1">{selectedMap.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-white/20 rounded">
                  {selectedMap.period}
                </span>
              </div>
            </div>
          </div>

          {/* Locations List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Key Locations ({selectedMap.locations.length})
            </h3>
            {selectedMap.locations.map((location, index) => (
              <button
                key={location.name}
                onClick={() => setSelectedLocation(location)}
                className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-left hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                        {location.name}
                      </h4>
                      {location.modernName && (
                        <span className="text-xs text-gray-400">
                          ({location.modernName})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {location.description}
                    </p>
                  </div>
                  <MapPin className="h-5 w-5 text-gray-400 group-hover:text-green-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedLocation(null)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-white" />
                  <div>
                    <span className="text-green-100 text-sm">{selectedLocation.region}</span>
                    <h2 className="text-2xl font-bold text-white">{selectedLocation.name}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Modern Name & Coordinates */}
              <div className="flex flex-wrap gap-4">
                {selectedLocation.modernName && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Modern Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLocation.modernName}</p>
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Coordinates</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedLocation.coordinates.lat.toFixed(4)}°, {selectedLocation.coordinates.lng.toFixed(4)}°
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedLocation.description}
                </p>
              </div>

              {/* Significance */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Biblical Significance</h3>
                <ul className="space-y-2">
                  {selectedLocation.significance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scripture References */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Scripture References</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.references.map(ref => (
                    <span
                      key={ref}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium"
                    >
                      📖 {ref}
                    </span>
                  ))}
                </div>
              </div>

              {/* Period Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Biblical Period</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.period.map(p => (
                    <span
                      key={p}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* View on Map Button */}
              <a
                href={`https://www.google.com/maps?q=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              >
                <Navigation className="h-4 w-4" />
                View on Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <h3 className="font-medium text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
          <Book className="h-4 w-4" />
          About Bible Maps
        </h3>
        <p className="text-sm text-green-800 dark:text-green-300">
          These maps help you visualize the geography of Biblical events. Each location includes its modern name, 
          coordinates, historical significance, and relevant Scripture references. Click "View on Google Maps" 
          to see the actual location on a satellite map.
        </p>
      </div>
    </div>
  )
}

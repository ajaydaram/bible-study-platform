/**
 * Synchronized Four-Gospel Harmony Dataset
 * Chronological order of Jesus' life and ministry mapped across Matthew, Mark, Luke, and John
 */

export interface GospelParallel {
  id: string
  episodeTitle: string
  period: 'Incarnation & Early Life' | 'Inauguration & Early Ministry' | 'Great Galilean Ministry' | 'Later Judean & Perea' | 'Passion Week' | 'Crucifixion & Burial' | 'Resurrection & Ascension'
  matthew?: string
  mark?: string
  luke?: string
  john?: string
  location: string
  theologicalTheme: string
  uniqueTo?: 'Matthew' | 'Mark' | 'Luke' | 'John'
}

export const GOSPEL_HARMONY_DATA: GospelParallel[] = [
  // 1. Incarnation & Early Life
  {
    id: 'gh-1',
    episodeTitle: 'The Eternal Word / Prologue',
    period: 'Incarnation & Early Life',
    john: '1:1-18',
    location: 'Eternity / Heaven',
    theologicalTheme: 'The Incarnation of the Divine Logos',
    uniqueTo: 'John'
  },
  {
    id: 'gh-2',
    episodeTitle: 'The Genealogies of Jesus Christ',
    period: 'Incarnation & Early Life',
    matthew: '1:1-17',
    luke: '3:23-38',
    location: 'Bethlehem / Nazareth',
    theologicalTheme: 'Royal Lineage of David & Seed of Abraham (Universal Son of Adam)'
  },
  {
    id: 'gh-3',
    episodeTitle: 'The Birth of Jesus Announced to Mary (The Annunciation)',
    period: 'Incarnation & Early Life',
    luke: '1:26-38',
    location: 'Nazareth',
    theologicalTheme: 'Virgin Conception by the Holy Spirit',
    uniqueTo: 'Luke'
  },
  {
    id: 'gh-4',
    episodeTitle: 'The Nativity in Bethlehem & Shepherds’ Visit',
    period: 'Incarnation & Early Life',
    matthew: '1:18-25',
    luke: '2:1-20',
    location: 'Bethlehem',
    theologicalTheme: 'Humility of the Manger & Emmanuel ("God with us")'
  },
  {
    id: 'gh-5',
    episodeTitle: 'The Visit of the Magi & Flight to Egypt',
    period: 'Incarnation & Early Life',
    matthew: '2:1-23',
    location: 'Bethlehem & Egypt',
    theologicalTheme: 'Gentile Homage to the King & Out of Egypt Typology',
    uniqueTo: 'Matthew'
  },

  // 2. Inauguration & Early Ministry
  {
    id: 'gh-6',
    episodeTitle: 'Ministry of John the Baptist',
    period: 'Inauguration & Early Ministry',
    matthew: '3:1-12',
    mark: '1:1-8',
    luke: '3:1-20',
    john: '1:19-28',
    location: 'Judean Wilderness & Jordan',
    theologicalTheme: 'Elijah’s Voice Preparing the Way of the LORD'
  },
  {
    id: 'gh-7',
    episodeTitle: 'The Baptism of Jesus',
    period: 'Inauguration & Early Ministry',
    matthew: '3:13-17',
    mark: '1:9-11',
    luke: '3:21-22',
    john: '1:29-34',
    location: 'Jordan River',
    theologicalTheme: 'Trinitarian Manifestation & Anointing of the Messiah'
  },
  {
    id: 'gh-8',
    episodeTitle: 'The Temptation in the Wilderness',
    period: 'Inauguration & Early Ministry',
    matthew: '4:1-11',
    mark: '1:12-13',
    luke: '4:1-13',
    location: 'Judean Wilderness',
    theologicalTheme: 'The Second Adam Triumphant Over the Tempter'
  },
  {
    id: 'gh-9',
    episodeTitle: 'First Miracle: Water into Wine at Cana',
    period: 'Inauguration & Early Ministry',
    john: '2:1-12',
    location: 'Cana in Galilee',
    theologicalTheme: 'The Messianic Wedding Banquet & Glory Revealed',
    uniqueTo: 'John'
  },
  {
    id: 'gh-10',
    episodeTitle: 'Jesus and Nicodemus (The New Birth)',
    period: 'Inauguration & Early Ministry',
    john: '3:1-21',
    location: 'Jerusalem',
    theologicalTheme: 'Regeneration by the Spirit & The Lifted-Up Serpent',
    uniqueTo: 'John'
  },
  {
    id: 'gh-11',
    episodeTitle: 'The Woman at the Well (Living Water)',
    period: 'Inauguration & Early Ministry',
    john: '4:1-42',
    location: 'Sychar in Samaria',
    theologicalTheme: 'Worship in Spirit & Truth to Outcasts and Gentiles',
    uniqueTo: 'John'
  },

  // 3. Great Galilean Ministry
  {
    id: 'gh-12',
    episodeTitle: 'The Sermon on the Mount / Plain',
    period: 'Great Galilean Ministry',
    matthew: '5:1–7:29',
    luke: '6:20-49',
    location: 'Hills of Galilee',
    theologicalTheme: 'Kingdom Righteousness, Beatitudes & Heart Holiness'
  },
  {
    id: 'gh-13',
    episodeTitle: 'Calming the Storm on the Sea of Galilee',
    period: 'Great Galilean Ministry',
    matthew: '8:23-27',
    mark: '4:35-41',
    luke: '8:22-25',
    location: 'Sea of Galilee',
    theologicalTheme: 'Sovereignty of Christ over Creation ("Who is this?")'
  },
  {
    id: 'gh-14',
    episodeTitle: 'Feeding of the Five Thousand',
    period: 'Great Galilean Ministry',
    matthew: '14:13-21',
    mark: '6:30-44',
    luke: '9:10-17',
    john: '6:1-14',
    location: 'Bethsaida (Sea of Galilee)',
    theologicalTheme: 'Bread of Life: Miracle Recorded in All Four Gospels'
  },
  {
    id: 'gh-15',
    episodeTitle: 'The Bread of Life Discourse',
    period: 'Great Galilean Ministry',
    john: '6:22-71',
    location: 'Capernaum Synagogue',
    theologicalTheme: 'True Manna from Heaven & Sovereign Drawing of the Father',
    uniqueTo: 'John'
  },
  {
    id: 'gh-16',
    episodeTitle: 'Peter’s Confession of Christ at Caesarea Philippi',
    period: 'Great Galilean Ministry',
    matthew: '16:13-20',
    mark: '8:27-30',
    luke: '9:18-21',
    location: 'Caesarea Philippi',
    theologicalTheme: 'The Rock of the Church & Christ the Son of the Living God'
  },
  {
    id: 'gh-17',
    episodeTitle: 'The Transfiguration',
    period: 'Great Galilean Ministry',
    matthew: '17:1-13',
    mark: '9:2-13',
    luke: '9:28-36',
    location: 'Mount Hermon / Tabor',
    theologicalTheme: 'Glimpse of Eschatological Glory with Moses and Elijah'
  },

  // 4. Later Judean & Perea Ministry
  {
    id: 'gh-18',
    episodeTitle: 'The Good Samaritan Parable',
    period: 'Later Judean & Perea',
    luke: '10:25-37',
    location: 'Road to Jericho',
    theologicalTheme: 'True Neighbor Love & Radical Mercy',
    uniqueTo: 'Luke'
  },
  {
    id: 'gh-19',
    episodeTitle: 'The Prodigal Son & The Lost Sheep/Coin',
    period: 'Later Judean & Perea',
    luke: '15:1-32',
    location: 'Perea',
    theologicalTheme: 'The Father’s Boundless Joy in Repentance',
    uniqueTo: 'Luke'
  },
  {
    id: 'gh-20',
    episodeTitle: 'The Raising of Lazarus',
    period: 'Later Judean & Perea',
    john: '11:1-44',
    location: 'Bethany',
    theologicalTheme: 'I am the Resurrection and the Life',
    uniqueTo: 'John'
  },

  // 5. Passion Week
  {
    id: 'gh-21',
    episodeTitle: 'The Triumphal Entry into Jerusalem (Palm Sunday)',
    period: 'Passion Week',
    matthew: '21:1-11',
    mark: '11:1-11',
    luke: '19:28-44',
    john: '12:12-19',
    location: 'Mount of Olives & Jerusalem',
    theologicalTheme: 'Zechariah 9:9 Fulfillment: Humble King on a Colt'
  },
  {
    id: 'gh-22',
    episodeTitle: 'Cleansing of the Temple',
    period: 'Passion Week',
    matthew: '21:12-17',
    mark: '11:15-19',
    luke: '19:45-48',
    location: 'Jerusalem Temple',
    theologicalTheme: 'My House Shall Be a House of Prayer for All Nations'
  },
  {
    id: 'gh-23',
    episodeTitle: 'The Olivet Discourse (The Signs of the End)',
    period: 'Passion Week',
    matthew: '24:1–25:46',
    mark: '13:1-37',
    luke: '21:5-36',
    location: 'Mount of Olives',
    theologicalTheme: 'Destruction of the Temple, Second Coming, & Sheep and Goats'
  },
  {
    id: 'gh-24',
    episodeTitle: 'The Last Supper & Institution of the Lord’s Supper',
    period: 'Passion Week',
    matthew: '26:20-30',
    mark: '14:17-26',
    luke: '22:14-23',
    john: '13:1-30',
    location: 'Upper Room, Jerusalem',
    theologicalTheme: 'The Blood of the New Covenant Poured Out for Many'
  },
  {
    id: 'gh-25',
    episodeTitle: 'The Upper Room Discourse & High Priestly Prayer',
    period: 'Passion Week',
    john: '14:1–17:26',
    location: 'Upper Room & Gethsemane Way',
    theologicalTheme: 'The Holy Spirit, The True Vine, & Jesus’ Intercession',
    uniqueTo: 'John'
  },
  {
    id: 'gh-26',
    episodeTitle: 'Agony in Gethsemane & Arrest',
    period: 'Passion Week',
    matthew: '26:36-56',
    mark: '14:32-52',
    luke: '22:39-53',
    john: '18:1-12',
    location: 'Garden of Gethsemane',
    theologicalTheme: 'Not My Will, But Thine Be Done & The Cup of Wrath'
  },

  // 6. Crucifixion & Burial
  {
    id: 'gh-27',
    episodeTitle: 'The Trials before Sanhedrin and Pontius Pilate',
    period: 'Crucifixion & Burial',
    matthew: '26:57–27:26',
    mark: '14:53–15:15',
    luke: '22:54–23:25',
    john: '18:13–19:16',
    location: 'Praetorium, Jerusalem',
    theologicalTheme: 'The Innocent Lamb Sentenced for the Guilty'
  },
  {
    id: 'gh-28',
    episodeTitle: 'The Crucifixion at Golgotha',
    period: 'Crucifixion & Burial',
    matthew: '27:32-56',
    mark: '15:21-41',
    luke: '23:26-49',
    john: '19:17-37',
    location: 'Golgotha / Calvary',
    theologicalTheme: 'Substitutionary Atonement ("It is finished!")'
  },
  {
    id: 'gh-29',
    episodeTitle: 'The Burial in Joseph of Arimathea’s Tomb',
    period: 'Crucifixion & Burial',
    matthew: '27:57-66',
    mark: '15:42-47',
    luke: '23:50-56',
    john: '19:38-42',
    location: 'Garden Tomb, Jerusalem',
    theologicalTheme: 'Isaiah 53:9 Fulfillment: With the Rich in His Death'
  },

  // 7. Resurrection & Ascension
  {
    id: 'gh-30',
    episodeTitle: 'The Empty Tomb & Resurrection Morning',
    period: 'Resurrection & Ascension',
    matthew: '28:1-10',
    mark: '16:1-8',
    luke: '24:1-12',
    john: '20:1-10',
    location: 'Garden Tomb',
    theologicalTheme: 'Triumph Over Death: "He is Not Here, He is Risen!"'
  },
  {
    id: 'gh-31',
    episodeTitle: 'The Road to Emmaus (Christ in All the Scriptures)',
    period: 'Resurrection & Ascension',
    luke: '24:13-35',
    location: 'Road to Emmaus',
    theologicalTheme: 'Moses and All the Prophets Pointing to Jesus',
    uniqueTo: 'Luke'
  },
  {
    id: 'gh-32',
    episodeTitle: 'The Great Commission',
    period: 'Resurrection & Ascension',
    matthew: '28:16-20',
    mark: '16:15-18',
    location: 'Mountain in Galilee',
    theologicalTheme: 'All Authority in Heaven and on Earth: Make Disciples of All Nations'
  },
  {
    id: 'gh-33',
    episodeTitle: 'The Ascension into Glory',
    period: 'Resurrection & Ascension',
    mark: '16:19-20',
    luke: '24:50-53',
    location: 'Mount of Olives, Bethany',
    theologicalTheme: 'Exaltation to the Right Hand of the Father & Everlasting Reign'
  }
]

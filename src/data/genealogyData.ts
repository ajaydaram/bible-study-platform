/**
 * Biblical Genealogies & Dynasty Explorer Dataset
 * Comprehensive kinship graphs for Patriarchs, Davidic Royal Line, Aaronite Priesthood, and Herodian Dynasty
 */

export interface BiblicalPerson {
  id: string
  name: string
  hebrewName?: string
  greekName?: string
  meaning?: string
  title: string
  gender: 'male' | 'female'
  dates?: string
  tribe?: string
  fatherId?: string
  motherId?: string
  spouseIds?: string[]
  childrenIds?: string[]
  keyVerses: string[]
  bio: string
  theologicalSignificance: string
}

export interface DynastyTree {
  id: string
  title: string
  subtitle: string
  category: 'patriarchs' | 'davidic' | 'aaronite' | 'herodian'
  description: string
  rootPersonId: string
  personIds: string[]
}

export const BIBLICAL_PEOPLE_DATABASE: Record<string, BiblicalPerson> = {
  // === 1. PATRIARCHS & THE 12 TRIBES ===
  'terah': {
    id: 'terah',
    name: 'Terah',
    hebrewName: 'תֶּרַח',
    meaning: 'Delay / Wanderer',
    title: 'Father of Abraham, Nahor, and Haran',
    gender: 'male',
    dates: 'c. 2126–1921 BC (Lived 205 yrs)',
    tribe: 'Semite / Arphaxad Line',
    childrenIds: ['abraham', 'nahor', 'haran', 'sarah'],
    keyVerses: ['Genesis 11:26-32', 'Joshua 24:2'],
    bio: 'Descendant of Shem who journeyed from Ur of the Chaldees to Haran where he died.',
    theologicalSignificance: 'Joshua 24:2 notes Terah served other gods across the Euphrates before God called Abraham by sovereign grace.'
  },
  'abraham': {
    id: 'abraham',
    name: 'Abraham',
    hebrewName: 'אַבְרָהָם',
    meaning: 'Father of a Multitude',
    title: 'Friend of God & Father of Faith',
    gender: 'male',
    dates: 'c. 2166–1991 BC (Lived 175 yrs)',
    tribe: 'Patriarch',
    fatherId: 'terah',
    spouseIds: ['sarah', 'hagar', 'keturah'],
    childrenIds: ['isaac', 'ishmael', 'zimran', 'jokshan', 'medan', 'midian', 'ishbak', 'shuah'],
    keyVerses: ['Genesis 12:1-3', 'Genesis 15:6', 'Romans 4:1-3', 'Galatians 3:6-9', 'Hebrews 11:8-19'],
    bio: 'Called by God out of Ur to inherit Canaan; father of the covenant people through Isaac.',
    theologicalSignificance: 'The archetype of justification by faith alone (Gen 15:6; Rom 4:3). Recipient of the unconditional Abrahamic Covenant.'
  },
  'sarah': {
    id: 'sarah',
    name: 'Sarah',
    hebrewName: 'שָׂרָה',
    meaning: 'Princess',
    title: 'Mother of the Covenant Seed',
    gender: 'female',
    dates: 'c. 2156–2029 BC (Lived 127 yrs)',
    tribe: 'Patriarch',
    fatherId: 'terah',
    spouseIds: ['abraham'],
    childrenIds: ['isaac'],
    keyVerses: ['Genesis 17:15-19', 'Genesis 21:1-7', 'Galatians 4:21-31', '1 Peter 3:6'],
    bio: 'Barren until age 90, God miraculously fulfilled His promise by giving birth to Isaac.',
    theologicalSignificance: 'Represents the Jerusalem above and the covenant of free grace (Gal 4:26).'
  },
  'hagar': {
    id: 'hagar',
    name: 'Hagar',
    hebrewName: 'הָגָר',
    meaning: 'Flight / Stranger',
    title: 'Egyptian Maid of Sarah & Mother of Ishmael',
    gender: 'female',
    tribe: 'Egyptian',
    spouseIds: ['abraham'],
    childrenIds: ['ishmael'],
    keyVerses: ['Genesis 16:1-16', 'Genesis 21:8-21', 'Galatians 4:21-31'],
    bio: 'Egyptian servant given to Abraham; encountered God in the desert (El Roi: "The God who sees me").',
    theologicalSignificance: 'Paul allegorizes Hagar as Mount Sinai and the covenant of works bearing children into slavery (Gal 4:24-25).'
  },
  'ishmael': {
    id: 'ishmael',
    name: 'Ishmael',
    hebrewName: 'יִשְׁמָעֵאל',
    meaning: 'God Hears',
    title: 'Firstborn Son of Abraham & Progenitor of 12 Princes',
    gender: 'male',
    dates: 'c. 2080–1943 BC (Lived 137 yrs)',
    tribe: 'Ishmaelite',
    fatherId: 'abraham',
    motherId: 'hagar',
    keyVerses: ['Genesis 16:11-16', 'Genesis 17:20', 'Genesis 25:12-18'],
    bio: 'Son of Abraham according to the flesh; father of the nomadic Arab nations.',
    theologicalSignificance: 'Typifies the natural birth according to human striving versus the supernatural child of promise (Gal 4:23).'
  },
  'isaac': {
    id: 'isaac',
    name: 'Isaac',
    hebrewName: 'יִצְחָק',
    meaning: 'He Laughs',
    title: 'Son of the Promise',
    gender: 'male',
    dates: 'c. 2066–1886 BC (Lived 180 yrs)',
    tribe: 'Patriarch',
    fatherId: 'abraham',
    motherId: 'sarah',
    spouseIds: ['rebekah'],
    childrenIds: ['jacob', 'esau'],
    keyVerses: ['Genesis 21:1-5', 'Genesis 22:1-19', 'Romans 9:7-9', 'Hebrews 11:17-20'],
    bio: 'Miraculously conceived child of promise offered up on Mount Moriah (the Akedah); heir to the Abrahamic blessing.',
    theologicalSignificance: 'Type of Christ as the beloved only Son offered by the Father, carrying the wood of sacrifice.'
  },
  'rebekah': {
    id: 'rebekah',
    name: 'Rebekah',
    hebrewName: 'רִבְקָה',
    meaning: 'Ensnarer / Tied Securely',
    title: 'Wife of Isaac & Mother of Jacob and Esau',
    gender: 'female',
    tribe: 'Aramaean (Bethuel line)',
    spouseIds: ['isaac'],
    childrenIds: ['jacob', 'esau'],
    keyVerses: ['Genesis 24:1-67', 'Genesis 25:21-28', 'Romans 9:10-13'],
    bio: 'Daughter of Bethuel brought from Haran to marry Isaac; received divine oracle that "the older shall serve the younger".',
    theologicalSignificance: 'Romans 9:10-13 highlights God’s sovereign unconditional election of Jacob before the twins were born.'
  },
  'esau': {
    id: 'esau',
    name: 'Esau (Edom)',
    hebrewName: 'עֵשָׂו',
    meaning: 'Hairy / Red',
    title: 'Firstborn of Isaac & Father of Edomites',
    gender: 'male',
    tribe: 'Edomite',
    fatherId: 'isaac',
    motherId: 'rebekah',
    keyVerses: ['Genesis 25:25-34', 'Genesis 27:1-40', 'Hebrews 12:16-17', 'Malachi 1:2-3'],
    bio: 'Skillful hunter who traded his birthright for a bowl of red stew.',
    theologicalSignificance: 'Warning against godlessness and despising spiritual inheritance (Hebrews 12:16).'
  },
  'jacob': {
    id: 'jacob',
    name: 'Jacob (Israel)',
    hebrewName: 'יַעֲקֹב / יִשְׂרָאֵל',
    meaning: 'Heel Catcher / Strives with God',
    title: 'Father of the Twelve Tribes of Israel',
    gender: 'male',
    dates: 'c. 2006–1859 BC (Lived 147 yrs)',
    tribe: 'Israel',
    fatherId: 'isaac',
    motherId: 'rebekah',
    spouseIds: ['leah', 'rachel', 'bilhah', 'zilpah'],
    childrenIds: ['reuben', 'simeon', 'levi', 'judah', 'dan', 'naphtali', 'gad', 'asher', 'issachar', 'zebulun', 'joseph', 'benjamin', 'dinah'],
    keyVerses: ['Genesis 28:10-22', 'Genesis 32:24-32', 'Genesis 49:1-28', 'Romans 9:11-13'],
    bio: 'Wrestled with the Angel of the LORD at Peniel; received the name Israel; blessed his 12 sons in Egypt before death.',
    theologicalSignificance: 'Demonstrates God’s transforming covenant grace turning a supplanter into a prince with God.'
  },
  'leah': {
    id: 'leah',
    name: 'Leah',
    hebrewName: 'לֵאָה',
    meaning: 'Weary',
    title: 'First Wife of Jacob & Mother of Judah and Levi',
    gender: 'female',
    spouseIds: ['jacob'],
    childrenIds: ['reuben', 'simeon', 'levi', 'judah', 'issachar', 'zebulun', 'dinah'],
    keyVerses: ['Genesis 29:16-35', 'Ruth 4:11'],
    bio: 'Laban’s elder daughter who was unloved yet chosen by God to bear the priestly (Levi) and royal (Judah) lines.',
    theologicalSignificance: 'God exalts the unloved and humble to accomplish redemptive history.'
  },
  'rachel': {
    id: 'rachel',
    name: 'Rachel',
    hebrewName: 'רָחֵל',
    meaning: 'Ewe',
    title: 'Beloved Wife of Jacob & Mother of Joseph and Benjamin',
    gender: 'female',
    spouseIds: ['jacob'],
    childrenIds: ['joseph', 'benjamin'],
    keyVerses: ['Genesis 29:1-30', 'Genesis 30:22-24', 'Genesis 35:16-20', 'Jeremiah 31:15', 'Matthew 2:18'],
    bio: 'Jacob’s deeply loved wife who died giving birth to Benjamin near Bethlehem.',
    theologicalSignificance: 'Figure of mourning for Israel’s exiles and the Bethlehem innocents (Jer 31:15; Matt 2:18).'
  },
  'judah': {
    id: 'judah',
    name: 'Judah',
    hebrewName: 'יְהוּדָה',
    meaning: 'Praise',
    title: '4th Son of Jacob & Forefather of the King of Kings',
    gender: 'male',
    fatherId: 'jacob',
    motherId: 'leah',
    childrenIds: ['perez', 'zerah'],
    keyVerses: ['Genesis 44:18-34', 'Genesis 49:8-10', 'Revelation 5:5'],
    bio: 'Offered himself as substitute for Benjamin before Joseph; received the royal blessing: "The scepter shall not depart from Judah until Shiloh comes."',
    theologicalSignificance: 'Ancestral line of Jesus Christ, the Lion of the Tribe of Judah (Rev 5:5).'
  },
  'joseph': {
    id: 'joseph',
    name: 'Joseph',
    hebrewName: 'יוֹסֵף',
    meaning: 'May He Add',
    title: 'Savior of the Ancient World & Prime Minister of Egypt',
    gender: 'male',
    dates: 'c. 1915–1805 BC (Lived 110 yrs)',
    fatherId: 'jacob',
    motherId: 'rachel',
    childrenIds: ['ephraim', 'manasseh'],
    keyVerses: ['Genesis 37–50', 'Genesis 50:20', 'Acts 7:9-14', 'Hebrews 11:22'],
    bio: 'Betrayed into slavery by brothers, exalted to rule Egypt, preserved his family from famine.',
    theologicalSignificance: 'Pristine Old Testament type of Christ: innocent suffering, rejection by brothers, humiliation, and supreme exaltation to save the world.'
  },
  'levi': {
    id: 'levi',
    name: 'Levi',
    hebrewName: 'לֵוִי',
    meaning: 'Attached / Joined',
    title: '3rd Son of Jacob & Father of the Priesthood',
    gender: 'male',
    fatherId: 'jacob',
    motherId: 'leah',
    childrenIds: ['kohath', 'gershon', 'merari'],
    keyVerses: ['Genesis 29:34', 'Genesis 49:5-7', 'Exodus 32:26-29', 'Malachi 2:4-7'],
    bio: 'His descendants were set apart to serve the Tabernacle and minister before the LORD.',
    theologicalSignificance: 'The Levitical priesthood foreshadows Christ, the ultimate Great High Priest.'
  },

  // === 2. ROYAL DAVIDIC LINEAGE TO CHRIST ===
  'perez': {
    id: 'perez',
    name: 'Perez',
    hebrewName: 'פֶּרֶץ',
    meaning: 'Breach',
    title: 'Son of Judah and Tamar',
    gender: 'male',
    fatherId: 'judah',
    childrenIds: ['hezron'],
    keyVerses: ['Genesis 38:29', 'Ruth 4:18-22', 'Matthew 1:3'],
    bio: 'Born through Tamar, establishing the royal lineage through the tribe of Judah.',
    theologicalSignificance: 'Recorded in Matthew 1:3 showing God’s sovereign grace working through broken human stories.'
  },
  'boaz': {
    id: 'boaz',
    name: 'Boaz',
    hebrewName: 'בֹּעַז',
    meaning: 'In Strength',
    title: 'Kinsman-Redeemer of Bethlehem',
    gender: 'male',
    tribe: 'Judah',
    spouseIds: ['ruth'],
    childrenIds: ['obed'],
    keyVerses: ['Ruth 2–4', 'Matthew 1:5'],
    bio: 'Righteous Bethlehem landowner who redeemed Ruth the Moabitess under the levirate law.',
    theologicalSignificance: 'Type of Jesus Christ as our Goel (Kinsman-Redeemer) who redeems Gentile outcasts by grace.'
  },
  'ruth': {
    id: 'ruth',
    name: 'Ruth',
    hebrewName: 'רוּת',
    meaning: 'Friend / Companion',
    title: 'Moabitess Forebearer of King David and Christ',
    gender: 'female',
    tribe: 'Moabite (Graft in to Israel)',
    spouseIds: ['boaz'],
    childrenIds: ['obed'],
    keyVerses: ['Ruth 1:16-17', 'Ruth 4:13-17', 'Matthew 1:5'],
    bio: 'Forsook Moabite idols to cling to the God of Israel ("Your people shall be my people, and your God my God").',
    theologicalSignificance: 'Displays Gentile inclusion in the Messianic genealogy.'
  },
  'jesse': {
    id: 'jesse',
    name: 'Jesse',
    hebrewName: 'יִשַׁי',
    meaning: 'Gift / Wealth',
    title: 'Father of King David of Bethlehem',
    gender: 'male',
    tribe: 'Judah',
    childrenIds: ['david'],
    keyVerses: ['1 Samuel 16:1-13', 'Isaiah 11:1', 'Romans 15:12'],
    bio: 'Bethlehemite farmer who had 8 sons, the youngest of whom was David.',
    theologicalSignificance: 'Isaiah 11:1 prophesies: "There shall come forth a shoot from the stump of Jesse, and a branch from his roots shall bear fruit."'
  },
  'david': {
    id: 'david',
    name: 'King David',
    hebrewName: 'דָּוִד',
    meaning: 'Beloved',
    title: 'King of Israel & Man After God’s Own Heart',
    gender: 'male',
    dates: 'c. 1040–970 BC (Reigned 40 yrs)',
    tribe: 'Judah',
    fatherId: 'jesse',
    spouseIds: ['bathsheba'],
    childrenIds: ['solomon', 'nathan'],
    keyVerses: ['1 Samuel 16:12-13', '2 Samuel 7:12-16', 'Psalm 23', 'Matthew 1:1', 'Luke 1:32-33'],
    bio: 'Shepherd boy who slew Goliath, unified Israel, established Jerusalem as capital, and received the unconditional Davidic Covenant.',
    theologicalSignificance: 'Recipient of the Davidic Covenant guaranteeing an eternal throne fulfilled in Jesus, the Son of David.'
  },
  'bathsheba': {
    id: 'bathsheba',
    name: 'Bathsheba',
    hebrewName: 'בַּת־שֶׁבַע',
    meaning: 'Daughter of the Oath',
    title: 'Queen Mother & Mother of Solomon',
    gender: 'female',
    spouseIds: ['david'],
    childrenIds: ['solomon', 'nathan'],
    keyVerses: ['2 Samuel 11–12', '1 Kings 1:11-31', 'Matthew 1:6'],
    bio: 'Wife of Uriah the Hittite, later wife of David; mother of King Solomon.',
    theologicalSignificance: 'Included in Matthew 1:6 ("wife of Uriah"), showing sovereign redemption overcoming sin.'
  },
  'solomon': {
    id: 'solomon',
    name: 'King Solomon (Jedidiah)',
    hebrewName: 'שְׁלֹמֹה',
    meaning: 'Peaceable',
    title: 'Builder of the First Temple & King of Glory',
    gender: 'male',
    dates: 'c. 990–931 BC (Reigned 40 yrs)',
    tribe: 'Judah (Royal King Line)',
    fatherId: 'david',
    motherId: 'bathsheba',
    childrenIds: ['rehoboam'],
    keyVerses: ['1 Kings 3–11', 'Proverbs 1:1', 'Matthew 12:42'],
    bio: 'Endowed with supreme wisdom, built the magnificent Jerusalem Temple, expanded Israel’s borders to its golden apex.',
    theologicalSignificance: 'Matthew 1:6–16 traces Christ’s legal royal throne succession through Solomon.'
  },
  'nathan_david': {
    id: 'nathan_david',
    name: 'Nathan (Son of David)',
    hebrewName: 'נָתָן',
    meaning: 'Giver',
    title: 'Son of David and Bathsheba',
    gender: 'male',
    tribe: 'Judah',
    fatherId: 'david',
    motherId: 'bathsheba',
    childrenIds: ['mattatha'],
    keyVerses: ['2 Samuel 5:14', '1 Chronicles 3:5', 'Luke 3:31', 'Zechariah 12:12'],
    bio: 'Third son of David born in Jerusalem.',
    theologicalSignificance: 'Luke 3:31 traces Christ’s physical biological descent from David through Nathan to Mary.'
  },
  'zerubbabel': {
    id: 'zerubbabel',
    name: 'Zerubbabel',
    hebrewName: 'זְרֻבָּבֶל',
    meaning: 'Sown in Babylon',
    title: 'Governor of Judah & Rebuilder of Second Temple',
    gender: 'male',
    dates: 'c. 538–515 BC',
    tribe: 'Judah',
    keyVerses: ['Ezra 3:2', 'Haggai 2:23', 'Zechariah 4:6-9', 'Matthew 1:12', 'Luke 3:27'],
    bio: 'Led the first wave of Jewish exiles back to Jerusalem; rebuilt the foundations of the Temple.',
    theologicalSignificance: 'Named the LORD’s "signet ring" in Haggai 2:23, bridging both Matthew and Luke genealogies.'
  },
  'joseph_carpenter': {
    id: 'joseph_carpenter',
    name: 'Joseph of Nazareth',
    hebrewName: 'יוֹסֵף',
    meaning: 'May He Add',
    title: 'Legal Earthly Father of Jesus Christ',
    gender: 'male',
    tribe: 'Judah (Davidic heir)',
    spouseIds: ['mary_mother'],
    childrenIds: ['jesus_christ', 'james_brother', 'jude_brother'],
    keyVerses: ['Matthew 1:18-25', 'Luke 2:1-7', 'Matthew 13:55'],
    bio: 'Righteous craftsman of Nazareth who obediently married Mary and raised the Son of God.',
    theologicalSignificance: 'Conferred legal right to David’s royal throne upon Jesus without physical seed inheritance.'
  },
  'mary_mother': {
    id: 'mary_mother',
    name: 'Mary of Nazareth',
    hebrewName: 'מִרְיָם',
    meaning: 'Beloved / Exalted',
    title: 'The Virgin Mother of the Messiah (Theotokos)',
    gender: 'female',
    tribe: 'Judah (Davidic line via Nathan)',
    spouseIds: ['joseph_carpenter'],
    childrenIds: ['jesus_christ', 'james_brother', 'jude_brother'],
    keyVerses: ['Luke 1:26-38', 'Luke 1:46-55 (Magnificat)', 'John 19:25-27', 'Acts 1:14'],
    bio: 'Virgin betrothed to Joseph who conceived the Son of God through the overshadowing of the Holy Spirit.',
    theologicalSignificance: 'Fulfillment of Isaiah 7:14 and Genesis 3:15 ("seed of the woman").'
  },
  'jesus_christ': {
    id: 'jesus_christ',
    name: 'Jesus Christ',
    hebrewName: 'יֵשׁוּעַ הַמָּשִׁיחַ',
    greekName: 'Ἰησοῦς Χριστός',
    meaning: 'Yahweh is Salvation / The Anointed King',
    title: 'King of Kings, Lord of Lords, Son of God',
    gender: 'male',
    dates: 'c. 4 BC – AD 30/33',
    tribe: 'Judah (Root and Offspring of David)',
    motherId: 'mary_mother',
    keyVerses: ['Matthew 1:1', 'Luke 1:31-33', 'John 1:1-14', 'Colossians 1:15-20', 'Revelation 22:16'],
    bio: 'The Eternal Word made flesh; lived a sinless life, died as substitutionary atonement for sinners, and rose bodily on the third day.',
    theologicalSignificance: 'The focal climax and fulfillment of every biblical genealogy, covenant, prophecy, and sacrifice.'
  },

  // === 3. AARONITE HIGH PRIESTHOOD ===
  'amram': {
    id: 'amram',
    name: 'Amram',
    hebrewName: 'עַמְרָם',
    meaning: 'Exalted People',
    title: 'Father of Moses, Aaron, and Miriam',
    gender: 'male',
    tribe: 'Levi (Kohath line)',
    childrenIds: ['aaron', 'moses', 'miriam'],
    keyVerses: ['Exodus 6:20', 'Numbers 26:59', 'Hebrews 11:23'],
    bio: 'Faithful Levite who in faith hid baby Moses from Pharaoh’s death decree for three months.',
    theologicalSignificance: 'Hebrews 11:23 commends the faith of Moses’ parents refusing fear of the king’s edict.'
  },
  'aaron': {
    id: 'aaron',
    name: 'Aaron',
    hebrewName: 'אַהֲרֹן',
    meaning: 'Light Bringer / Mountain of Strength',
    title: 'First High Priest of Israel',
    gender: 'male',
    dates: 'c. 1529–1406 BC (Lived 123 yrs)',
    tribe: 'Levi',
    fatherId: 'amram',
    childrenIds: ['nadab', 'abihu', 'eleazar', 'ithamar'],
    keyVerses: ['Exodus 4:14', 'Exodus 28:1-3', 'Leviticus 16:1-34', 'Hebrews 5:1-4'],
    bio: 'Spokesman for Moses; consecrated as the first High Priest to wear the Urim and Thummim and enter the Holy of Holies on Yom Kippur.',
    theologicalSignificance: 'The Aaronic order is the prototype of all priestly intercession, superseded by Christ’s Melchizedekian priesthood (Heb 7).'
  },
  'moses': {
    id: 'moses',
    name: 'Moses',
    hebrewName: 'מֹשֶׁה',
    meaning: 'Drawn Out',
    title: 'Lawgiver & Prophet of the Old Covenant',
    gender: 'male',
    dates: 'c. 1526–1406 BC (Lived 120 yrs)',
    tribe: 'Levi',
    fatherId: 'amram',
    keyVerses: ['Exodus 3:1-15', 'Deuteronomy 34:10-12', 'John 1:17', 'Hebrews 3:1-6'],
    bio: 'Led Israel out of Egyptian bondage, mediated the Sinai Covenant, and received the Torah.',
    theologicalSignificance: 'Typifies Christ as Prophet and Mediator of a far better covenant (Hebrews 3:5-6).'
  },
  'eleazar': {
    id: 'eleazar',
    name: 'Eleazar',
    hebrewName: 'אֶלְעָזָר',
    meaning: 'God Has Helped',
    title: '2nd High Priest of Israel',
    gender: 'male',
    tribe: 'Levi',
    fatherId: 'aaron',
    childrenIds: ['phinehas'],
    keyVerses: ['Numbers 20:25-28', 'Joshua 24:33'],
    bio: 'Invested with Aaron’s high priestly garments upon Mount Hor; assisted Joshua in dividing the Promised Land.',
    theologicalSignificance: 'Preserved the legitimate high priestly line following Nadab and Abihu’s death.'
  },
  'phinehas': {
    id: 'phinehas',
    name: 'Phinehas',
    hebrewName: 'פִּינְחָס',
    meaning: 'Mouth of Brass / Nubian',
    title: '3rd High Priest & Recipient of Covenant of Peace',
    gender: 'male',
    tribe: 'Levi',
    fatherId: 'eleazar',
    keyVerses: ['Numbers 25:6-13', 'Psalm 106:30-31'],
    bio: 'Turned away God’s wrath at Baal of Peor with zealous action; granted a "covenant of perpetual priesthood."',
    theologicalSignificance: 'Psalm 106:31 states "it was counted to him as righteousness," linking holy zeal with covenant peace.'
  },
  'zadok': {
    id: 'zadok',
    name: 'Zadok',
    hebrewName: 'צָדוֹק',
    meaning: 'Righteous',
    title: 'High Priest under David and Solomon',
    gender: 'male',
    tribe: 'Levi (Eleazar line)',
    keyVerses: ['2 Samuel 15:24-29', '1 Kings 1:32-45', 'Ezekiel 44:15-16'],
    bio: 'Remained fiercely loyal to David during Absalom and Adonijah’s rebellions; anointed Solomon as king.',
    theologicalSignificance: 'Ezekiel 44:15 singles out "the sons of Zadok" as the faithful priests who kept charge of God’s sanctuary.'
  },

  // === 4. HERODIAN DYNASTY ===
  'herod_the_great': {
    id: 'herod_the_great',
    name: 'Herod the Great',
    greekName: 'Ἡρῴδης ὁ Μέγας',
    title: 'King of the Jews (Roman Client Ruler)',
    gender: 'male',
    dates: '73–4 BC (Reigned 37–4 BC)',
    tribe: 'Idumean (Edomite descent)',
    spouseIds: ['mariamne', 'malthace', 'cleopatra_jerusalem'],
    childrenIds: ['archelaus', 'herod_antipas', 'philip_tetrarch', 'aristobulus_iv'],
    keyVerses: ['Matthew 2:1-19', 'Luke 1:5'],
    bio: 'Master builder who reconstructed the Second Temple; ruthlessly ordered the slaughter of the Bethlehem infants.',
    theologicalSignificance: 'Typifies earthly despotic tyrants raging against the Messiah King (Psalm 2; Matthew 2).'
  },
  'herod_antipas': {
    id: 'herod_antipas',
    name: 'Herod Antipas',
    greekName: 'Ἡρῴδης Ἀντίπας',
    title: 'Tetrarch of Galilee and Perea',
    gender: 'male',
    dates: '20 BC – AD 39',
    tribe: 'Idumean',
    fatherId: 'herod_the_great',
    motherId: 'malthace',
    spouseIds: ['herodias'],
    keyVerses: ['Matthew 14:1-12', 'Luke 9:7-9', 'Luke 13:31-32', 'Luke 23:6-12'],
    bio: 'Executed John the Baptist for rebuking his incestuous marriage to Herodias; mocked Jesus during His Passion trial.',
    theologicalSignificance: 'Jesus labeled him "that fox" (Luke 13:32); fulfilled Psalm 2:2 alongside Pontius Pilate (Acts 4:27).'
  },
  'herod_agrippa_i': {
    id: 'herod_agrippa_i',
    name: 'Herod Agrippa I',
    greekName: 'Ἡρῴδης Ἀγρίππας Α΄',
    title: 'King of Judea (Grandson of Herod the Great)',
    gender: 'male',
    dates: '11 BC – AD 44',
    tribe: 'Idumean / Hasmonean',
    childrenIds: ['herod_agrippa_ii', 'bernice', 'drusilla'],
    keyVerses: ['Acts 12:1-24'],
    bio: 'Persecuted early Jerusalem Church, martyred James the son of Zebedee, imprisoned Peter; struck down by an angel for receiving divine worship.',
    theologicalSignificance: 'Acts 12:23 demonstrates God’s swift judgment on rulers who usurp divine glory.'
  },
  'herod_agrippa_ii': {
    id: 'herod_agrippa_ii',
    name: 'Herod Agrippa II',
    greekName: 'Ἡρῴδης Ἀγρίππας Β΄',
    title: 'King of Chalcis & Northern Judea',
    gender: 'male',
    dates: 'AD 27–93',
    tribe: 'Idumean',
    fatherId: 'herod_agrippa_i',
    keyVerses: ['Acts 25:13–26:32'],
    bio: 'Expert in Jewish customs before whom the Apostle Paul defended the Gospel at Caesarea Maritima.',
    theologicalSignificance: 'Famous response to Paul: "In a short time would you persuade me to be a Christian?" (Acts 26:28).'
  }
}

export const DYNASTY_TREES_DATA: DynastyTree[] = [
  {
    id: 'patriarchs',
    title: 'The Patriarchs & 12 Tribes',
    subtitle: 'From Terah & Abraham to the 12 Sons of Israel',
    category: 'patriarchs',
    description: 'Trace the genesis of God’s chosen covenant people from Abraham’s call out of Ur through Isaac, Jacob, and the 12 tribal patriarchs.',
    rootPersonId: 'terah',
    personIds: ['terah', 'abraham', 'sarah', 'hagar', 'ishmael', 'isaac', 'rebekah', 'esau', 'jacob', 'leah', 'rachel', 'judah', 'joseph', 'levi']
  },
  {
    id: 'davidic-christ',
    title: 'The Royal Davidic Line to Christ',
    subtitle: 'Matthew 1 (Legal King) vs. Luke 3 (Flesh/Seed)',
    category: 'davidic',
    description: 'Explore the royal succession from King David through Solomon and Nathan culminating in Jesus Christ, the eternal King of Kings.',
    rootPersonId: 'jesse',
    personIds: ['boaz', 'ruth', 'jesse', 'david', 'bathsheba', 'solomon', 'nathan_david', 'zerubbabel', 'joseph_carpenter', 'mary_mother', 'jesus_christ']
  },
  {
    id: 'aaronite-priesthood',
    title: 'The Aaronite High Priesthood',
    subtitle: 'From Aaron to Phinehas & Zadok',
    category: 'aaronite',
    description: 'The sacred lineage of high priests consecrated to enter the Holy of Holies with sacrificial blood, foreshadowing Christ the Great High Priest.',
    rootPersonId: 'amram',
    personIds: ['amram', 'moses', 'aaron', 'eleazar', 'phinehas', 'zadok']
  },
  {
    id: 'herodian-dynasty',
    title: 'The Herodian Dynasty in the NT',
    subtitle: 'From Herod the Great to Agrippa II',
    category: 'herodian',
    description: 'The Roman-backed client rulers governing Judea, Galilee, and Perea during the Gospel narratives and the birth of the Apostolic Church.',
    rootPersonId: 'herod_the_great',
    personIds: ['herod_the_great', 'herod_antipas', 'herod_agrippa_i', 'herod_agrippa_ii']
  }
]

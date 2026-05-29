// Scriptorium Pulse - Theological Diagnostic Questions
// 49 Questions across 5 Categories

export interface PulseQuestion {
  id: number
  text: string
  category: string
  categoryId: number
  biblicalAnswer: 'agree' | 'disagree' | 'neutral'
  scripturalInsight: string
  references: string[]
  isNew?: boolean
}

export interface PulseCategory {
  id: number
  name: string
  shortName: string
  description: string
  color: string
  icon: string
}

export const pulseCategories: PulseCategory[] = [
  {
    id: 1,
    name: "Theology of the Body & Sexuality",
    shortName: "Body & Sexuality",
    description: "Understanding God's design for human embodiment and sexuality",
    color: "#8B5CF6", // purple
    icon: "🫀"
  },
  {
    id: 2,
    name: "Singleness & The Kingdom Vocation",
    shortName: "Singleness",
    description: "The dignity and calling of the single life in God's Kingdom",
    color: "#EC4899", // pink
    icon: "👤"
  },
  {
    id: 3,
    name: "Marriage & Relationships",
    shortName: "Marriage",
    description: "Biblical foundations for marriage and covenant relationships",
    color: "#F59E0B", // amber
    icon: "💍"
  },
  {
    id: 4,
    name: "Kingdom Kinship & Family",
    shortName: "Kingdom Family",
    description: "Understanding spiritual vs. biological family in God's economy",
    color: "#10B981", // emerald
    icon: "👨‍👩‍👧‍👦"
  },
  {
    id: 5,
    name: "Eschatology (The Future State)",
    shortName: "Eschatology",
    description: "What Scripture teaches about resurrection and the age to come",
    color: "#3B82F6", // blue
    icon: "✨"
  }
]

export const pulseQuestions: PulseQuestion[] = [
  // ===== CATEGORY 1: Theology of the Body & Sexuality =====
  {
    id: 1,
    text: "Human beings are created by God to be sexual beings.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'agree',
    scripturalInsight: "Genesis reveals that God created humanity as male and female, with sexuality as part of His 'very good' design. Our embodied, gendered existence reflects God's intentional creation.",
    references: ["Genesis 1:27", "Genesis 1:31", "Genesis 2:18-25"]
  },
  {
    id: 2,
    text: "Same-sex attraction varies from person to person.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'agree',
    scripturalInsight: "Scripture acknowledges the diversity of human temptation and struggle. Same-sex attraction, like all forms of disordered desire, varies in intensity and experience among individuals.",
    references: ["1 Corinthians 10:13", "James 1:14-15"]
  },
  {
    id: 3,
    text: "Same-sex attraction is the same as homosexual practice.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Scripture distinguishes between temptation and sin. Experiencing attraction is not the same as acting on it. Jesus Himself was tempted yet without sin, showing temptation itself is not sinful.",
    references: ["Hebrews 4:15", "James 1:14-15", "Matthew 5:28"]
  },
  {
    id: 4,
    text: "The presence of temptation in our lives shows we have sinned.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus was tempted in every way yet was without sin. Temptation is not sin; yielding to temptation is. The presence of temptation shows our humanity, not our guilt.",
    references: ["Hebrews 4:15", "Matthew 4:1-11", "James 1:13-15"]
  },
  {
    id: 5,
    text: "Acting on temptation is sin.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'agree',
    scripturalInsight: "James clearly teaches that when desire conceives, it gives birth to sin. The progression from temptation to action is the moment sin enters. Resisting temptation is obedience.",
    references: ["James 1:14-15", "Romans 6:12-14", "1 Corinthians 10:13"]
  },
  {
    id: 6,
    text: "Sexuality forms the essential part of our being.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'disagree',
    scripturalInsight: "While sexuality is significant, our essential identity is found in being image-bearers of God and, for believers, being 'in Christ.' Our sexuality is part of us but not the defining core of who we are.",
    references: ["Genesis 1:27", "2 Corinthians 5:17", "Galatians 3:28", "Colossians 3:3"]
  },
  {
    id: 7,
    text: "Every person faces some variety and degree of sexual temptation.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'agree',
    scripturalInsight: "Scripture teaches that temptation is universal to humanity. No temptation is unique to any individual. This includes sexual temptation, which all people face in various forms.",
    references: ["1 Corinthians 10:13", "James 1:14", "Romans 3:23"]
  },
  {
    id: 8,
    text: "We constantly relate to others as gendered beings.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'agree',
    scripturalInsight: "God created humanity male and female. Our gender is part of our embodied existence and shapes how we relate to one another in community, family, and the church.",
    references: ["Genesis 1:27", "Genesis 2:18-23", "1 Corinthians 11:11-12"]
  },
  {
    id: 9,
    text: "Masturbation is the solution to sexual desire.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Scripture calls believers to self-control as a fruit of the Spirit, not self-gratification. Sexual desire is to be directed toward marital union or channeled through discipline and prayer.",
    references: ["Galatians 5:22-23", "1 Thessalonians 4:3-5", "1 Corinthians 6:18-20"]
  },
  {
    id: 10,
    text: "Watching pornography is good preparation, or help, for marriage.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus taught that lustful looking is adultery of the heart. Pornography objectifies people, distorts God's design for intimacy, and damages the capacity for genuine marital love.",
    references: ["Matthew 5:28", "Job 31:1", "Ephesians 5:3", "Philippians 4:8"]
  },
  {
    id: 11,
    text: "The human sexual organs indicate the sexuality of the human being.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'agree',
    scripturalInsight: "Scripture presents our bodies as meaningful. Our physical form as male or female is part of God's good design and reveals our created nature as gendered beings.",
    references: ["Genesis 1:27", "Genesis 2:21-23", "Psalm 139:13-14"]
  },
  {
    id: 12,
    text: "A single Christian lacks the 'other half' needed to fully reflect God's image.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Each individual fully bears God's image. Jesus, the 'image of the invisible God,' was single. Humanity corporately reflects God's image, but no individual is incomplete without a spouse.",
    references: ["Genesis 1:27", "Colossians 1:15", "2 Corinthians 3:18"],
    isNew: true
  },
  {
    id: 13,
    text: "Jesus' primary identity was defined by his family lineage and potential for marriage.",
    category: "Theology of the Body & Sexuality",
    categoryId: 1,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus' identity was rooted in His relationship with the Father. Though the genealogies show His human lineage, His primary identity was as the Son of God and Messiah, not family status.",
    references: ["John 5:19-20", "Luke 2:49", "Matthew 3:17", "John 8:58"],
    isNew: true
  },

  // ===== CATEGORY 2: Singleness & The Kingdom Vocation =====
  {
    id: 14,
    text: "Single Christians should not express their sexuality.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Singles are still gendered, embodied people. They express their sexuality appropriately through godly relationships, community, and service—not through sexual activity, but through relational wholeness.",
    references: ["1 Corinthians 7:7-8", "Romans 12:1", "1 Thessalonians 4:3-4"]
  },
  {
    id: 15,
    text: "A single Christian woman has Jesus as her husband.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'disagree',
    scripturalInsight: "While Christ is the Bridegroom of the Church (collectively), this metaphor doesn't make Jesus a literal husband to individual women. Singles find their sufficiency in Christ, but the relationship is spiritual, not romantic.",
    references: ["Ephesians 5:25-27", "Revelation 19:7", "2 Corinthians 11:2"]
  },
  {
    id: 16,
    text: "Celibacy is the highest level of spirituality.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Paul calls both marriage and singleness 'gifts.' Neither state is spiritually superior. Faithfulness in one's calling, whether married or single, is what matters to God.",
    references: ["1 Corinthians 7:7", "1 Corinthians 7:17", "Hebrews 13:4"]
  },
  {
    id: 17,
    text: "Jesus spoke about singleness.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'agree',
    scripturalInsight: "Jesus explicitly spoke about those who are 'eunuchs for the sake of the kingdom of heaven,' honoring those who forego marriage for Kingdom purposes. He Himself modeled this calling.",
    references: ["Matthew 19:10-12"]
  },
  {
    id: 18,
    text: "Singles should intentionally be in community with others.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'agree',
    scripturalInsight: "The New Testament consistently emphasizes the importance of community for all believers. Singles especially need and can offer rich relationships within the body of Christ.",
    references: ["Hebrews 10:24-25", "Acts 2:42-47", "Romans 12:10", "Galatians 6:2"]
  },
  {
    id: 19,
    text: "Singles should not minister to married couples as they have no experience of marriage.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus and Paul, both single, gave profound teaching on marriage. Ministry effectiveness comes from the Spirit's gifting and Scripture, not personal experience of every situation.",
    references: ["Matthew 19:3-9", "1 Corinthians 7", "Ephesians 5:22-33"]
  },
  {
    id: 20,
    text: "The Bible verses for spiritual growth for singles are the same as for the marrieds.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'agree',
    scripturalInsight: "The commands to love God, pursue holiness, serve others, and grow in Christ apply equally to all believers regardless of marital status. The path of discipleship is the same.",
    references: ["Matthew 22:37-40", "Galatians 5:22-23", "2 Peter 3:18", "Colossians 3:1-17"]
  },
  {
    id: 21,
    text: "Singleness is a 'waiting room' to be endured until marriage.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Paul presents singleness as a gift that enables undivided devotion to the Lord. It is not a deficient state but a valid calling with unique Kingdom advantages.",
    references: ["1 Corinthians 7:7-8", "1 Corinthians 7:32-35", "Matthew 19:12"],
    isNew: true
  },
  {
    id: 22,
    text: "St. Paul argues that singleness allows for 'undivided devotion' to the Lord that marriage can complicate.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'agree',
    scripturalInsight: "Paul explicitly states that the unmarried person can be concerned about the Lord's affairs, while the married must balance devotion to spouse and God. This is practical, not a critique of marriage.",
    references: ["1 Corinthians 7:32-35"],
    isNew: true
  },
  {
    id: 23,
    text: "Success in the Christian life is primarily measured by the health of one's nuclear family.",
    category: "Singleness & The Kingdom Vocation",
    categoryId: 2,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus measured success by faithfulness, love for God, and love for neighbor. Paul, unmarried, was highly fruitful. Family health matters, but it's not the primary metric of spiritual success.",
    references: ["Matthew 25:21", "Matthew 22:37-40", "John 15:8", "Galatians 5:22-23"],
    isNew: true
  },

  // ===== CATEGORY 3: Marriage & Relationships =====
  {
    id: 24,
    text: "Sexuality is only to be expressed in the context of marriage between one man and one woman.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'agree',
    scripturalInsight: "From Genesis through the New Testament, Scripture consistently reserves sexual intimacy for the covenant of marriage between husband and wife.",
    references: ["Genesis 2:24", "Matthew 19:4-6", "Hebrews 13:4", "1 Corinthians 7:2"]
  },
  {
    id: 25,
    text: "Your virginity is a gift to your future marriage partner.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'neutral',
    scripturalInsight: "While sexual purity honors God and future spouses, our primary motivation should be obedience to God, not merely preserving something for a future partner who may never come. Christ's redemption restores all believers.",
    references: ["1 Corinthians 6:18-20", "1 Thessalonians 4:3-4", "2 Corinthians 5:17"]
  },
  {
    id: 26,
    text: "Singles should understand what the Bible teaches about marriage and divorce.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'agree',
    scripturalInsight: "All believers benefit from understanding God's design for marriage, whether for potential future marriage, ministry to others, or understanding the Christ-Church relationship it symbolizes.",
    references: ["Ephesians 5:31-32", "Matthew 19:3-9", "Malachi 2:16"]
  },
  {
    id: 27,
    text: "The most fulfilling human experience is through sexual intercourse.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Scripture teaches that knowing God, loving others, and fulfilling our calling bring ultimate fulfillment. Many saints, including Jesus and Paul, lived profoundly fulfilling lives without sexual intercourse.",
    references: ["Psalm 16:11", "John 17:3", "Philippians 3:8", "John 15:11"]
  },
  {
    id: 28,
    text: "Homosexual singles should try to be heterosexually married.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Marriage requires genuine attraction and commitment. Entering marriage without these can harm both spouses. Those with same-sex attraction may be called to faithful singleness rather than inauthentic marriage.",
    references: ["1 Corinthians 7:7-9", "Matthew 19:10-12", "1 Corinthians 7:17"]
  },
  {
    id: 29,
    text: "We can change our spouses after we are married.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Scripture calls spouses to love, serve, and sanctify one another, but changing another person is God's work. We can influence, pray, and model Christ, but cannot control or remake our partner.",
    references: ["1 Peter 3:1-7", "Ephesians 5:25-28", "1 Corinthians 7:16"]
  },
  {
    id: 30,
    text: "Marriage fulfills the deepest need of human beings.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Only God can fulfill our deepest needs. Marriage is a good gift but cannot bear the weight of being our ultimate satisfaction. Christ alone satisfies the human soul completely.",
    references: ["Psalm 107:9", "John 4:13-14", "Philippians 4:19", "Augustine: 'Our hearts are restless until they rest in You'"]
  },
  {
    id: 31,
    text: "Married loving homosexual couples can reflect the image of a loving God.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "While all humans bear God's image, marriage in Scripture specifically pictures Christ and the Church—requiring the complementarity of male and female. Same-sex unions cannot symbolically represent this mystery.",
    references: ["Ephesians 5:31-32", "Genesis 2:24", "Romans 1:26-27"]
  },
  {
    id: 32,
    text: "Only married heterosexual couples can reflect the image of God.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Every human being bears God's image, regardless of marital status. Marriage reflects one aspect of God's nature (covenant love), but individuals, churches, and friendships also reflect God's character.",
    references: ["Genesis 1:27", "Colossians 1:15", "1 John 4:7-8", "John 13:35"]
  },
  {
    id: 33,
    text: "Wives are to submit to their husbands only if the husbands are worthy of respect.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Peter specifically addresses wives of unbelieving husbands, calling them to submission that might win them over. Submission is 'as to the Lord,' not conditional on the husband's worthiness.",
    references: ["1 Peter 3:1-2", "Ephesians 5:22-24", "Colossians 3:18"]
  },
  {
    id: 34,
    text: "Husbands should not delegate decision making to their wives.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Proverbs 31 shows a wife making significant decisions. Husbands lead by serving, not controlling. Wise leadership often involves delegation and valuing a wife's wisdom and gifts.",
    references: ["Proverbs 31:10-31", "Ephesians 5:25-28", "Genesis 2:18"]
  },
  {
    id: 35,
    text: "The Bible does show what to look for in a spouse.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'agree',
    scripturalInsight: "Scripture provides wisdom about godly character, shared faith, and the fruit of the Spirit that should characterize a spouse. Proverbs 31 and various epistles give guidance.",
    references: ["Proverbs 31:10-31", "2 Corinthians 6:14", "Proverbs 12:4", "Titus 2:3-5"]
  },
  {
    id: 36,
    text: "God is able to provide a spouse if He wants to.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'agree',
    scripturalInsight: "God is sovereign and providential. He brought Eve to Adam and guided servants to find wives for the patriarchs. He can provide a spouse, though He doesn't promise one to everyone.",
    references: ["Genesis 2:22", "Genesis 24:14-27", "Proverbs 19:14", "Psalm 37:4"]
  },
  {
    id: 37,
    text: "To marry someone, you need to know this person's views about marriage related issues.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'agree',
    scripturalInsight: "Wisdom dictates understanding a potential spouse's beliefs about roles, children, finances, and faith before entering covenant. Amos asks, 'Can two walk together unless they agree?'",
    references: ["Amos 3:3", "2 Corinthians 6:14", "Proverbs 24:27"]
  },
  {
    id: 38,
    text: "The primary purpose of the family is to expand the Kingdom of God through biological procreation.",
    category: "Marriage & Relationships",
    categoryId: 3,
    biblicalAnswer: 'disagree',
    scripturalInsight: "While the creation mandate includes 'be fruitful,' the Kingdom expands primarily through spiritual birth (evangelism), not biological birth. The Great Commission supersedes the creation mandate for Kingdom growth.",
    references: ["Matthew 28:19-20", "John 1:12-13", "John 3:3-7", "Galatians 4:19"],
    isNew: true
  },

  // ===== CATEGORY 4: Kingdom Kinship & Family =====
  {
    id: 39,
    text: "Jesus was anti-family as he required His disciples to hate their blood families.",
    category: "Kingdom Kinship & Family",
    categoryId: 4,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus used hyperbole to teach that Kingdom loyalty must exceed family loyalty. He criticized religious leaders for dishonoring parents and cared for His mother from the cross. He reordered, not rejected, family.",
    references: ["Luke 14:26", "Mark 7:9-13", "John 19:26-27", "Matthew 10:37"]
  },
  {
    id: 40,
    text: "Spiritual kinship (the Church) is more foundational than biological or marital kinship in the Kingdom of God.",
    category: "Kingdom Kinship & Family",
    categoryId: 4,
    biblicalAnswer: 'agree',
    scripturalInsight: "Jesus defined His true family as those who do God's will. Paul's 'household of God' language and the eternal nature of the Church (vs. marriage ending at death) show spiritual kinship has ultimate priority.",
    references: ["Mark 3:33-35", "Ephesians 2:19", "Matthew 22:30", "1 Timothy 3:15"],
    isNew: true
  },
  {
    id: 41,
    text: "Local churches should prioritize the needs of families over the needs of single individuals.",
    category: "Kingdom Kinship & Family",
    categoryId: 4,
    biblicalAnswer: 'disagree',
    scripturalInsight: "The early church specifically commanded care for widows and orphans (often single). Paul gave significant attention to singles. The church is a family where all members receive equal care.",
    references: ["James 1:27", "1 Timothy 5:3-16", "1 Corinthians 12:22-25", "Acts 6:1-6"],
    isNew: true
  },

  // ===== CATEGORY 5: Eschatology (The Future State) =====
  {
    id: 42,
    text: "We will no longer be sexual beings when we are in heaven.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Our resurrection bodies will be transformed but still embodied. Jesus retained His body after resurrection. We will likely remain gendered persons, though marriage will not exist.",
    references: ["Luke 24:39-43", "Philippians 3:21", "1 Corinthians 15:42-44"]
  },
  {
    id: 43,
    text: "There are only male angels.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Scripture often uses masculine pronouns for angels but doesn't definitively state all angels are male. Angels appear in male form in Scripture, but their true nature transcends human gender categories.",
    references: ["Genesis 18:2", "Hebrews 13:2", "Luke 20:35-36"]
  },
  {
    id: 44,
    text: "Angels can have sexual relationships with human beings.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'neutral',
    scripturalInsight: "Genesis 6 is debated—some see 'sons of God' as angels, others as godly men. Jesus said angels don't marry. If Genesis 6 refers to angels, it was an aberrant, forbidden act, not normal angelic behavior.",
    references: ["Genesis 6:1-4", "Matthew 22:30", "Jude 1:6-7"]
  },
  {
    id: 45,
    text: "Jesus is not a sexual being as He is God.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus was fully human and fully God. He had a male body and was truly incarnate. While He never engaged in sexual activity, His embodiment as a man means He took on human sexuality in becoming flesh.",
    references: ["John 1:14", "Hebrews 2:14-17", "Philippians 2:7-8", "1 Timothy 2:5"]
  },
  {
    id: 46,
    text: "When we die, we will become like the angels.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'disagree',
    scripturalInsight: "Jesus said we will be 'like angels' in ONE respect: not marrying. But we don't become angels. We remain human, receiving resurrection bodies. Angels and humans are distinct created orders.",
    references: ["Matthew 22:30", "1 Corinthians 15:42-49", "Philippians 3:21"]
  },
  {
    id: 47,
    text: "When we are resurrected, we will have the same glorious body as that of Jesus.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'agree',
    scripturalInsight: "Paul explicitly states our lowly bodies will be transformed to be like Christ's glorious body. John says when He appears, 'we shall be like Him.' Our resurrection bodies model His.",
    references: ["Philippians 3:21", "1 John 3:2", "1 Corinthians 15:49", "Romans 8:29"]
  },
  {
    id: 48,
    text: "Our future spiritual body can eat and drink.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'agree',
    scripturalInsight: "The resurrected Jesus ate fish and honeycomb with His disciples. Isaiah and Revelation describe feasting in the age to come. Our 'spiritual bodies' are still physical, capable of eating.",
    references: ["Luke 24:41-43", "Isaiah 25:6", "Revelation 19:9", "Matthew 26:29"]
  },
  {
    id: 49,
    text: "In the New Heavens and the New Earth, human marriage will no longer exist.",
    category: "Eschatology (The Future State)",
    categoryId: 5,
    biblicalAnswer: 'agree',
    scripturalInsight: "Jesus clearly stated that in the resurrection, people 'neither marry nor are given in marriage.' Marriage is a temporary covenant for this age, pointing to the eternal union of Christ and the Church.",
    references: ["Matthew 22:30", "Mark 12:25", "Luke 20:34-36", "Revelation 21:2"],
    isNew: true
  }
]

// Scoring helper
export type ResponseValue = -2 | -1 | 0 | 1 | 2 // Strongly Disagree to Strongly Agree

export const responseLabels: Record<ResponseValue, string> = {
  [-2]: "Strongly Disagree",
  [-1]: "Disagree",
  [0]: "Neutral",
  [1]: "Agree",
  [2]: "Strongly Agree"
}

export function calculateScore(
  questionAnswer: 'agree' | 'disagree' | 'neutral',
  userResponse: ResponseValue
): number {
  // Returns 0-100 score for how aligned with biblical answer
  if (questionAnswer === 'agree') {
    // Higher response = more aligned
    return Math.round(((userResponse + 2) / 4) * 100)
  } else if (questionAnswer === 'disagree') {
    // Lower response = more aligned
    return Math.round(((-userResponse + 2) / 4) * 100)
  } else {
    // Neutral - closer to 0 is better
    return Math.round(((2 - Math.abs(userResponse)) / 2) * 100)
  }
}

export function getCategoryQuestions(categoryId: number): PulseQuestion[] {
  return pulseQuestions.filter(q => q.categoryId === categoryId)
}

export function getAlignmentLabel(score: number): string {
  if (score >= 80) return "Scripturally Grounded"
  if (score >= 60) return "Biblically Informed"
  if (score >= 40) return "Mixed Perspectives"
  if (score >= 20) return "Culturally Influenced"
  return "Needs Reflection"
}

export function getAlignmentColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400"
  if (score >= 60) return "text-blue-600 dark:text-blue-400"
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400"
  if (score >= 20) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
}

export function calculateCategoryScore(
  categoryId: number,
  responses: Record<number, ResponseValue>
): number {
  const categoryQuestions = getCategoryQuestions(categoryId)
  const answeredQuestions = categoryQuestions.filter(q => responses[q.id] !== undefined)
  
  if (answeredQuestions.length === 0) return 0
  
  const totalScore = answeredQuestions.reduce((sum, q) => {
    return sum + calculateScore(q.biblicalAnswer, responses[q.id])
  }, 0)
  
  return Math.round(totalScore / answeredQuestions.length)
}

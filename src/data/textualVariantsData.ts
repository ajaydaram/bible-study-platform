/**
 * Textual Criticism & Manuscript Variant Dataset
 * Compares Textus Receptus (KJV basis), Nestle-Aland 28 / UBS 5 (Critical Text), and Byzantine Majority Text
 */

export interface ManuscriptWitness {
  siglum: string
  name: string
  date: string
  type: 'Papyrus' | 'Uncial' | 'Minuscule' | 'Lectionary' | 'Early Version' | 'Church Father'
  description: string
}

export interface TextualReading {
  textLabel: string // e.g. "Nestle-Aland 28 (Critical Text)"
  greekText: string
  englishTranslation: string
  keyWitnesses: string[]
  evaluationNotes: string
}

export interface TextualVariant {
  id: string
  reference: string
  passageTitle: string
  theologicalIssue: string
  ubsRating: 'A' | 'B' | 'C' | 'D'
  readings: {
    criticalText: TextualReading
    textusReceptus: TextualReading
    byzantineText?: TextualReading
  }
  scholarlyConsensus: string
  patristicAttestation: string
  translationImpact: string
}

export const MANUSCRIPT_WITNESSES_KEY: Record<string, ManuscriptWitness> = {
  'P45': { siglum: '𝔓⁴⁵', name: 'Chester Beatty I', date: 'c. AD 200-250', type: 'Papyrus', description: 'Early papyrus containing large portions of the Gospels and Acts.' },
  'P66': { siglum: '𝔓⁶⁶', name: 'Papyrus Bodmer II', date: 'c. AD 200', type: 'Papyrus', description: 'One of the earliest and most complete Greek manuscripts of the Gospel of John.' },
  'P75': { siglum: '𝔓⁷⁵', name: 'Papyrus Bodmer XIV-XV', date: 'c. AD 175-225', type: 'Papyrus', description: 'Extremely accurate early witness to Luke and John, closely matching Codex Vaticanus.' },
  'Aleph': { siglum: 'ℵ (01)', name: 'Codex Sinaiticus', date: 'c. AD 330-360', type: 'Uncial', description: 'Complete Greek Bible discovered at St. Catherine Monastery, key Alexandrian witness.' },
  'B': { siglum: 'B (03)', name: 'Codex Vaticanus', date: 'c. AD 325-350', type: 'Uncial', description: 'Generally considered the highest-quality single manuscript witness to the Greek New Testament.' },
  'A': { siglum: 'A (02)', name: 'Codex Alexandrinus', date: 'c. AD 400-440', type: 'Uncial', description: 'Prime witness for Revelation and Epistles; Byzantine in the Gospels, Alexandrian in Epistles.' },
  'C': { siglum: 'C (04)', name: 'Codex Ephraemi Rescriptus', date: 'c. AD 450', type: 'Uncial', description: 'Palimpsest manuscript containing portions of almost all NT books.' },
  'D': { siglum: 'D (05)', name: 'Codex Bezae Cantabrigiensis', date: 'c. AD 400-450', type: 'Uncial', description: 'Primary representative of the Western text-type (Gospels and Acts) with Greek & Latin side-by-side.' },
  'Byz': { siglum: '𝔐 / Byz', name: 'Byzantine Majority Text', date: 'AD 500-1500', type: 'Minuscule', description: 'The predominant text-form preserved in the Eastern Greek-speaking Church.' }
}

export const TEXTUAL_VARIANTS_DATA: TextualVariant[] = [
  {
    id: '1john-5-7',
    reference: '1 John 5:7-8',
    passageTitle: 'The Comma Johanneum (The Heavenly Witnesses)',
    theologicalIssue: 'Trinitarian Formulation in the Epistles',
    ubsRating: 'A',
    readings: {
      criticalText: {
        textLabel: 'NA28 / UBS 5 (Critical Text)',
        greekText: 'ὅτι τρεῖς εἰσιν οἱ μαρτυροῦντες, τὸ πνεῦμα καὶ τὸ ὕδωρ καὶ τὸ αἷμα, καὶ οἱ τρεῖς εἰς τὸ ἕν εἰσιν.',
        englishTranslation: 'For there are three that testify: the Spirit and the water and the blood; and these three agree in one.',
        keyWitnesses: ['𝔓⁷⁴', 'ℵ', 'A', 'B', 'K', 'L', 'P', 'Ψ', '048', 'All Greek MSS before 14th century'],
        evaluationNotes: 'Virtually 100% of ancient Greek manuscript tradition omits the heavenly witness clause.'
      },
      textusReceptus: {
        textLabel: 'Textus Receptus (KJV / Erasmus 1522)',
        greekText: '...ἐν τῷ οὐρανῷ, ὁ Πατήρ, ὁ Λόγος, καὶ τὸ Ἅγιον Πνεῦμα· καὶ οὗτοι οἱ τρεῖς ἕν εἰσι. Καὶ τρεῖς εἰσιν οἱ μαρτυροῦντες ἐν τῇ γῇ...',
        englishTranslation: '...in heaven, the Father, the Word, and the Holy Ghost: and these three are one. And there are three that bear witness in earth...',
        keyWitnesses: ['Codex Montfortianus (Minuscule 61, 16th century)', 'Ottobonianus (Minuscule 629, 14th cent. Latin-Greek)', 'Latin Vulgate (late recension)'],
        evaluationNotes: 'Originated as a Latin theological margin gloss in 4th-century North Africa / Spain, later inserted into late Latin copies.'
      },
      byzantineText: {
        textLabel: 'Byzantine Majority Text',
        greekText: 'ὅτι τρεῖς εἰσιν οἱ μαρτυροῦντες, τὸ πνεῦμα καὶ τὸ ὕδωρ καὶ τὸ αἷμα, καὶ οἱ τρεῖς εἰς τὸ ἕν εἰσιν.',
        englishTranslation: 'For there are three that testify: the Spirit and the water and the blood; and these three agree in one.',
        keyWitnesses: ['Majority of all Byzantine minuscules (99.8%)'],
        evaluationNotes: 'The Byzantine tradition agrees completely with the modern Critical Text in omitting the clause.'
      }
    },
    scholarlyConsensus: 'Universal scholarly agreement that the clause is a late Latin gloss not present in the original apostolic autograph.',
    patristicAttestation: 'Cyprian (c. 250) cites the three witnesses symbolically; Greek fathers (Athanasius, Gregory of Nazianzus, Chrysostom) never quote it in major Trinitarian debates.',
    translationImpact: 'Included in KJV and NKJV; omitted or footnoted in ESV, NASB, CSB, NIV, and modern translations.'
  },
  {
    id: 'john-7-53-8-11',
    reference: 'John 7:53–8:11',
    passageTitle: 'The Pericope Adulterae (The Woman Caught in Adultery)',
    theologicalIssue: 'Jesus’ Authority, Mercy, and the Law of Moses',
    ubsRating: 'A',
    readings: {
      criticalText: {
        textLabel: 'NA28 / UBS 5 (Critical Text)',
        greekText: '[καὶ ἐπορεύθησαν ἕκαστος εἰς τὸν οἶκον αὐτοῦ... μηκέτι ἁμάρτανε.] (Bracketed)',
        englishTranslation: 'Brackets the entire pericope, noting absence in earliest and best Greek manuscripts.',
        keyWitnesses: ['𝔓⁶⁶', '𝔓⁷⁵', 'ℵ', 'B', 'L', 'N', 'T', 'W', 'Old Syriac', 'Sahidic Coptic'],
        evaluationNotes: 'Absent from all extant Greek manuscripts prior to the 5th century.'
      },
      textusReceptus: {
        textLabel: 'Textus Receptus & Byzantine Text',
        greekText: 'καὶ ἐπορεύθη ἕκαστος εἰς τὸν οἶκον αὐτοῦ· Ἰησοῦς δὲ ἐπορεύθη εἰς τὸ Ὄρος τῶν Ἐλαιῶν...',
        englishTranslation: 'And every man went unto his own house. Jesus went unto the mount of Olives...',
        keyWitnesses: ['Codex Bezae (D, 5th cent.)', 'Codex Campianus', 'Majority of later Byzantine minuscules'],
        evaluationNotes: 'Appears at John 7:53 in Western witnesses; placed after John 7:36, Luke 21:38, or Luke 24:53 in various minuscules.'
      }
    },
    scholarlyConsensus: 'Scholars widely agree the story is an authentic early apostolic oral tradition that was not originally part of John’s Gospel as penned, but was later inserted by copyists.',
    patristicAttestation: 'Augustine notes that some copyists removed the story fearing it promoted moral laxity; Jerome included it in the Latin Vulgate (c. 383).',
    translationImpact: 'Retained in all major English Bibles (KJV, ESV, NASB, NIV, CSB) inside brackets with an explanatory footnote.'
  },
  {
    id: 'mark-16-9-20',
    reference: 'Mark 16:9–20',
    passageTitle: 'The Longer Ending of Mark',
    theologicalIssue: 'Post-Resurrection Commission & Attesting Signs',
    ubsRating: 'B',
    readings: {
      criticalText: {
        textLabel: 'NA28 / UBS 5 (Critical Text)',
        greekText: '[Ἀναστὰς δὲ πρωῒ πρώτῃ σαββάτου ἐφάνη πρῶτον Μαρίᾳ τῇ Μαγδαληνῇ...] (Double Bracketed)',
        englishTranslation: 'Double brackets verses 9-20, concluding Mark at 16:8 (ἐφοβοῦντο γάρ, "for they were afraid").',
        keyWitnesses: ['ℵ', 'B', 'Sinaitic Syriac', 'c. 100 Armenian MSS', 'Early Georgian MSS'],
        evaluationNotes: 'Codex Vaticanus and Sinaiticus both end Mark at 16:8 (Vaticanus leaves a rare blank column).'
      },
      textusReceptus: {
        textLabel: 'Textus Receptus & Byzantine Text',
        greekText: 'Ἀναστὰς δὲ πρωῒ πρώτῃ σαββάτου ἐφάνη πρῶτον Μαρίᾳ τῇ Μαγδαληνῇ...',
        englishTranslation: 'Now when Jesus was risen early the first day of the week, he appeared first to Mary Magdalene...',
        keyWitnesses: ['A', 'C', 'D', 'W', 'Latin Vulgate', 'Peshitta Syriac', 'Majority of Byzantine MSS'],
        evaluationNotes: 'Supported by the vast majority of continuous-text Greek manuscripts from the 5th century onward.'
      }
    },
    scholarlyConsensus: 'Strong evidence that Mark either intended to end dramatically at 16:8 or the final leaf of the original scroll was lost very early in transmission.',
    patristicAttestation: 'Irenaeus (c. 180) quotes Mark 16:19; Eusebius and Jerome attest that the best Greek manuscripts of their day ended at 16:8.',
    translationImpact: 'Standard in all English Bibles, displayed with explanatory section headers or brackets.'
  },
  {
    id: 'romans-8-1',
    reference: 'Romans 8:1',
    passageTitle: 'No Condemnation & The Walking Qualifier',
    theologicalIssue: 'Justification by Faith vs. Sanctification Prerequisites',
    ubsRating: 'A',
    readings: {
      criticalText: {
        textLabel: 'NA28 / UBS 5 (Critical Text)',
        greekText: 'Οὐδὲν ἄρα νῦν κατάκριμα τοῖς ἐν Χριστῷ Ἰησοῦ.',
        englishTranslation: 'There is therefore now no condemnation for those who are in Christ Jesus.',
        keyWitnesses: ['ℵ', 'B', 'C', 'D*', 'G', 'Ψ', '33', 'Old Latin', 'Sahidic Coptic'],
        evaluationNotes: 'Ends emphatically after "in Christ Jesus". No conditional walking clause.'
      },
      textusReceptus: {
        textLabel: 'Textus Receptus (KJV)',
        greekText: 'Οὐδὲν ἄρα νῦν κατάκριμα τοῖς ἐν Χριστῷ Ἰησοῦ, μὴ κατὰ σάρκα περιπατοῦσιν, ἀλλὰ κατὰ πνεῦμα.',
        englishTranslation: '...who walk not after the flesh, but after the Spirit.',
        keyWitnesses: ['K', 'P', 'Majority of Byzantine Minuscules', 'Late Latin recensions'],
        evaluationNotes: 'Harmonization from Romans 8:4 ("who walk not according to the flesh but according to the Spirit").'
      }
    },
    scholarlyConsensus: 'Scribes accidentally or deliberately assimilated the explanatory phrase from verse 4 into verse 1.',
    patristicAttestation: 'Early patristic commentators quote 8:1 without the addition, highlighting unconditional justification in Christ.',
    translationImpact: 'ESV, NASB, NIV, CSB end at "in Christ Jesus"; KJV includes the phrase from verse 4.'
  },
  {
    id: '1timothy-3-16',
    reference: '1 Timothy 3:16',
    passageTitle: 'The Mystery of Godliness (God vs. He Who Was Manifest)',
    theologicalIssue: 'Early Christological Hymn & Divinity of Christ',
    ubsRating: 'B',
    readings: {
      criticalText: {
        textLabel: 'NA28 / UBS 5 (Critical Text)',
        greekText: 'Ὃς ἐφανερώθη ἐν σαρκί, ἐδικαιώθη ἐν πνεύματι...',
        englishTranslation: 'He [or Who] was manifested in the flesh, vindicated by the Spirit...',
        keyWitnesses: ['𝔓⁴⁶ (implied)', 'ℵ*', 'A*', 'C*', 'G', '33', 'Sinaitic Syriac', 'Gothic'],
        evaluationNotes: 'Relative pronoun Ὃς (Hos = "He who / Who") introducing the rhythmic Christological hymn.'
      },
      textusReceptus: {
        textLabel: 'Textus Receptus (KJV)',
        greekText: 'Θεὸς ἐφανερώθη ἐν σαρκί...',
        englishTranslation: 'God was manifest in the flesh...',
        keyWitnesses: ['ℵ² (corrector)', 'A²', 'C²', 'D²', 'K', 'L', 'P', 'Majority of Byzantine MSS'],
        evaluationNotes: 'Scribal scribing of ΘΣ (Theos contracted nomina sacra) from ΟΣ (Hos) by adding a stroke inside the Omicron and a top line.'
      }
    },
    scholarlyConsensus: 'The original reading is Ὃς ("He who"), an ancient liturgical hymn confessing Christ as the divine Redeemer manifested in the flesh.',
    patristicAttestation: 'Early versions and Fathers (Origen, Jerome) read the relative pronoun; later 5th-century copies smoothed to "God".',
    translationImpact: 'ESV/NASB: "He was manifested in the flesh"; KJV: "God was manifest in the flesh".'
  },
  {
    id: 'matthew-6-13',
    reference: 'Matthew 6:13b',
    passageTitle: 'The Lord’s Prayer Doxology',
    theologicalIssue: 'Liturgical Doxology & Kingdom Sovereignty',
    ubsRating: 'A',
    readings: {
      criticalText: {
        textLabel: 'NA28 / UBS 5 (Critical Text)',
        greekText: 'καὶ μὴ εἰσενέγκῃς ἡμᾶς εἰς πειρασμόν, ἀλλὰ ῥῦσαι ἡμᾶς ἀπὸ τοῦ πονηροῦ. [Omitted]',
        englishTranslation: 'And lead us not into temptation, but deliver us from evil.',
        keyWitnesses: ['ℵ', 'B', 'D', '0170', 'Old Latin (ff1, k)', 'Sahidic Coptic'],
        evaluationNotes: 'Prayer ends after "deliver us from the evil one". Doxology omitted in earliest manuscripts.'
      },
      textusReceptus: {
        textLabel: 'Textus Receptus & Byzantine Text',
        greekText: '...ὅτι σοῦ ἐστιν ἡ βασιλεία καὶ ἡ δύναμις καὶ ἡ δόξα εἰς τοὺς αἰῶνας. Ἀμήν.',
        englishTranslation: 'For thine is the kingdom, and the power, and the glory, for ever. Amen.',
        keyWitnesses: ['K', 'L', 'W', 'Δ', 'Θ', 'Peshitta Syriac', 'Didache 8:2 (short form)'],
        evaluationNotes: 'Early liturgical congregational doxology adapted from 1 Chronicles 29:11 into Church worship.'
      }
    },
    scholarlyConsensus: 'Originated as a corporate liturgical response in early worship (as seen in the Didache) that was copied into Gospel manuscripts.',
    patristicAttestation: 'Tertullian, Cyprian, and Origen wrote commentaries on the Lord’s Prayer and make no mention of the doxology.',
    translationImpact: 'Included in KJV; placed in footnotes or brackets in ESV, NASB, NIV, CSB.'
  }
]

import os
import re
import json
import glob
from pypdf import PdfReader

PDF_DIR = "/Users/ajaydaram/Desktop/scriptorium-react"
OUTPUT_PATH = "/Users/ajaydaram/Desktop/scriptorium-react/public/data/creeds/comprehensive-creeds.json"
OUTPUT_DIR = os.path.dirname(OUTPUT_PATH)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Metadata mapping for all 49 PDF files
DOC_METADATA = {
    "Nicene-Creed.pdf": {
        "id": "nicene-creed-325",
        "title": "The Nicene Creed",
        "year": 381,
        "tradition": "ecumenical",
        "type": "creed",
        "author": "First Council of Nicaea / Constantinople",
        "summary": "The definitive ecumenical statement on the Trinity and the deity of the Son and Holy Spirit."
    },
    "Chalcedonian-Creed.pdf": {
        "id": "chalcedonian-creed-451",
        "title": "The Chalcedonian Definition",
        "year": 451,
        "tradition": "ecumenical",
        "type": "creed",
        "author": "Council of Chalcedon",
        "summary": "Affirms Christ as truly God and truly man in two natures, without confusion, change, division, or separation."
    },
    "Athanasian-Creed.pdf": {
        "id": "athanasian-creed",
        "title": "The Athanasian Creed (Quicunque Vult)",
        "year": 500,
        "tradition": "ecumenical",
        "type": "creed",
        "author": "Attributed to Athanasius",
        "summary": "Detailed exposition of the Trinity and the Incarnation."
    },
    "waldensian_confession_1120.pdf": {
        "id": "waldensian-confession-1120",
        "title": "Waldensian Confession of Faith",
        "year": 1120,
        "tradition": "pre-reformation",
        "type": "confession",
        "author": "Waldenses (Poor Men of Lyon)",
        "summary": "Early proto-Protestant confession emphasizing the sufficiency of Scripture and salvation by faith in Christ."
    },
    "The-Ninety-Five-Theses-Martin-Luther.pdf": {
        "id": "luther-95-theses-1517",
        "title": "The Ninety-Five Theses",
        "year": 1517,
        "tradition": "lutheran",
        "type": "theses",
        "author": "Martin Luther",
        "summary": "Disputation on the Power and Efficacy of Indulgences that sparked the Protestant Reformation."
    },
    "67-sixty-seven-articles.pdf": {
        "id": "zwingli-67-articles-1523",
        "title": "The Sixty-Seven Articles of Zurich",
        "year": 1523,
        "tradition": "reformed",
        "type": "theses",
        "author": "Huldrych Zwingli",
        "summary": "Zwingli's inaugural defense of the Gospel and reformation of the Church in Zurich."
    },
    "The-Berne-Theses.pdf": {
        "id": "berne-theses-1528",
        "title": "The Ten Theses of Berne",
        "year": 1528,
        "tradition": "reformed",
        "type": "theses",
        "author": "Berthold Haller & Franz Kolb",
        "summary": "Ten theological theses establishing the Reformation in the Canton of Berne."
    },
    "Schleitheim-Confession.pdf": {
        "id": "schleitheim-confession-1527",
        "title": "The Schleitheim Confession",
        "year": 1527,
        "tradition": "anabaptist",
        "type": "confession",
        "author": "Michael Sattler & Swiss Brethren",
        "summary": "Foundational Anabaptist confession on believer's baptism, separation, the ban, and non-violence."
    },
    "tetrapolatan-strasbourg-swabian-confession.pdf": {
        "id": "tetrapolitan-confession-1530",
        "title": "The Tetrapolitan Confession (Four Cities)",
        "year": 1530,
        "tradition": "reformed",
        "type": "confession",
        "author": "Martin Bucer & Wolfgang Capito",
        "summary": "Confession presented to Emperor Charles V by Strasbourg, Constance, Memmingen, and Lindau."
    },
    "The-First-Confession-of-Basel-1534.pdf": {
        "id": "first-basel-confession-1534",
        "title": "The First Confession of Basel",
        "year": 1534,
        "tradition": "reformed",
        "type": "confession",
        "author": "Johannes Oecolampadius & Oswald Myconius",
        "summary": "The civic and ecclesiastical confession of Basel defending Protestant orthodoxy."
    },
    "augsburg-confession-translation.pdf": {
        "id": "augsburg-confession-1530",
        "title": "The Augsburg Confession (Confessio Augustana)",
        "year": 1530,
        "tradition": "lutheran",
        "type": "confession",
        "author": "Philipp Melanchthon & Martin Luther",
        "summary": "The primary confessional standard of the Lutheran Church presented at the Diet of Augsburg."
    },
    "Apology-Augsburg-Confession-1531.pdf": {
        "id": "apology-augsburg-confession-1531",
        "title": "Apology of the Augsburg Confession",
        "year": 1531,
        "tradition": "lutheran",
        "type": "confession",
        "author": "Philipp Melanchthon",
        "summary": "Melanchthon's masterwork defending the Augsburg Confession against the Roman Confutatio."
    },
    "luthers-small-catechism.pdf": {
        "id": "luthers-small-catechism-1529",
        "title": "Luther's Small Catechism",
        "year": 1529,
        "tradition": "lutheran",
        "type": "catechism",
        "author": "Martin Luther",
        "summary": "Instructions in the Ten Commandments, Apostles' Creed, Lord's Prayer, and Sacraments for families."
    },
    "luthers-large-catechism.pdf": {
        "id": "luthers-large-catechism-1529",
        "title": "Luther's Large Catechism",
        "year": 1529,
        "tradition": "lutheran",
        "type": "catechism",
        "author": "Martin Luther",
        "summary": "Deep theological explanations of Christian doctrine for pastors, teachers, and elders."
    },
    "The-Smalcald-Articles-and-the-Treatise.pdf": {
        "id": "smalcald-articles-1537",
        "title": "The Smalcald Articles & Treatise on Papal Primacy",
        "year": 1537,
        "tradition": "lutheran",
        "type": "confession",
        "author": "Martin Luther & Philipp Melanchthon",
        "summary": "Summary of non-negotiable Protestant doctrines prepared for the Schmalkaldic League."
    },
    "Formula-of-Concord.pdf": {
        "id": "formula-of-concord-1577",
        "title": "The Formula of Concord",
        "year": 1577,
        "tradition": "lutheran",
        "type": "confession",
        "author": "Jakob Andreae, Martin Chemnitz, David Chytraeus",
        "summary": "Resolved internal controversies among Lutherans regarding free will, righteousness, the Lord's Supper, and election."
    },
    "book-of-concord.pdf": {
        "id": "book-of-concord-1580",
        "title": "The Book of Concord (Concordia)",
        "year": 1580,
        "tradition": "lutheran",
        "type": "document",
        "author": "Evangelical Lutheran Church",
        "summary": "The definitive collection of all historic Lutheran confessional documents."
    },
    "the-geneva-chatechism.pdf": {
        "id": "geneva-catechism-1542",
        "title": "The Geneva Catechism",
        "year": 1542,
        "tradition": "reformed",
        "type": "catechism",
        "author": "John Calvin",
        "summary": "Calvin's catechism for instructing youth in the reformed faith across 373 questions and answers."
    },
    "The-Consenus-Tigurinus-Zurich.pdf": {
        "id": "consensus-tigurinus-1549",
        "title": "Consensus Tigurinus (Zurich Agreement)",
        "year": 1549,
        "tradition": "reformed",
        "type": "document",
        "author": "John Calvin & Heinrich Bullinger",
        "summary": "Unified the Reformed churches of Geneva and Zurich regarding the doctrine of the Lord's Supper."
    },
    "French-Gallican-Confession-1559.pdf": {
        "id": "french-gallican-confession-1559",
        "title": "The French Gallican Confession",
        "year": 1559,
        "tradition": "reformed",
        "type": "confession",
        "author": "John Calvin & First Synod of Paris",
        "summary": "Confession of the Huguenot Reformed Church in France adopted under persecution."
    },
    "Scots_Confession_1560.pdf": {
        "id": "scots-confession-1560",
        "title": "The Scots Confession",
        "year": 1560,
        "tradition": "presbyterian",
        "type": "confession",
        "author": "John Knox & The Six Johns",
        "summary": "First confession of the Reformed Church of Scotland ratified by the Scottish Parliament."
    },
    "The-Second-Scottish-Confession.pdf": {
        "id": "second-scottish-confession-1581",
        "title": "The Second Scottish Confession (National Covenant)",
        "year": 1581,
        "tradition": "presbyterian",
        "type": "confession",
        "author": "John Craig & King James VI",
        "summary": "Solemn covenant renouncing papacy and binding the Scottish nation to reformed worship."
    },
    "belgic_confession.pdf": {
        "id": "belgic-confession-1561",
        "title": "The Belgic Confession",
        "year": 1561,
        "tradition": "reformed",
        "type": "confession",
        "author": "Guido de Brès",
        "summary": "A Three Forms of Unity standard presenting the reformed faith in 37 thorough articles."
    },
    "Creed_Helvetic.pdf": {
        "id": "formula-consensus-helvetica-1675",
        "title": "Formula Consensus Helvetica",
        "year": 1675,
        "tradition": "reformed",
        "type": "confession",
        "author": "Johann Heinrich Heidegger & Francis Turretin",
        "summary": "Swiss Reformed consensus defending high Calvinism against Amyraldianism."
    },
    "the-second-helvetic-confession.pdf": {
        "id": "second-helvetic-confession-1566",
        "title": "The Second Helvetic Confession",
        "year": 1566,
        "tradition": "reformed",
        "type": "confession",
        "author": "Heinrich Bullinger",
        "summary": "One of the most widely accepted and comprehensive Reformed confessions in Europe."
    },
    "Bohemian-Confession-1575.pdf": {
        "id": "bohemian-confession-1575",
        "title": "The Bohemian Confession (Confessio Bohemica)",
        "year": 1575,
        "tradition": "reformed",
        "type": "confession",
        "author": "Utraquists, Unity of the Brethren, and Lutherans",
        "summary": "Joint confession uniting Hussites, Brethren, and Protestants in Bohemia."
    },
    "canons-of-dort.pdf": {
        "id": "canons-of-dort-1619",
        "title": "The Canons of Dort (Five Heads of Doctrine)",
        "year": 1619,
        "tradition": "reformed",
        "type": "canon",
        "author": "Synod of Dort",
        "summary": "Judicial defense of sovereign grace against the Five Remonstrances (Doctrines of Grace / TULIP)."
    },
    "ten-articles-henry-iii.pdf": {
        "id": "ten-articles-1536",
        "title": "The Ten Articles",
        "year": 1536,
        "tradition": "anglican",
        "type": "confession",
        "author": "Archbishop Thomas Cranmer & Henry VIII",
        "summary": "First official doctrinal statement of the Church of England in the early English Reformation."
    },
    "the-thirteen-articles.pdf": {
        "id": "thirteen-articles-1538",
        "title": "The Thirteen Articles",
        "year": 1538,
        "tradition": "anglican",
        "type": "confession",
        "author": "English & Lutheran Theologians (Thomas Cranmer)",
        "summary": "Anglo-Lutheran joint articles modeled on the Augsburg Confession."
    },
    "Act-of-the-Six-Articles.pdf": {
        "id": "six-articles-1539",
        "title": "Act of the Six Articles",
        "year": 1539,
        "tradition": "anglican",
        "type": "confession",
        "author": "Parliament of England",
        "summary": "Statutory articles enacted during the conservative reaction under Henry VIII."
    },
    "39_articles_of_Religion.pdf": {
        "id": "thirty-nine-articles-1571",
        "title": "The Thirty-Nine Articles of Religion",
        "year": 1571,
        "tradition": "anglican",
        "type": "confession",
        "author": "Archbishop Thomas Cranmer & Convocation",
        "summary": "The defining confessional statement of the Anglican Communion and Church of England."
    },
    "the-lambeth-articles.pdf": {
        "id": "lambeth-articles-1595",
        "title": "The Lambeth Articles",
        "year": 1595,
        "tradition": "anglican",
        "type": "theses",
        "author": "Archbishop John Whitgift & William Whitaker",
        "summary": "Nine strongly Reformed Calvinistic articles formulated for the Church of England at Cambridge."
    },
    "irish-articles-of-religion.pdf": {
        "id": "irish-articles-1615",
        "title": "The Irish Articles of Religion",
        "year": 1615,
        "tradition": "anglican",
        "type": "confession",
        "author": "Archbishop James Ussher",
        "summary": "104 Calvinistic articles that served as a major precursor and blueprint for the Westminster Confession."
    },
    "The-Book-Common-Prayer-is-origin-an-growth.pdf": {
        "id": "bcp-origin-growth",
        "title": "Origin and Growth of the Book of Common Prayer",
        "year": 1549,
        "tradition": "anglican",
        "type": "document",
        "author": "Historical Study & Thomas Cranmer",
        "summary": "History and theological development of Cranmer's Book of Common Prayer."
    },
    "The-Solemn-League-and-Covenant-1643.pdf": {
        "id": "solemn-league-covenant-1643",
        "title": "The Solemn League and Covenant",
        "year": 1643,
        "tradition": "presbyterian",
        "type": "document",
        "author": "Parliaments of England and Scotland",
        "summary": "Treaty pledging mutual defense and the religious reformation of England, Scotland, and Ireland."
    },
    "the-westminster-confession-of-faith.pdf": {
        "id": "westminster-confession-1647",
        "title": "The Westminster Confession of Faith",
        "year": 1647,
        "tradition": "presbyterian",
        "type": "confession",
        "author": "The Westminster Assembly of Divines",
        "summary": "The pinnacle systematic standard of Reformed and Presbyterian theology across 33 chapters."
    },
    "the-westminster-shorter-catechism.pdf": {
        "id": "westminster-shorter-catechism-1647",
        "title": "The Westminster Shorter Catechism",
        "year": 1647,
        "tradition": "presbyterian",
        "type": "catechism",
        "author": "The Westminster Assembly",
        "summary": "107 questions and answers teaching that man's chief end is to glorify God and enjoy Him forever."
    },
    "the-westminster-larger-catechism.pdf": {
        "id": "westminster-larger-catechism-1648",
        "title": "The Westminster Larger Catechism",
        "year": 1648,
        "tradition": "presbyterian",
        "type": "catechism",
        "author": "The Westminster Assembly",
        "summary": "196 comprehensive theological questions and answers for deepening adult faith."
    },
    "lanark-declaration-1682.pdf": {
        "id": "lanark-declaration-1682",
        "title": "The Lanark Declaration",
        "year": 1682,
        "tradition": "presbyterian",
        "type": "document",
        "author": "Scottish Covenanters",
        "summary": "Covenanter declaration rejecting royal supremacy and tyranny during the Killing Time in Scotland."
    },
    "London-Baptist-of-Faith-1689.pdf": {
        "id": "london-baptist-confession-1689",
        "title": "The 1689 Second London Baptist Confession (2LBCF)",
        "year": 1689,
        "tradition": "baptist",
        "type": "confession",
        "author": "Reformed Particular Baptists",
        "summary": "The foundational Reformed Baptist standard adapting the Westminster Confession with credobaptist ecclesiology."
    },
    "the-new-hampshire-confession-of-faith.pdf": {
        "id": "new-hampshire-confession-1833",
        "title": "The New Hampshire Confession of Faith",
        "year": 1833,
        "tradition": "baptist",
        "type": "confession",
        "author": "J. Newton Brown & NH Baptist Convention",
        "summary": "Influential American Baptist confession providing a moderate Calvinistic theological summary."
    },
    "abstract-of-principles-southern-baptist-1858.pdf": {
        "id": "abstract-of-principles-1858",
        "title": "Abstract of Principles (SBTS)",
        "year": 1858,
        "tradition": "baptist",
        "type": "confession",
        "author": "Basil Manly Jr. & Founders of SBTS",
        "summary": "Foundational doctrinal charter required of all professors at Southern Baptist Theological Seminary."
    },
    "The-Baptist-Faith-And-Message.pdf": {
        "id": "baptist-faith-and-message",
        "title": "The Baptist Faith & Message",
        "year": 2000,
        "tradition": "baptist",
        "type": "confession",
        "author": "Southern Baptist Convention",
        "summary": "The consensus statement of Southern Baptist doctrine and cooperative missions."
    },
    "Mennonit-Confession-of-Faith.pdf": {
        "id": "mennonite-confession-of-faith",
        "title": "Mennonite Confession of Faith",
        "year": 1963,
        "tradition": "anabaptist",
        "type": "confession",
        "author": "Mennonite General Conference",
        "summary": "24 articles expressing Anabaptist-Mennonite biblical theology and discipleship."
    },
    "confession-of-1967.pdf": {
        "id": "confession-of-1967",
        "title": "The Confession of 1967",
        "year": 1967,
        "tradition": "modern",
        "type": "confession",
        "author": "United Presbyterian Church (USA)",
        "summary": "20th-century confession centered on reconciliation in Christ and social transformation."
    },
    "belhar-confession-1986.pdf": {
        "id": "belhar-confession-1986",
        "title": "The Belhar Confession",
        "year": 1986,
        "tradition": "modern",
        "type": "confession",
        "author": "Dutch Reformed Mission Church in South Africa",
        "summary": "Historic anti-apartheid confession testifying to unity, reconciliation, and justice in Christ."
    },
    "Book-of-Confession-2016.pdf": {
        "id": "pcusa-book-of-confessions-2016",
        "title": "PCUSA Book of Confessions",
        "year": 2016,
        "tradition": "presbyterian",
        "type": "document",
        "author": "Presbyterian Church (USA)",
        "summary": "Constitution Part I containing the twelve historic confessions of the Presbyterian Church."
    },
    "Book-of-Order-2013-2015-pcusa.pdf": {
        "id": "pcusa-book-of-order",
        "title": "PCUSA Book of Order",
        "year": 2013,
        "tradition": "presbyterian",
        "type": "document",
        "author": "Presbyterian Church (USA)",
        "summary": "Constitution Part II governing Presbyterian polity, ministry, and church order."
    },
    "book-of-confessions-pcusa-2014.pdf": {
        "id": "pcusa-book-of-confessions-2014",
        "title": "PCUSA Book of Confessions (2014 Edition)",
        "year": 2014,
        "tradition": "presbyterian",
        "type": "document",
        "author": "Presbyterian Church (USA)",
        "summary": "The constitutional confessional heritage of the Reformed tradition."
    }
}

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def split_into_sections(text, doc_type):
    # Try splitting by Roman Numerals (I., II., III.), Articles (Article 1, Article I), Chapters (Chapter 1), Questions (Q. 1, Q 1, Question 1)
    sections = []
    
    # Check for Catechism format
    q_matches = list(re.finditer(r'(?:Q(?:uestion)?\.?\s*(\d+)[\.:\s]+)(.*?)(?=(?:Q(?:uestion)?\.?\s*\d+[\.:\s]+)|$)', text, re.IGNORECASE | re.DOTALL))
    if len(q_matches) >= 3:
        for idx, m in enumerate(q_matches):
            q_num = m.group(1)
            body = clean_text(m.group(2))
            sections.append({
                "id": f"q-{q_num}",
                "title": f"Question {q_num}",
                "content": f"Q. {q_num}: {body}"
            })
        return sections

    # Check for Chapter or Article format
    art_matches = list(re.finditer(r'(?:(?:CHAPTER|ARTICLE|Article|Chapter|HEAD|Head|Article\s+[IVXLCDM]+|Article\s+\d+|[IVXLCDM]+\.)\s*[\.:\s]+)(.*?)(?=(?:(?:CHAPTER|ARTICLE|Article|Chapter|HEAD|Head|Article\s+[IVXLCDM]+|Article\s+\d+|[IVXLCDM]+\.)\s*[\.:\s]+)|$)', text, re.DOTALL))
    if len(art_matches) >= 3:
        for idx, m in enumerate(art_matches):
            body = clean_text(m.group(1))
            first_line = body[:60]
            sections.append({
                "id": f"section-{idx+1}",
                "title": f"Section {idx+1}: {first_line}...",
                "content": body
            })
        return sections

    # Check for numbered paragraphs (1. , 2. , 3. )
    num_matches = list(re.finditer(r'(?:^|\n)\s*(\d+)[\.\)]\s+(.*?)(?=(?:\n\s*\d+[\.\)]\s+)|$)', text, re.DOTALL))
    if len(num_matches) >= 3:
        for idx, m in enumerate(num_matches):
            num = m.group(1)
            body = clean_text(m.group(2))
            sections.append({
                "id": f"article-{num}",
                "title": f"Article {num}",
                "content": body
            })
        return sections

    # Fallback: Split by chunks of ~1500 chars
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    if paragraphs:
        current_chunk = []
        current_len = 0
        chunk_idx = 1
        for p in paragraphs:
            current_chunk.append(p)
            current_len += len(p)
            if current_len > 1500:
                sections.append({
                    "id": f"part-{chunk_idx}",
                    "title": f"Part {chunk_idx}",
                    "content": clean_text(' '.join(current_chunk))
                })
                current_chunk = []
                current_len = 0
                chunk_idx += 1
        if current_chunk:
            sections.append({
                "id": f"part-{chunk_idx}",
                "title": f"Part {chunk_idx}",
                "content": clean_text(' '.join(current_chunk))
            })
    else:
        sections.append({
            "id": "full-text",
            "title": "Full Document Text",
            "content": clean_text(text)
        })
    return sections

print("Starting extraction of all 49 PDF documents...")

all_documents = []

for filename, meta in DOC_METADATA.items():
    filepath = os.path.join(PDF_DIR, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
    
    try:
        reader = PdfReader(filepath)
        page_texts = []
        # Limit giant 400+ page books to first 60 pages for browser performance if necessary
        max_pages = min(len(reader.pages), 60 if "pcusa" in filename.lower() or "concord" in filename.lower() else len(reader.pages))
        for p_idx in range(max_pages):
            txt = reader.pages[p_idx].extract_text() or ""
            if txt.strip():
                page_texts.append(txt)
        
        full_doc_text = "\n\n".join(page_texts)
        sections = split_into_sections(full_doc_text, meta["type"])
        
        doc_entry = {
            "id": meta["id"],
            "title": meta["title"],
            "year": meta["year"],
            "tradition": meta["tradition"],
            "type": meta["type"],
            "author": meta.get("author", "Church Fathers & Theologians"),
            "summary": meta.get("summary", ""),
            "pages": len(reader.pages),
            "sectionCount": len(sections),
            "sections": sections[:100]  # Cap at 100 sections per doc for blazing fast UI
        }
        all_documents.append(doc_entry)
        print(f"✓ Processed {meta['title']} ({len(sections)} sections, {len(reader.pages)} pages)")
    except Exception as e:
        print(f"✗ Failed {filename}: {e}")

all_documents.sort(key=lambda d: d.get("year") or 0)

output_data = {
    "totalDocuments": len(all_documents),
    "traditions": ["ecumenical", "lutheran", "reformed", "anglican", "presbyterian", "baptist", "anabaptist", "pre-reformation", "modern"],
    "documents": all_documents
}

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully generated {OUTPUT_PATH} with {len(all_documents)} historic theological documents!")

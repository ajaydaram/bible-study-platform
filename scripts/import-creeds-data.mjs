import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import yaml from 'yaml';

const rootDir = process.cwd();
const tmpDir = path.join(rootDir, '.tmp');
const creedsRepoDir = path.join(tmpDir, 'creeds-json');
const reformedRepoDir = path.join(tmpDir, 'reformed-standards');
const outputDir = path.join(rootDir, 'src', 'data', 'creeds');
const outputFile = path.join(outputDir, 'creeds-library.json');

const CREEDS_REPO = 'https://github.com/NonlinearFruit/Creeds.json.git';
const REFORMED_REPO = 'https://github.com/reformed-standards/compendium.git';

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const cleanDir = (dir) => {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
};

const cloneRepo = (repoUrl, dest) => {
  cleanDir(dest);
  execSync(`git clone --depth 1 ${repoUrl} ${dest}`, { stdio: 'inherit' });
};

const safeNumber = (value) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapCreedsJsonType = (format) => {
  switch (format) {
    case 'Creed':
      return 'creed';
    case 'Confession':
      return 'confession';
    case 'Catechism':
      return 'catechism';
    case 'HenrysCatechism':
      return 'catechism';
    case 'Canon':
      return 'canon';
    default:
      return 'document';
  }
};

const buildCreedsJsonSections = (format, data) => {
  if (!data) return [];

  if (format === 'Creed') {
    return [{
      id: 'content',
      title: 'Content',
      content: data.Content ?? ''
    }];
  }

  if (format === 'Canon') {
    if (!Array.isArray(data)) return [];
    return data.map((article, index) => ({
      id: `article-${article.Article ?? index + 1}`,
      title: `${article.Article ?? index + 1} ${article.Title ?? ''}`.trim(),
      content: article.Content ?? '',
      ...(article.Proofs ? { Proofs: article.Proofs } : {})
    }));
  }

  if (format === 'Confession') {
    if (!Array.isArray(data)) return [];
    const sections = [];
    for (const chapter of data) {
      const chapterTitle = `Chapter ${chapter.Chapter ?? ''}: ${chapter.Title ?? ''}`.trim();
      const chapterSections = chapter.Sections ?? [];
      for (const section of chapterSections) {
        sections.push({
          id: `chapter-${chapter.Chapter ?? 'x'}-section-${section.Section ?? 'x'}`,
          title: `${chapterTitle} • Section ${section.Section ?? ''}`.trim(),
          content: section.Content ?? '',
          ...(section.Proofs ? { Proofs: section.Proofs } : {})
        });
      }
    }
    return sections;
  }

  if (format === 'Catechism') {
    if (!Array.isArray(data)) return [];
    return data.map((question, index) => ({
      id: `q-${question.Number ?? index + 1}`,
      title: `${question.Number ?? index + 1}. ${question.Question ?? ''}`.trim(),
      content: question.Answer ?? '',
      ...(question.Proofs ? { Proofs: question.Proofs } : {})
    }));
  }

  if (format === 'HenrysCatechism') {
    if (!Array.isArray(data)) return [];
    const sections = [];
    for (const question of data) {
      const number = question.Number ?? '';
      if (question.Question) {
        sections.push({
          id: `q-${number}`,
          title: `${number}. ${question.Question}`.trim(),
          content: question.Answer ?? '',
          ...(question.Proofs ? { Proofs: question.Proofs } : {})
        });
      }
      const subQuestions = question.SubQuestions ?? [];
      for (const sub of subQuestions) {
        const subNumber = sub.Number ?? '';
        sections.push({
          id: `q-${number}-${subNumber}`,
          title: `${number}.${subNumber} ${sub.Question ?? ''}`.trim(),
          content: sub.Answer ?? '',
          ...(sub.Proofs ? { Proofs: sub.Proofs } : {})
        });
      }
    }
    return sections;
  }

  if (typeof data.Content === 'string') {
    return [{ id: 'content', title: 'Content', content: data.Content }];
  }

  return [];
};

const loadCreedsJson = () => {
  const creedsDir = path.join(creedsRepoDir, 'creeds');
  const files = fs.readdirSync(creedsDir).filter((file) => file.endsWith('.json'));

  const documents = [];

  for (const filename of files) {
    const filePath = path.join(creedsDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const meta = data.Metadata ?? {};
    const creedFormat = meta.CreedFormat;
    documents.push({
      id: filename.replace('.json', ''),
      title: meta.Title ?? filename.replace('.json', ''),
      year: safeNumber(meta.Year),
      type: mapCreedsJsonType(creedFormat),
      source: 'creeds.json',
      sourceAttribution: meta.SourceAttribution ?? null,
      sourceUrl: meta.SourceUrl ?? null,
      sections: buildCreedsJsonSections(creedFormat, data.Data)
    });
  }

  return { documents };
};

const buildReformedSections = (doc) => {
  if (doc.type === 'creed') {
    const content = doc.text ?? doc.content ?? doc.creed ?? '';
    return [{ id: 'content', title: 'Content', content }];
  }

  if (doc.type === 'confession' && Array.isArray(doc.chapters)) {
    const sections = [];
    for (const chapter of doc.chapters) {
      const chapterTitle = `Chapter ${chapter.number ?? ''}: ${chapter.name ?? ''}`.trim();
      const articles = chapter.articles ?? [];
      for (const article of articles) {
        sections.push({
          id: `chapter-${chapter.number ?? 'x'}-article-${article.number ?? 'x'}`,
          title: `${chapterTitle} • Article ${article.number ?? ''}`.trim(),
          content: article.text ?? ''
        });
      }
    }
    return sections;
  }

  if (doc.type === 'catechism') {
    const sections = [];
    if (Array.isArray(doc.days)) {
      for (const day of doc.days) {
        const dayNumber = day.day ?? day.number ?? '';
        const questions = day.questions ?? [];
        for (const question of questions) {
          sections.push({
            id: `day-${dayNumber}-q-${question.number ?? ''}`,
            title: `Day ${dayNumber} • Q${question.number ?? ''}: ${question.question ?? ''}`.trim(),
            content: question.answer ?? ''
          });
        }
      }
      return sections;
    }

    if (Array.isArray(doc.questions)) {
      for (const question of doc.questions) {
        sections.push({
          id: `q-${question.number ?? ''}`,
          title: `Q${question.number ?? ''}: ${question.question ?? ''}`.trim(),
          content: question.answer ?? ''
        });
      }
      return sections;
    }
  }

  return [];
};

const loadReformedStandards = () => {
  const dataDir = path.join(reformedRepoDir, 'data');
  const documents = [];

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.yaml')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const doc = yaml.parse(raw);
        if (!doc || !doc.type) continue;
        if (!['creed', 'confession', 'catechism'].includes(doc.type)) continue;

        const relDir = path.relative(dataDir, path.dirname(fullPath));
        const collection = relDir.split(path.sep)[0] || 'reformed-standards';
        const id = path.basename(entry.name, '.yaml');

        documents.push({
          id: `rs-${id}`,
          title: doc.name ?? id,
          year: safeNumber(doc.publication_year),
          type: doc.type,
          source: 'reformed-standards',
          sourceAttribution: 'Reformed Standards (Apache-2.0)',
          sourceUrl: null,
          collection,
          sections: buildReformedSections(doc)
        });
      }
    }
  };

  walk(dataDir);
  return documents;
};

const main = () => {
  ensureDir(tmpDir);
  ensureDir(outputDir);

  console.log('Cloning Creeds.json...');
  cloneRepo(CREEDS_REPO, creedsRepoDir);

  console.log('Cloning Reformed Standards compendium...');
  cloneRepo(REFORMED_REPO, reformedRepoDir);

  console.log('Processing Creeds.json (all documents)...');
  const { documents: creedsDocs } = loadCreedsJson();

  console.log('Processing Reformed Standards...');
  const reformedDocs = loadReformedStandards();

  const payload = {
    generatedAt: new Date().toISOString(),
    counts: {
      creedsJsonIncluded: creedsDocs.length,
      creedsJsonSkipped: 0,
      reformedStandardsIncluded: reformedDocs.length
    },
    creedsJsonSkipped: [],
    documents: [...creedsDocs, ...reformedDocs]
  };

  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${payload.documents.length} documents to ${outputFile}`);

  cleanDir(tmpDir);
};

main();

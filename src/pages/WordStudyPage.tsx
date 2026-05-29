import { useSearchParams } from 'react-router-dom';
import WordStudy from '../components/WordStudy';

export default function WordStudyPage() {
  const [searchParams] = useSearchParams();
  const strongsParam = searchParams.get('strongs');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Greek & Hebrew Word Study
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore the original languages of Scripture with STEPBible lexicon data
          </p>
        </div>

        {/* Word Study Component */}
        <WordStudy initialStrongs={strongsParam || undefined} />

        {/* Quick Reference Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📚 Quick Reference
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hebrew Examples */}
            <div>
              <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2">
                🇮🇱 Common Hebrew Words
              </h4>
              <div className="space-y-2">
                {[
                  { strongs: 'H430', word: 'אֱלֹהִים', gloss: 'God (Elohim)' },
                  { strongs: 'H3068', word: 'יְהוָה', gloss: 'LORD (Yahweh)' },
                  { strongs: 'H2617', word: 'חֶסֶד', gloss: 'Steadfast love (Hesed)' },
                  { strongs: 'H7307', word: 'רוּחַ', gloss: 'Spirit/breath (Ruach)' },
                  { strongs: 'H8451', word: 'תּוֹרָה', gloss: 'Law/instruction (Torah)' },
                ].map(({ strongs, word, gloss }) => (
                  <a
                    key={strongs}
                    href={`?strongs=${strongs}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <span className="text-xl font-hebrew">{word}</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
                      {strongs}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{gloss}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Greek Examples */}
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">
                🇬🇷 Common Greek Words
              </h4>
              <div className="space-y-2">
                {[
                  { strongs: 'G26', word: 'ἀγάπη', gloss: 'Love (Agape)' },
                  { strongs: 'G4102', word: 'πίστις', gloss: 'Faith (Pistis)' },
                  { strongs: 'G5485', word: 'χάρις', gloss: 'Grace (Charis)' },
                  { strongs: 'G3056', word: 'λόγος', gloss: 'Word (Logos)' },
                  { strongs: 'G2316', word: 'θεός', gloss: 'God (Theos)' },
                ].map(({ strongs, word, gloss }) => (
                  <a
                    key={strongs}
                    href={`?strongs=${strongs}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <span className="text-xl font-greek">{word}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                      {strongs}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{gloss}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            About This Tool
          </h3>
          <p className="text-blue-800 dark:text-blue-300 mb-3">
            This word study tool uses lexicon data from STEPBible, a project of Tyndale House, Cambridge.
            The data includes over 9,000 Hebrew entries and 10,000 Greek entries with definitions,
            transliterations, and grammatical information.
          </p>
          <ul className="list-disc list-inside text-blue-700 dark:text-blue-400 space-y-1 text-sm">
            <li>Hebrew lexicon based on Brown-Driver-Briggs (BDB)</li>
            <li>Greek lexicon based on Abbott-Smith and Liddell-Scott-Jones</li>
            <li>Extended Strong's numbers for precise word identification</li>
            <li>Grammatical parsing and morphology information</li>
          </ul>
          <p className="mt-3 text-xs text-blue-600 dark:text-blue-500">
            Data licensed under CC BY 4.0 - STEPBible.org / Tyndale House Cambridge
          </p>
        </div>
      </div>
    </div>
  );
}

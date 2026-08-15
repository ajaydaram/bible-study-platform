import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Languages, RotateCw } from 'lucide-react';
import InterlinearView from '../../components/InterlinearView';
import WordStudy from '../../components/WordStudy';

export default function InterlinearPage() {
  const [selectedStrongs, setSelectedStrongs] = useState<string | null>('G2316');
  const [currentBook, setCurrentBook] = useState('John');
  const [currentChapter, setCurrentChapter] = useState(1);

  const quickPassages = [
    { label: 'John 1 (Logos)', book: 'John', chapter: 1 },
    { label: 'Romans 8 (Life in Spirit)', book: 'Romans', chapter: 8 },
    { label: 'Ephesians 2 (Grace)', book: 'Ephesians', chapter: 2 },
    { label: 'Philippians 2 (Kenosis)', book: 'Philippians', chapter: 2 },
    { label: 'Colossians 1 (Supremacy)', book: 'Colossians', chapter: 1 },
    { label: 'Hebrews 1 (Son of God)', book: 'Hebrews', chapter: 1 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Original Language Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Greek & Hebrew Interlinear Studio
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Explore original manuscripts with word-by-word glosses, Strong's concordance numbers, and deep morphological syntax.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-col gap-2 flex-shrink-0">
          <Link
            to="/word-study"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            <span>Vocab Flashcards Studio</span>
          </Link>
        </div>
      </div>

      {/* Quick Passage Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex-shrink-0">
          Key Passages:
        </span>
        {quickPassages.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setCurrentBook(p.book);
              setCurrentChapter(p.chapter);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              currentBook === p.book && currentChapter === p.chapter
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Interlinear + Word Study Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interlinear View */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <InterlinearView 
            book={currentBook}
            chapter={currentChapter}
            onWordClick={(strongs) => setSelectedStrongs(strongs)}
          />
        </div>

        {/* Right: Word Study & Morphology Engine */}
        <div className="lg:col-span-6">
          <WordStudy 
            initialStrongs={selectedStrongs || undefined}
            onClose={() => setSelectedStrongs(null)}
          />
        </div>
      </div>
    </div>
  );
}

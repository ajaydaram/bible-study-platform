import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp, ExternalLink, Loader2, Calendar } from 'lucide-react';
import {
  getVerseCommentaries,
  formatVerseReference,
  PatristicCommentary
} from '../lib/patristicCommentary';

interface PatristicPanelProps {
  book: string;
  chapter: number;
  verse: number;
}

export const PatristicPanel: React.FC<PatristicPanelProps> = ({
  book,
  chapter,
  verse
}) => {
  const [commentaries, setCommentaries] = useState<PatristicCommentary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;

    async function loadCommentaries() {
      setLoading(true);
      setError(null);

      try {
        const results = await getVerseCommentaries(book, chapter, verse);
        
        if (mounted) {
          // Sort by year (oldest first)
          const sorted = results.sort((a, b) => {
            const yearA = a.year === 9999999 ? Infinity : a.year;
            const yearB = b.year === 9999999 ? Infinity : b.year;
            return yearA - yearB;
          });
          setCommentaries(sorted);
          
          // Auto-expand first 3
          const firstThree = sorted.slice(0, 3).map(c => c.id);
          setExpandedIds(new Set(firstThree));
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load Church Fathers commentaries');
          console.error('Error loading patristic commentaries:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCommentaries();

    return () => {
      mounted = false;
    };
  }, [book, chapter, verse]);

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600/50" />
        <span className="mt-2 text-sm text-slate-500">Loading Church Fathers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            Church Fathers
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {book} {chapter}:{verse} • {commentaries.length} {commentaries.length === 1 ? 'commentary' : 'commentaries'}
        </p>
      </div>

      {/* Commentaries list */}
      <div className="flex-1 overflow-y-auto">
        {commentaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 dark:text-slate-400">
            <Users className="h-8 w-8 opacity-50 mb-2" />
            <p className="text-sm">No patristic commentaries found</p>
            <p className="text-xs mt-1">Try selecting a different verse</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {commentaries.map((c) => {
              const isExpanded = expandedIds.has(c.id);
              
              return (
                <div key={c.id} className="bg-white dark:bg-slate-800/30">
                  {/* Commentary header */}
                  <button
                    onClick={() => toggleExpanded(c.id)}
                    className="w-full px-4 py-3 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                          {c.father}
                        </span>
                        {c.year && c.year !== 9999999 && c.year < 9999 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                            <Calendar className="h-3 w-3" />
                            {c.year < 0 ? `${Math.abs(c.year)} BC` : `AD ${c.year}`}
                          </span>
                        )}
                      </div>
                      {c.suffix && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {c.suffix}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatVerseReference(c)} • {c.sourceTitle || 'Unknown source'}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                    )}
                  </button>

                  {/* Commentary content */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div 
                        className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 rounded-lg p-3"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {c.text.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      
                      {c.sourceUrl && (
                        <a
                          href={c.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 inline-flex"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Church Fathers Commentaries (Public Domain)
          <br />
          <a 
            href="https://github.com/HistoricalChristianFaith/Commentaries-Database"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Source: HistoricalChristianFaith
          </a>
        </p>
      </div>
    </div>
  );
};

export default PatristicPanel;

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { getChapterCommentary, formatVerseRange, CommentaryEntry } from '../lib/mhccCommentary';

interface CommentaryPanelProps {
  book: string;
  chapter: number;
  currentVerse?: number;
  onVerseClick?: (verse: number) => void;
}

export const CommentaryPanel: React.FC<CommentaryPanelProps> = ({
  book,
  chapter,
  currentVerse,
  onVerseClick
}) => {
  const [commentary, setCommentary] = useState<CommentaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCommentary() {
      setLoading(true);
      setError(null);

      try {
        const entries = await getChapterCommentary(book, chapter);
        
        if (mounted) {
          setCommentary(entries);
          
          // Auto-expand the entry containing the current verse
          if (currentVerse) {
            const matchingEntry = entries.find(e => 
              e.verseRange !== 'intro' && isVerseInRange(currentVerse, e.verseRange)
            );
            if (matchingEntry) {
              setExpandedEntries(new Set([matchingEntry.verseRange]));
            } else {
              setExpandedEntries(new Set());
            }
          } else {
            // Expand first entry by default
            if (entries.length > 0) {
              setExpandedEntries(new Set([entries[0].verseRange]));
            }
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load commentary');
          console.error('Error loading commentary:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCommentary();

    return () => {
      mounted = false;
    };
  }, [book, chapter, currentVerse]);

  const toggleEntry = (verseRange: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(verseRange)) {
        next.delete(verseRange);
      } else {
        next.add(verseRange);
      }
      return next;
    });
  };

  const handleVerseClick = (verseRange: string) => {
    if (verseRange === 'intro' || !onVerseClick) return;
    
    const startVerse = parseInt(verseRange.split('-')[0]);
    if (!isNaN(startVerse)) {
      onVerseClick(startVerse);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <BookOpen className="h-6 w-6 text-amber-600/50 dark:text-amber-400/50" />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Loading commentary...
          </span>
        </div>
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

  if (commentary.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 dark:text-slate-400">
        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No commentary available for {book} {chapter}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            Matthew Henry Commentary
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {book} {chapter} • {commentary.length} {commentary.length === 1 ? 'section' : 'sections'}
        </p>
      </div>

      {/* Commentary entries */}
      <div className="flex-1 overflow-y-auto">
        {commentary.map((entry) => {
          const isExpanded = expandedEntries.has(entry.verseRange);
          const isCurrentVerse = currentVerse && 
            entry.verseRange !== 'intro' && 
            isVerseInRange(currentVerse, entry.verseRange);

          return (
            <div 
              key={entry.verseRange}
              className={`border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 ${
                isCurrentVerse ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
              }`}
            >
              {/* Entry header */}
              <button
                onClick={() => toggleEntry(entry.verseRange)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isCurrentVerse 
                      ? 'text-amber-700 dark:text-amber-400' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {formatVerseRange(entry.verseRange)}
                  </span>
                  {isCurrentVerse && (
                    <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                      Current
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {/* Entry content */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div 
                    className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {entry.text.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {entry.verseRange !== 'intro' && onVerseClick && (
                    <button
                      onClick={() => handleVerseClick(entry.verseRange)}
                      className="mt-3 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Go to {entry.verseRange.includes('-') ? 'verse ' + entry.verseRange.split('-')[0] : 'verse ' + entry.verseRange}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Matthew Henry Concise Commentary (1706)
          <br />
          <a 
            href="https://www.ccel.org/ccel/henry/mhc.i.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Source: Christian Classics Ethereal Library
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * Check if a verse number falls within a verse range
 */
function isVerseInRange(verse: number, range: string): boolean {
  if (range.includes('-')) {
    const [start, end] = range.split('-').map(Number);
    return verse >= start && verse <= end;
  }
  return verse === parseInt(range);
}

/**
 * Compact badge showing commentary is available for a verse
 */
export const CommentaryBadge: React.FC<{
  book: string;
  chapter: number;
  verse: number;
  onClick?: () => void;
}> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors"
      title="View Matthew Henry Commentary"
    >
      <BookOpen className="h-3 w-3" />
      <span>MHC</span>
    </button>
  );
};

export default CommentaryPanel;

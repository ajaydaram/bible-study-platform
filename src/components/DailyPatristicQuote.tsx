import { useState, useEffect } from 'react';
import { 
  Quote, 
  BookOpen, 
  Clock, 
  MapPin, 
  ChevronRight,
  RefreshCw,
  Share2,
  Heart
} from 'lucide-react';
import {
  getDailyQuote,
  getRandomQuote,
  getFatherById,
  type PatristicQuote,
  type ChurchFather
} from '../data/churchFathers';

interface DailyPatristicQuoteProps {
  onViewFather?: (fatherId: string) => void;
}

export default function DailyPatristicQuote({ onViewFather }: DailyPatristicQuoteProps) {
  const [quote, setQuote] = useState<PatristicQuote | null>(null);
  const [father, setFather] = useState<ChurchFather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const loadDailyQuote = () => {
    setIsLoading(true);
    const dailyQuote = getDailyQuote();
    setQuote(dailyQuote);
    setFather(getFatherById(dailyQuote.fatherId) || null);
    setIsLoading(false);
  };

  const loadRandomQuote = () => {
    setIsLoading(true);
    const randomQuote = getRandomQuote();
    setQuote(randomQuote);
    setFather(getFatherById(randomQuote.fatherId) || null);
    setLiked(false);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleShare = async () => {
    if (!quote || !father) return;
    
    const shareText = `"${quote.text}"\n\n— ${father.name}, ${quote.source}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Patristic Quote - Scriptorium',
          text: shareText
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Quote copied to clipboard!');
    }
  };

  if (isLoading || !quote || !father) {
    return (
      <div className="patristic-quote-card animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  const eraColors = {
    'apostolic': 'from-amber-600 to-orange-600',
    'ante-nicene': 'from-emerald-600 to-teal-600',
    'nicene': 'from-blue-600 to-indigo-600',
    'post-nicene': 'from-purple-600 to-violet-600'
  };

  return (
    <div className="patristic-quote-card overflow-hidden animate-fade-in">
      {/* Header Gradient */}
      <div className={`bg-gradient-to-r ${eraColors[father.era]} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Quote className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                Daily Patristic Quote
              </p>
              <h3 className="text-white font-semibold">{father.name}</h3>
            </div>
          </div>
          <button
            onClick={loadRandomQuote}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Get another quote"
          >
            <RefreshCw className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Quote Content */}
      <div className="p-6">
        <blockquote className="font-scripture text-xl leading-relaxed text-gray-800 dark:text-gray-200 mb-6">
          "{quote.text}"
        </blockquote>

        {/* Source & Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {quote.source}
            {quote.chapter && `, ${quote.chapter}`}
          </span>
          {quote.year && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              c. {quote.year} AD
            </span>
          )}
        </div>

        {/* Themes */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quote.themes.slice(0, 4).map(theme => (
            <span
              key={theme}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium capitalize"
            >
              {theme}
            </span>
          ))}
        </div>

        {/* Scripture References */}
        {quote.scriptureRefs && quote.scriptureRefs.length > 0 && (
          <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
              Related Scripture
            </p>
            <div className="flex flex-wrap gap-2">
              {quote.scriptureRefs.map(ref => (
                <span
                  key={ref}
                  className="px-2.5 py-1 bg-amber-100 dark:bg-amber-800/30 text-amber-800 dark:text-amber-300 rounded text-sm font-medium"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-lg transition-colors ${
                liked 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          
          {onViewFather && (
            <button
              onClick={() => onViewFather(father.id)}
              className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Learn about {father.name}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Father Info Card */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${eraColors[father.era]} flex items-center justify-center text-white font-bold text-lg`}>
            {father.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {father.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {father.title} • {father.dates}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400 dark:text-gray-500">
              <MapPin className="h-3 w-3" />
              {father.location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

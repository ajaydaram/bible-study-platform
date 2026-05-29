import { useState } from 'react';
import { Church, BookOpen, Calendar, Users, Quote, Scroll } from 'lucide-react';
import DailyPatristicQuote from '../components/DailyPatristicQuote';
import HistoricalTimeline from '../components/HistoricalTimeline';
import ChurchFatherExplorer from '../components/ChurchFatherExplorer';
import CreedsConfessions from '../components/CreedsConfessions';

type ViewMode = 'overview' | 'timeline' | 'fathers' | 'creeds';

export default function ChurchHistory() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedFatherId, setSelectedFatherId] = useState<string | null>(null);

  const handleViewFather = (fatherId: string) => {
    setSelectedFatherId(fatherId);
    setViewMode('fathers');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
          <Church className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Church History
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore the first 500 years of Christianity
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => setViewMode('overview')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'overview'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'timeline'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Timeline
        </button>
        <button
          onClick={() => setViewMode('fathers')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'fathers'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Church Fathers
        </button>
        <button
          onClick={() => setViewMode('creeds')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'creeds'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Scroll className="h-4 w-4" />
          Creeds & Confessions
        </button>
      </div>

      {/* Content */}
      {viewMode === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Daily Quote */}
          <div className="lg:col-span-2">
            <DailyPatristicQuote onViewFather={handleViewFather} />
          </div>

          {/* Era Cards */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Historical Eras
            </h2>
            <div className="space-y-3">
              {[
                { id: 'apostolic', name: 'Apostolic Era', years: '30-100 AD', color: 'from-amber-500 to-orange-500', desc: 'The apostles and their immediate disciples' },
                { id: 'ante-nicene', name: 'Ante-Nicene Era', years: '100-325 AD', color: 'from-emerald-500 to-teal-500', desc: 'Before the Council of Nicaea' },
                { id: 'nicene', name: 'Nicene Era', years: '325-381 AD', color: 'from-blue-500 to-indigo-500', desc: 'The great trinitarian councils' },
                { id: 'post-nicene', name: 'Post-Nicene Era', years: '381-500 AD', color: 'from-purple-500 to-violet-500', desc: 'The golden age of the fathers' }
              ].map(era => (
                <button
                  key={era.id}
                  onClick={() => setViewMode('timeline')}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${era.color} flex items-center justify-center`}>
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {era.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {era.years} • {era.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What You'll Learn
              </h2>
              <ul className="space-y-3">
                {[
                  { icon: Users, text: '16+ Church Fathers from all four eras' },
                  { icon: Quote, text: '30+ patristic quotes with sources' },
                  { icon: Calendar, text: '25+ key historical events' },
                  { icon: Church, text: 'Major councils & creeds explained' },
                  { icon: Scroll, text: 'Creeds & confessions across centuries' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <item.icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">
                Why Study Church History?
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                "Those who cannot remember the past are condemned to repeat it." Understanding how early Christians interpreted Scripture and defended the faith helps us navigate today's challenges.
              </p>
              <button
                onClick={() => setViewMode('fathers')}
                className="px-4 py-2 bg-white text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors"
              >
                Explore Church Fathers
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="animate-fade-in">
          <HistoricalTimeline onSelectFather={handleViewFather} />
        </div>
      )}

      {viewMode === 'fathers' && (
        <div className="animate-fade-in">
          <ChurchFatherExplorer 
            initialFatherId={selectedFatherId || undefined}
            onClose={() => {
              setSelectedFatherId(null);
              setViewMode('overview');
            }}
          />
        </div>
      )}

      {viewMode === 'creeds' && (
        <div className="animate-fade-in">
          <CreedsConfessions />
        </div>
      )}

      {/* Attribution */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Primary sources from CCEL.org & Early Christian Writings • Public Domain
        </p>
      </div>
    </div>
  );
}

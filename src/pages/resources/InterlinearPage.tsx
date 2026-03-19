import InterlinearView from '../../components/InterlinearView';
import WordStudy from '../../components/WordStudy';
import { useState } from 'react';

export default function InterlinearPage() {
  const [selectedStrongs, setSelectedStrongs] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Interlinear View */}
        <div className="lg:col-span-1">
          <InterlinearView 
            book="John"
            chapter={1}
            onWordClick={(strongs) => setSelectedStrongs(strongs)}
          />
        </div>

        {/* Word Study Panel */}
        <div className="lg:col-span-1">
          <WordStudy 
            initialStrongs={selectedStrongs || undefined}
            onClose={() => setSelectedStrongs(null)}
          />
        </div>
      </div>
    </div>
  );
}

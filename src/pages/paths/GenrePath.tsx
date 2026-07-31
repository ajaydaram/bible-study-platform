import { useState } from 'react'
import { BIBLICAL_GENRES, getGenreById, BiblicalGenre } from '../../data/genreData'
import GenreWorkbench from '../../components/GenreWorkbench'
import GuidedAscentStepper from '../../components/GuidedAscentStepper'
import UnifiedHermeneuticsBanner from '../../components/UnifiedHermeneuticsBanner'
import { Sparkles } from 'lucide-react'
import clsx from 'clsx'

export default function GenrePath() {
  const [selectedGenreId, setSelectedGenreId] = useState<string>('torah')
  const [activeReference, setActiveReference] = useState<string>('Exodus 20:1–17')

  const currentGenre: BiblicalGenre = getGenreById(selectedGenreId)

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenreId(genreId)
    const genre = getGenreById(genreId)
    if (genre.keyPassages.length > 0) {
      setActiveReference(genre.keyPassages[0].reference)
    }
  }

  const handleSelectPassage = (ref: string) => {
    setActiveReference(ref)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Literary Genre Path • Exegetical Hermeneutics
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Mastering Literary Forms & Hermeneutic Rules
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            God did not speak in a flat monologue; He inspired 7 distinct literary genres. Discover how Torah law, historical narrative, Hebrew poetry, prophetic oracles, Gospel parables, apostolic epistles, and apocalyptic visions communicate God’s unified message.
          </p>

          {/* 7 Genre Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {BIBLICAL_GENRES.map((g) => {
              const isActive = selectedGenreId === g.id
              return (
                <button
                  key={g.id}
                  onClick={() => handleSelectGenre(g.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                  )}
                >
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Guided Ascent Stepper */}
      <GuidedAscentStepper passageTitle={`${currentGenre.name} (${activeReference})`} />

      {/* UNIFIED HERMENEUTICAL TRIAD BANNER */}
      <UnifiedHermeneuticsBanner referenceKey={activeReference} />

      {/* Genre Workbench */}
      <GenreWorkbench genre={currentGenre} onSelectPassage={handleSelectPassage} />
    </div>
  )
}

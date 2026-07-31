import { useState } from 'react'
import { Eye, BookOpen, Award, CheckCircle2, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  passageTitle?: string
}

export default function GuidedAscentStepper({ passageTitle = 'Active Passage' }: Props) {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1)

  const stages = [
    {
      id: 1 as const,
      title: 'Stage 1: Observation Reading',
      subtitle: 'What does the text say?',
      icon: Eye,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-500',
      borderColor: 'border-blue-500',
      bgLight: 'bg-blue-50 dark:bg-blue-950/40',
      description: 'Observe key words, repeated themes, literary form, grammar, and character actions without rushing to interpretation.',
      prompts: [
        'What words or phrases are repeated in this passage?',
        'Who is speaking, and who is the audience?',
        'What literary genre (law, narrative, poetry, epistle) is being used?'
      ]
    },
    {
      id: 2 as const,
      title: 'Stage 2: Contextual Interpretation',
      subtitle: 'What did it mean to original hearers?',
      icon: BookOpen,
      color: 'from-purple-600 to-amber-600',
      textColor: 'text-purple-500',
      borderColor: 'border-purple-500',
      bgLight: 'bg-purple-50 dark:bg-purple-950/40',
      description: 'Analyze the historical, cultural, and covenant context. How does this fit into the broader narrative of the book?',
      prompts: [
        'What was the historical situation of the author and audience?',
        'How does the surrounding chapter shape the meaning of this passage?',
        'What covenant administration (Mosaic, Davidic, New Covenant) is active?'
      ]
    },
    {
      id: 3 as const,
      title: 'Stage 3: Redemptive Mastery',
      subtitle: 'How does it center on Christ & transform us?',
      icon: Award,
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-500',
      borderColor: 'border-emerald-500',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      description: 'Synthesize the passage through Christ’s cross and resurrection, applying its timeless truth to daily faith and obedience.',
      prompts: [
        'How does this passage point to or find fulfillment in Jesus Christ?',
        'What truth about God’s character demands my worship?',
        'What specific act of faith or obedience is God calling me to live out today?'
      ]
    }
  ]

  const current = stages.find((s) => s.id === activeStage)!

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-500 font-bold">
            Pedagogical Framework • {passageTitle}
          </span>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Guided Ascent to Scripture Mastery
          </h3>
        </div>
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold font-mono">
          Stage {activeStage} of 3
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-3 gap-2">
        {stages.map((stage) => {
          const Icon = stage.icon
          const isCurrent = stage.id === activeStage
          const isDone = stage.id < activeStage

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={clsx(
                'p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2',
                isCurrent
                  ? `border-2 ${stage.borderColor} ${stage.bgLight} shadow-md`
                  : isDone
                  ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-70'
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className={clsx('w-5 h-5', isCurrent ? stage.textColor : 'text-gray-400')} />
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {stage.title}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                  {stage.subtitle}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Stage Card */}
      <div className={clsx('p-6 rounded-2xl border space-y-4', current.bgLight, current.borderColor)}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-r ${current.color} text-white shadow-md`}>
            <current.icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{current.title}</h4>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{current.subtitle}</p>
          </div>
        </div>

        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
          {current.description}
        </p>

        <div className="space-y-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
          <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Guided Exegetical Checkpoints:
          </h5>
          <ul className="space-y-1.5">
            {current.prompts.map((prompt, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-800 dark:text-gray-200">
                <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

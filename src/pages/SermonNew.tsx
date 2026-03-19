import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { addSermon } from '../lib/firestore'
import type { Sermon, SermonExegesis, SermonTheology, SermonHomiletics, SermonMovement } from '../types'
import {
  BookOpen,
  Lightbulb,
  Mic,
  ArrowLeft,
  ArrowRight,
  Save,
  Plus,
  Trash2,
  HelpCircle
} from 'lucide-react'
import clsx from 'clsx'

const emptyExegesis: SermonExegesis = {
  prayedForUnderstanding: false,
  textIsolated: '',
  who: '',
  what: '',
  why: '',
  when: '',
  where: '',
  how: '',
  textOutline: '',
  subject: '',
  complement: '',
  textPurpose: '',
  purposeType: '',
  desiredChange: '',
  centralProposition: ''
}

const emptyTheology: SermonTheology = {
  crossReferences: '',
  theologicalOutline: '',
  theologicalSubject: '',
  theologicalComplement: '',
  theologicalPrinciple: '',
  theologicalPurpose: '',
  centralProposition: ''
}

const emptyHomiletics: SermonHomiletics = {
  homilетicalPurpose: '',
  goals: [],
  explanation: '',
  validation: '',
  application: '',
  homilетicalProposition: '',
  audienceProfile: '',
  audienceNeeds: [],
  sermonForm: '',
  introduction: '',
  movements: [],
  conclusion: '',
  illustrations: [],
  supportingMaterials: ''
}

export default function SermonNew() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStage, setCurrentStage] = useState<'exegesis' | 'theology' | 'homiletics'>('exegesis')
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [passage, setPassage] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [exegesis, setExegesis] = useState<SermonExegesis>(emptyExegesis)
  const [theology, setTheology] = useState<SermonTheology>(emptyTheology)
  const [homiletics, setHomiletics] = useState<SermonHomiletics>(emptyHomiletics)

  const handleSave = async (stage: Sermon['stage'] = currentStage) => {
    if (!user?.id) return
    
    setSaving(true)
    try {
      const sermon: Omit<Sermon, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        passage,
        date,
        stage,
        exegesis,
        theology,
        homiletics,
        notes,
        userId: user.id
      }
      
      await addSermon(sermon)
      navigate('/sermons')
    } catch (error) {
      console.error('Error saving sermon:', error)
    } finally {
      setSaving(false)
    }
  }

  const addMovement = () => {
    const newMovement: SermonMovement = {
      id: Date.now().toString(),
      title: '',
      content: '',
      application: ''
    }
    setHomiletics(prev => ({
      ...prev,
      movements: [...prev.movements, newMovement]
    }))
  }

  const updateMovement = (id: string, field: keyof SermonMovement, value: string) => {
    setHomiletics(prev => ({
      ...prev,
      movements: prev.movements.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }))
  }

  const removeMovement = (id: string) => {
    setHomiletics(prev => ({
      ...prev,
      movements: prev.movements.filter(m => m.id !== id)
    }))
  }

  const stages = [
    { id: 'exegesis', label: 'Exegesis', icon: BookOpen, color: 'blue' },
    { id: 'theology', label: 'Theology', icon: Lightbulb, color: 'purple' },
    { id: 'homiletics', label: 'Homiletics', icon: Mic, color: 'orange' }
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/sermons')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Sermon</h1>
        </div>
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sermon Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Power of Grace"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scripture Passage
            </label>
            <input
              type="text"
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              placeholder="e.g., Romans 8:28-39"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preaching Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {stages.map((stage) => {
          const Icon = stage.icon
          return (
            <button
              key={stage.id}
              onClick={() => setCurrentStage(stage.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors',
                currentStage === stage.id
                  ? `bg-white dark:bg-gray-800 text-${stage.color}-600 shadow-sm`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {stage.label}
            </button>
          )
        })}
      </div>

      {/* Exegesis Stage */}
      {currentStage === 'exegesis' && (
        <div className="space-y-6">
          {/* Prayer Check */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exegesis.prayedForUnderstanding}
                onChange={(e) => setExegesis(prev => ({ ...prev, prayedForUnderstanding: e.target.checked }))}
                className="w-5 h-5 rounded text-blue-600"
              />
              <span className="text-gray-900 dark:text-white font-medium">
                I have prayed for understanding of this passage
              </span>
            </label>
          </div>

          {/* Text Isolation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Text Isolation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Write out the text you are studying
              </label>
              <textarea
                value={exegesis.textIsolated}
                onChange={(e) => setExegesis(prev => ({ ...prev, textIsolated: e.target.value }))}
                rows={4}
                placeholder="Copy or type the biblical text here..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 6 Friends - Inductive Study */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">The 6 Friends</h3>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  Use these 6 questions to conduct inductive Bible study and discover the author's intent.
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'who', label: 'WHO?', placeholder: 'Who is speaking? Who is addressed? Who are the main characters?' },
                { key: 'what', label: 'WHAT?', placeholder: 'What is happening? What is the main subject? What are the key words?' },
                { key: 'why', label: 'WHY?', placeholder: 'Why was this written? Why is this important? Why did this happen?' },
                { key: 'when', label: 'WHEN?', placeholder: 'When did this happen? When was it written? What is the time context?' },
                { key: 'where', label: 'WHERE?', placeholder: 'Where did this take place? Where was the author? Where were the readers?' },
                { key: 'how', label: 'HOW?', placeholder: 'How should we respond? How does this apply? How is this accomplished?' }
              ].map((q) => (
                <div key={q.key}>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {q.label}
                  </label>
                  <textarea
                    value={exegesis[q.key as keyof SermonExegesis] as string}
                    onChange={(e) => setExegesis(prev => ({ ...prev, [q.key]: e.target.value }))}
                    rows={3}
                    placeholder={q.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Outline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Text Outline</h3>
            <textarea
              value={exegesis.textOutline}
              onChange={(e) => setExegesis(prev => ({ ...prev, textOutline: e.target.value }))}
              rows={6}
              placeholder="Outline the structure and flow of the text..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Propositional Statement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Propositional Statement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject: What is the author talking about?
                </label>
                <input
                  type="text"
                  value={exegesis.subject}
                  onChange={(e) => setExegesis(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Use the 6 friends to identify the subject..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complement: What is the answer to what he is talking about?
                </label>
                <input
                  type="text"
                  value={exegesis.complement}
                  onChange={(e) => setExegesis(prev => ({ ...prev, complement: e.target.value }))}
                  placeholder="The complement answers the question raised by the subject..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Establish the Text's Purpose</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Why is this text placed in this context? What is its purpose?
                </label>
                <textarea
                  value={exegesis.textPurpose}
                  onChange={(e) => setExegesis(prev => ({ ...prev, textPurpose: e.target.value }))}
                  rows={3}
                  placeholder="Explain why this text appears in this particular context..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What is the author trying to get readers to do?
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'exhortation', label: 'Exhortation (start doing)' },
                    { value: 'warning', label: 'Warning (stop doing)' },
                    { value: 'encouragement', label: 'Encouragement (continue doing)' }
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="purposeType"
                        value={opt.value}
                        checked={exegesis.purposeType === opt.value}
                        onChange={(e) => setExegesis(prev => ({ ...prev, purposeType: e.target.value as SermonExegesis['purposeType'] }))}
                        className="text-primary-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  How is this text designed to change attitudes and/or actions?
                </label>
                <textarea
                  value={exegesis.desiredChange}
                  onChange={(e) => setExegesis(prev => ({ ...prev, desiredChange: e.target.value }))}
                  rows={2}
                  placeholder="What does the author want the audience to believe more strongly, feel more deeply, or do more readily?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Exegetical Central Proposition */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exegetical Central Proposition</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Combine your subject and complement into a single, concrete, specific, time-bound statement.
            </p>
            <textarea
              value={exegesis.centralProposition}
              onChange={(e) => setExegesis(prev => ({ ...prev, centralProposition: e.target.value }))}
              rows={3}
              placeholder="e.g., 'The reason the Ephesian believers were to praise God, according to Paul's observation, was because He has guaranteed their future inheritance through the ministry of the Holy Spirit.'"
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStage('theology')}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Theology
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Theology Stage */}
      {currentStage === 'theology' && (
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-gray-900 dark:text-white">
              <strong>From Exegesis to Theology:</strong> Move from the concrete, specific, and time-bound 
              to the abstract, broad, and timeless. "Exegesis is parent, Theology is child."
            </p>
          </div>

          {/* Cross References */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cross References</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What does the rest of the Bible say about your proposition?
              </label>
              <textarea
                value={theology.crossReferences}
                onChange={(e) => setTheology(prev => ({ ...prev, crossReferences: e.target.value }))}
                rows={4}
                placeholder="List relevant cross-references and how they relate to your exegetical proposition..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Theological Outline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theological Outline</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Transform your exegetical outline into a theological outline (abstract, timeless).
            </p>
            <textarea
              value={theology.theologicalOutline}
              onChange={(e) => setTheology(prev => ({ ...prev, theologicalOutline: e.target.value }))}
              rows={6}
              placeholder="Outline the theological structure..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Theological Subject and Complement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theological Subject</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What does this passage say about God, His creation, and the relationship between them?
                </label>
                <textarea
                  value={theology.theologicalSubject}
                  onChange={(e) => setTheology(prev => ({ ...prev, theologicalSubject: e.target.value }))}
                  rows={3}
                  placeholder="Identify the theological subject..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theological Complement: What's the answer to the question above?
                </label>
                <textarea
                  value={theology.theologicalComplement}
                  onChange={(e) => setTheology(prev => ({ ...prev, theologicalComplement: e.target.value }))}
                  rows={2}
                  placeholder="The theological complement..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Theological Principle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theological Principle</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Express the theological principle in a timeless, universal statement
              </label>
              <textarea
                value={theology.theologicalPrinciple}
                onChange={(e) => setTheology(prev => ({ ...prev, theologicalPrinciple: e.target.value }))}
                rows={3}
                placeholder="A timeless truth that applies to all believers in all times..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Theological Purpose */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theological Purpose</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What is the timeless purpose that flows from the theological proposition?
              </label>
              <textarea
                value={theology.theologicalPurpose}
                onChange={(e) => setTheology(prev => ({ ...prev, theologicalPurpose: e.target.value }))}
                rows={3}
                placeholder="The theological purpose statement..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Theological Central Proposition */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Theological Central Proposition</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              The abstract, broad, timeless statement of the passage's theological meaning.
            </p>
            <textarea
              value={theology.centralProposition}
              onChange={(e) => setTheology(prev => ({ ...prev, centralProposition: e.target.value }))}
              rows={3}
              placeholder="e.g., 'God's demonstration of His love convinces believers that separation from that love is impossible.'"
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStage('exegesis')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Exegesis
            </button>
            <button
              onClick={() => setCurrentStage('homiletics')}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue to Homiletics
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Homiletics Stage */}
      {currentStage === 'homiletics' && (
        <div className="space-y-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
            <p className="text-gray-900 dark:text-white">
              <strong>From Theology to Homiletics:</strong> Shape the timeless truth for timely application. 
              Answer three questions: "Explain it", "Prove it", "Apply it".
            </p>
          </div>

          {/* Homiletical Purpose */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Homiletical Purpose</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What do you want to see achieved in the lives of your listeners?
                </label>
                <textarea
                  value={homiletics.homilетicalPurpose}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, homilетicalPurpose: e.target.value }))}
                  rows={3}
                  placeholder="As a result of this sermon, my listeners will..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* 3 Developmental Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">The 3 Developmental Questions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              We will ACT only on what we BELIEVE, and we can BELIEVE only what we UNDERSTAND.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <label className="block text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">
                  1. "I don't understand, please explain" (Explanation)
                </label>
                <textarea
                  value={homiletics.explanation}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, explanation: e.target.value }))}
                  rows={3}
                  placeholder="What needs to be explained so listeners understand? What did the author explain that my audience might not grasp?"
                  className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <label className="block text-sm font-bold text-purple-700 dark:text-purple-300 mb-1">
                  2. "Prove it and I will believe it" (Validation)
                </label>
                <textarea
                  value={homiletics.validation}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, validation: e.target.value }))}
                  rows={3}
                  placeholder="What obstacles to belief need to be addressed? What competing values need to be refuted? What connections need to be shown?"
                  className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <label className="block text-sm font-bold text-orange-700 dark:text-orange-300 mb-1">
                  3. "So, what do I do about it?" (Application)
                </label>
                <textarea
                  value={homiletics.application}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, application: e.target.value }))}
                  rows={3}
                  placeholder="What concrete steps should listeners take? How does this show up in real life? What changes does this demand?"
                  className="w-full px-3 py-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Audience Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audience Analysis</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Describe your audience
                </label>
                <textarea
                  value={homiletics.audienceProfile}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, audienceProfile: e.target.value }))}
                  rows={2}
                  placeholder="Demographics, spiritual condition, context..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Sermon Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sermon Form</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How will the sermon argue?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'deductive', label: 'Deductive', desc: 'Idea revealed in introduction, then developed' },
                    { value: 'inductive', label: 'Inductive', desc: 'Idea revealed late in body or conclusion' },
                    { value: 'semi-inductive', label: 'Semi-Inductive', desc: 'Idea revealed in middle of sermon' }
                  ].map((form) => (
                    <label
                      key={form.value}
                      className={clsx(
                        'flex flex-col p-4 border rounded-lg cursor-pointer transition-colors',
                        homiletics.sermonForm === form.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="sermonForm"
                          value={form.value}
                          checked={homiletics.sermonForm === form.value}
                          onChange={(e) => setHomiletics(prev => ({ ...prev, sermonForm: e.target.value as SermonHomiletics['sermonForm'] }))}
                          className="text-orange-600"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{form.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">{form.desc}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Homiletical Proposition */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Homiletical Proposition</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              State the proposition in the most exact, memorable, specific sentence possible. 
              It should be true to the text and grip the heads, hearts, and hands of listeners.
            </p>
            <textarea
              value={homiletics.homilетicalProposition}
              onChange={(e) => setHomiletics(prev => ({ ...prev, homilетicalProposition: e.target.value }))}
              rows={3}
              placeholder="e.g., 'God's expensive love guarantees your eternal relationship.'"
              className="w-full px-3 py-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Sermon Structure */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sermon Structure</h3>
            
            {/* Introduction */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Introduction
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Raise interest, surface needs, orient to subject, generate appetite for the Bible's answer
              </p>
              <textarea
                value={homiletics.introduction}
                onChange={(e) => setHomiletics(prev => ({ ...prev, introduction: e.target.value }))}
                rows={4}
                placeholder="How will you introduce the sermon?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Movements */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Movements (Main Points)
                </label>
                <button
                  onClick={addMovement}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Movement
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Think of the sermon as a series of movements that tie ideas together
              </p>
              
              {homiletics.movements.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No movements added yet</p>
                  <button
                    onClick={addMovement}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    Add your first movement
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {homiletics.movements.map((movement, index) => (
                    <div key={movement.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Movement {index + 1}</span>
                        <button
                          onClick={() => removeMovement(movement.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={movement.title}
                          onChange={(e) => updateMovement(movement.id, 'title', e.target.value)}
                          placeholder="Movement title/point"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                        <textarea
                          value={movement.content}
                          onChange={(e) => updateMovement(movement.id, 'content', e.target.value)}
                          placeholder="Content and development..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                        <textarea
                          value={movement.application}
                          onChange={(e) => updateMovement(movement.id, 'application', e.target.value)}
                          placeholder="Application for this point..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conclusion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conclusion
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Summarize the homiletical idea, drive home the main point
              </p>
              <textarea
                value={homiletics.conclusion}
                onChange={(e) => setHomiletics(prev => ({ ...prev, conclusion: e.target.value }))}
                rows={4}
                placeholder="How will you conclude and drive home the message?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Supporting Materials */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supporting Materials & Illustrations</h3>
            <textarea
              value={homiletics.supportingMaterials}
              onChange={(e) => setHomiletics(prev => ({ ...prev, supportingMaterials: e.target.value }))}
              rows={4}
              placeholder="Illustrations, stories, quotes, and other supporting materials..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any additional notes, reminders, or thoughts..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStage('theology')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Theology
            </button>
            <button
              onClick={() => handleSave('complete')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Complete Sermon'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

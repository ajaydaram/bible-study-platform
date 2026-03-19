import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getSermonById, updateSermon, deleteSermon } from '../lib/firestore'
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
  HelpCircle,
  AlertCircle
} from 'lucide-react'
import clsx from 'clsx'

export default function SermonEdit() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStage, setCurrentStage] = useState<'exegesis' | 'theology' | 'homiletics'>('exegesis')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [passage, setPassage] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [exegesis, setExegesis] = useState<SermonExegesis>({
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
  })
  const [theology, setTheology] = useState<SermonTheology>({
    crossReferences: '',
    theologicalOutline: '',
    theologicalSubject: '',
    theologicalComplement: '',
    theologicalPrinciple: '',
    theologicalPurpose: '',
    centralProposition: ''
  })
  const [homiletics, setHomiletics] = useState<SermonHomiletics>({
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
  })

  useEffect(() => {
    async function fetchSermon() {
      if (!id) return
      
      try {
        const sermon = await getSermonById(id)
        if (sermon) {
          setTitle(sermon.title)
          setPassage(sermon.passage)
          setDate(sermon.date)
          setNotes(sermon.notes)
          if (sermon.exegesis) setExegesis(sermon.exegesis)
          if (sermon.theology) setTheology(sermon.theology)
          if (sermon.homiletics) setHomiletics(sermon.homiletics)
          
          // Set current stage based on sermon stage
          if (sermon.stage === 'complete' || sermon.stage === 'homiletics') {
            setCurrentStage('homiletics')
          } else if (sermon.stage === 'theology') {
            setCurrentStage('theology')
          } else {
            setCurrentStage('exegesis')
          }
        }
      } catch (error) {
        console.error('Error fetching sermon:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSermon()
  }, [id])

  const handleSave = async (stage?: Sermon['stage']) => {
    if (!id || !user?.id) return
    
    setSaving(true)
    try {
      const updates: Partial<Sermon> = {
        title,
        passage,
        date,
        exegesis,
        theology,
        homiletics,
        notes
      }
      
      if (stage) {
        updates.stage = stage
      }
      
      await updateSermon(id, updates)
      navigate('/sermons')
    } catch (error) {
      console.error('Error saving sermon:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    try {
      await deleteSermon(id)
      navigate('/sermons')
    } catch (error) {
      console.error('Error deleting sermon:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Sermon</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
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

          {/* 6 Friends */}
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
                { key: 'who', label: 'WHO?', placeholder: 'Who is speaking? Who is addressed?' },
                { key: 'what', label: 'WHAT?', placeholder: 'What is happening? What is the main subject?' },
                { key: 'why', label: 'WHY?', placeholder: 'Why was this written? Why is this important?' },
                { key: 'when', label: 'WHEN?', placeholder: 'When did this happen? Time context?' },
                { key: 'where', label: 'WHERE?', placeholder: 'Where did this take place?' },
                { key: 'how', label: 'HOW?', placeholder: 'How should we respond?' }
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

          {/* Text Outline */}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complement: What is the answer?
                </label>
                <input
                  type="text"
                  value={exegesis.complement}
                  onChange={(e) => setExegesis(prev => ({ ...prev, complement: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Text's Purpose</h3>
            <div className="space-y-4">
              <textarea
                value={exegesis.textPurpose}
                onChange={(e) => setExegesis(prev => ({ ...prev, textPurpose: e.target.value }))}
                rows={3}
                placeholder="Why is this text placed in this context?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
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
              <textarea
                value={exegesis.desiredChange}
                onChange={(e) => setExegesis(prev => ({ ...prev, desiredChange: e.target.value }))}
                rows={2}
                placeholder="How is this text designed to change attitudes/actions?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Exegetical Central Proposition */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exegetical Central Proposition</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Concrete, specific, time-bound statement combining subject and complement.
            </p>
            <textarea
              value={exegesis.centralProposition}
              onChange={(e) => setExegesis(prev => ({ ...prev, centralProposition: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              <strong>From Exegesis to Theology:</strong> Move from concrete to abstract, specific to broad, time-bound to timeless.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cross References</h3>
            <textarea
              value={theology.crossReferences}
              onChange={(e) => setTheology(prev => ({ ...prev, crossReferences: e.target.value }))}
              rows={4}
              placeholder="What does the rest of the Bible say about your proposition?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theological Outline</h3>
            <textarea
              value={theology.theologicalOutline}
              onChange={(e) => setTheology(prev => ({ ...prev, theologicalOutline: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theological Subject & Complement</h3>
            <div className="space-y-4">
              <textarea
                value={theology.theologicalSubject}
                onChange={(e) => setTheology(prev => ({ ...prev, theologicalSubject: e.target.value }))}
                rows={3}
                placeholder="What does this passage say about God, His creation, and their relationship?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                value={theology.theologicalComplement}
                onChange={(e) => setTheology(prev => ({ ...prev, theologicalComplement: e.target.value }))}
                rows={2}
                placeholder="Theological complement..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theological Principle & Purpose</h3>
            <div className="space-y-4">
              <textarea
                value={theology.theologicalPrinciple}
                onChange={(e) => setTheology(prev => ({ ...prev, theologicalPrinciple: e.target.value }))}
                rows={3}
                placeholder="Timeless, universal theological principle..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                value={theology.theologicalPurpose}
                onChange={(e) => setTheology(prev => ({ ...prev, theologicalPurpose: e.target.value }))}
                rows={3}
                placeholder="Theological purpose statement..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Theological Central Proposition</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Abstract, broad, timeless.</p>
            <textarea
              value={theology.centralProposition}
              onChange={(e) => setTheology(prev => ({ ...prev, centralProposition: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStage('exegesis')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Exegesis
            </button>
            <button
              onClick={() => setCurrentStage('homiletics')}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
              <strong>From Theology to Homiletics:</strong> Shape timeless truth for timely application. Explain, Prove, Apply.
            </p>
          </div>

          {/* Purpose */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Homiletical Purpose</h3>
            <textarea
              value={homiletics.homilетicalPurpose}
              onChange={(e) => setHomiletics(prev => ({ ...prev, homilетicalPurpose: e.target.value }))}
              rows={3}
              placeholder="As a result of this sermon, my listeners will..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 3 Developmental Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">The 3 Developmental Questions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <label className="block text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">
                  1. Explanation - "Please explain"
                </label>
                <textarea
                  value={homiletics.explanation}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, explanation: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <label className="block text-sm font-bold text-purple-700 dark:text-purple-300 mb-1">
                  2. Validation - "Prove it"
                </label>
                <textarea
                  value={homiletics.validation}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, validation: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <label className="block text-sm font-bold text-orange-700 dark:text-orange-300 mb-1">
                  3. Application - "What do I do?"
                </label>
                <textarea
                  value={homiletics.application}
                  onChange={(e) => setHomiletics(prev => ({ ...prev, application: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Audience */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audience Analysis</h3>
            <textarea
              value={homiletics.audienceProfile}
              onChange={(e) => setHomiletics(prev => ({ ...prev, audienceProfile: e.target.value }))}
              rows={2}
              placeholder="Describe your audience..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Sermon Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sermon Form</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'deductive', label: 'Deductive' },
                { value: 'inductive', label: 'Inductive' },
                { value: 'semi-inductive', label: 'Semi-Inductive' }
              ].map((form) => (
                <label
                  key={form.value}
                  className={clsx(
                    'flex items-center gap-2 p-4 border rounded-lg cursor-pointer',
                    homiletics.sermonForm === form.value
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                >
                  <input
                    type="radio"
                    name="sermonForm"
                    value={form.value}
                    checked={homiletics.sermonForm === form.value}
                    onChange={(e) => setHomiletics(prev => ({ ...prev, sermonForm: e.target.value as SermonHomiletics['sermonForm'] }))}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{form.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Homiletical Proposition */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Homiletical Proposition</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Exact, memorable, specific.</p>
            <textarea
              value={homiletics.homilетicalProposition}
              onChange={(e) => setHomiletics(prev => ({ ...prev, homilетicalProposition: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Sermon Structure */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sermon Structure</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Introduction</label>
              <textarea
                value={homiletics.introduction}
                onChange={(e) => setHomiletics(prev => ({ ...prev, introduction: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Movements</label>
                <button onClick={addMovement} className="flex items-center gap-1 text-sm text-primary-600">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
              
              {homiletics.movements.map((movement, index) => (
                <div key={movement.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Movement {index + 1}</span>
                    <button onClick={() => removeMovement(movement.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={movement.title}
                    onChange={(e) => updateMovement(movement.id, 'title', e.target.value)}
                    placeholder="Point title"
                    className="w-full mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    value={movement.content}
                    onChange={(e) => updateMovement(movement.id, 'content', e.target.value)}
                    placeholder="Content..."
                    rows={3}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    value={movement.application}
                    onChange={(e) => updateMovement(movement.id, 'application', e.target.value)}
                    placeholder="Application..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conclusion</label>
              <textarea
                value={homiletics.conclusion}
                onChange={(e) => setHomiletics(prev => ({ ...prev, conclusion: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Supporting Materials */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supporting Materials</h3>
            <textarea
              value={homiletics.supportingMaterials}
              onChange={(e) => setHomiletics(prev => ({ ...prev, supportingMaterials: e.target.value }))}
              rows={4}
              placeholder="Illustrations, stories, quotes..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStage('theology')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Theology
            </button>
            <button
              onClick={() => handleSave('complete')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Complete'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Sermon?</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete this sermon. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Loader2,
  Headphones,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  getChapterAudioWithTimestamps,
  isBibleBrainConfigured,
  AUDIO_VERSIONS,
  DEFAULT_AUDIO_FILESET,
  type AudioTimestamp
} from '../lib/bibleBrain'

interface AudioPlayerProps {
  bookName: string
  chapter: number
  currentVerse?: number
  onVerseChange?: (verse: number) => void
  onClose?: () => void
  className?: string
}

export default function AudioPlayer({
  bookName,
  chapter,
  currentVerse,
  onVerseChange,
  onClose,
  className = ''
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [timestamps, setTimestamps] = useState<AudioTimestamp[]>([])
  const [selectedFileset, setSelectedFileset] = useState<string>(DEFAULT_AUDIO_FILESET)
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSpeedOptions, setShowSpeedOptions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Current verse based on timestamps
  const [activeVerse, setActiveVerse] = useState<number | null>(null)
  
  // Check API configuration
  const isConfigured = isBibleBrainConfigured()
  
  // Load audio when book/chapter changes
  useEffect(() => {
    if (!isConfigured) return
    
    loadAudio()
  }, [bookName, chapter, selectedFileset, isConfigured])
  
  const loadAudio = async () => {
    setIsLoading(true)
    setError(null)
    setAudioUrl(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    
    try {
      const result = await getChapterAudioWithTimestamps(bookName, chapter, selectedFileset)
      
      if (result.error) {
        setError(result.error)
      } else if (result.audioUrl) {
        setAudioUrl(result.audioUrl)
        setTimestamps(result.timestamps)
        if (result.duration) {
          setDuration(result.duration)
        }
      } else {
        setError('No audio available for this chapter')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audio')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update active verse based on current playback time
  useEffect(() => {
    if (timestamps.length === 0) return
    
    // Find the current verse based on timestamp
    let foundVerse: number | null = null
    for (let i = timestamps.length - 1; i >= 0; i--) {
      if (currentTime >= timestamps[i].timestamp) {
        foundVerse = timestamps[i].verse_start
        break
      }
    }
    
    if (foundVerse !== null && foundVerse !== activeVerse) {
      setActiveVerse(foundVerse)
      onVerseChange?.(foundVerse)
    }
  }, [currentTime, timestamps, activeVerse, onVerseChange])
  
  // Handle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }
  
  // Jump to specific verse
  const seekToVerse = (verse: number) => {
    const timestamp = timestamps.find(t => t.verse_start === verse)
    if (timestamp && audioRef.current) {
      audioRef.current.currentTime = timestamp.timestamp
      setCurrentTime(timestamp.timestamp)
      if (!isPlaying) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }
  
  // Skip forward/back
  const skip = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }
  
  // Volume control
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = vol
      setVolume(vol)
      setIsMuted(vol === 0)
    }
  }
  
  // Playback speed
  const changeSpeed = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
    setShowSpeedOptions(false)
  }
  
  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }
  
  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }
  
  // Jump to verse if currentVerse prop changes
  useEffect(() => {
    if (currentVerse && timestamps.length > 0 && isPlaying) {
      seekToVerse(currentVerse)
    }
  }, [currentVerse])
  
  // Not configured
  if (!isConfigured) {
    return (
      <div className={`bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <Headphones className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Audio Bible requires configuration
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Add VITE_BIBLE_BRAIN_KEY to your .env file.{' '}
              <a 
                href="https://4.dbt.io/api_key/request" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-amber-800"
              >
                Get API key →
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg ${className}`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Headphones className="h-5 w-5 text-primary-600" />
          <span className="font-medium text-gray-900 dark:text-white">
            Listen: {bookName} {chapter}
          </span>
          {activeVerse && timestamps.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (v. {activeVerse})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-500">Loading audio...</span>
            </div>
          )}
          
          {/* Error state */}
          {error && !isLoading && (
            <div className="text-center py-4">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={loadAudio}
                className="mt-2 text-sm text-primary-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}
          
          {/* Player controls */}
          {audioUrl && !isLoading && (
            <>
              {/* Progress bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {/* Main controls */}
              <div className="flex items-center justify-center gap-4">
                {/* Skip back 10s */}
                <button
                  onClick={() => skip(-10)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Skip back 10 seconds"
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-0.5" />
                  )}
                </button>
                
                {/* Skip forward 10s */}
                <button
                  onClick={() => skip(10)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Skip forward 10 seconds"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
              
              {/* Secondary controls */}
              <div className="flex items-center justify-between">
                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
                
                {/* Playback speed */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedOptions(!showSpeedOptions)}
                    className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {playbackRate}x
                  </button>
                  
                  {showSpeedOptions && (
                    <div className="absolute bottom-full right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => changeSpeed(rate)}
                          className={`block w-full px-3 py-1 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            playbackRate === rate ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : ''
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Audio version selector */}
                <select
                  value={selectedFileset}
                  onChange={(e) => setSelectedFileset(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {AUDIO_VERSIONS.map(version => (
                    <option key={version.id} value={version.id}>
                      {version.abbr}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Verse timestamps (if available) */}
              {timestamps.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Jump to verse:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {timestamps.slice(0, 20).map(ts => (
                      <button
                        key={ts.verse_start}
                        onClick={() => seekToVerse(ts.verse_start)}
                        className={`px-2 py-0.5 text-xs rounded transition-colors ${
                          activeVerse === ts.verse_start
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {ts.verse_start}
                      </button>
                    ))}
                    {timestamps.length > 20 && (
                      <span className="text-xs text-gray-400 px-2">
                        +{timestamps.length - 20} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

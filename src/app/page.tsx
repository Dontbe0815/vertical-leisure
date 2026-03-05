'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// Album configuration
const ALBUM_DATA = {
  title: "VERTICAL LEISURE",
  subtitle: "Background Music for Important Waiting",
  artist: "Elevator Atmospheres",
  year: 2026,
  tracks: [
    { id: 1, title: "Lobby Ambience", duration: "3:42", file: "/01.mp3" },
    { id: 2, title: "Going Up", duration: "4:15", file: "/02.mp3" },
    { id: 3, title: "Neutral Zone", duration: "3:58", file: "/03.mp3" },
    { id: 4, title: "Soft Jazz for Staring", duration: "4:32", file: "/04.mp3" },
    { id: 5, title: "Caffeine Break Room", duration: "3:21", file: "/05.mp3" },
    { id: 6, title: "Elevator to the Sky", duration: "4:47", file: "/06.mp3" },
    { id: 7, title: "Conference Call Serenade", duration: "3:55", file: "/07.mp3" },
    { id: 8, title: "Light Hold Music", duration: "4:08", file: "/08.mp3" },
    { id: 9, title: "The View from Floor 9", duration: "4:22", file: "/09.mp3" },
    { id: 10, title: "Executive Pause", duration: "3:38", file: "/10.mp3" },
    { id: 11, title: "Brief Interlude", duration: "2:54", file: "/11.mp3" },
    { id: 12, title: "Boardroom Bliss", duration: "4:11", file: "/12.mp3" },
    { id: 13, title: "Chime of Anticipation", duration: "3:27", file: "/13.mp3" },
    { id: 14, title: "Down to Ground Level", duration: "4:03", file: "/14.mp3" },
    { id: 15, title: "Departure Lounge", duration: "5:16", file: "/15.mp3" },
  ]
}

// Format time helper
function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Icons
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  )
}

function SkipBackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
    </svg>
  )
}

function SkipForwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
  )
}

function ShuffleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
    </svg>
  )
}

function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
    </svg>
  )
}

function RepeatOneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
    </svg>
  )
}

// Elevator Button Component
function ElevatorButton({ 
  number, 
  isActive, 
  isPlaying, 
  onClick 
}: { 
  number: number
  isActive: boolean
  isPlaying: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`elevator-button ${isActive ? 'active' : ''}`}
      aria-label={`Play track ${number}`}
    >
      <span className="button-text">
        {isActive && isPlaying ? (
          <span className="playing-bars">
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </span>
        ) : (
          number
        )}
      </span>
    </button>
  )
}

// Horizontal Elevator Volume Control
function ElevatorVolumeControl({ 
  volume, 
  onVolumeChange 
}: { 
  volume: number
  onVolumeChange: (v: number) => void 
}) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    onVolumeChange(percent)
  }, [onVolumeChange])

  return (
    <div className="w-full">
      <div className="text-center mb-2">
        <span className="text-xs font-mono text-amber-400/50 tracking-widest uppercase">
          Volume Control
        </span>
      </div>
      
      {/* Horizontal Building Track */}
      <div className="relative h-14 mx-auto" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Building frame */}
        <div className="building-track-horizontal">
          {/* Floor lines vertical */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="floor-line-vertical" style={{ left: `${(i + 1) * 10}%` }} />
          ))}
          
          {/* Clickable track */}
          <div 
            className="elevator-track-horizontal"
            onClick={handleClick}
          >
            {/* Elevator car */}
            <div 
              className="elevator-car-horizontal"
              style={{ left: `${volume * 100 - 8}%` }}
            >
              <div className="elevator-doors-h">
                <div className="door-line-h" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Ground/ground label */}
        <div className="flex justify-between mt-1 px-1">
          <span className="text-[10px] font-mono text-amber-400/30">G</span>
          <span className="text-[10px] font-mono text-amber-400/30">↑ TOP</span>
        </div>
      </div>
    </div>
  )
}

// Animated Background
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510] via-[#2a2015] to-[#1a1510]" />
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/album-front.png")', 
          filter: 'blur(80px) brightness(0.4)' 
        }} 
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px]" />
    </div>
  )
}

// Main Player Component
export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(ALBUM_DATA.tracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFrontCover, setShowFrontCover] = useState(true)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get next track based on shuffle/repeat
  const getNextTrack = useCallback(() => {
    if (isShuffle) {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * ALBUM_DATA.tracks.length)
      } while (randomIndex === ALBUM_DATA.tracks.findIndex(t => t.id === currentTrack.id) && ALBUM_DATA.tracks.length > 1)
      return ALBUM_DATA.tracks[randomIndex]
    }
    const currentIndex = ALBUM_DATA.tracks.findIndex(t => t.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % ALBUM_DATA.tracks.length
    return ALBUM_DATA.tracks[nextIndex]
  }, [currentTrack.id, isShuffle])

  const getPrevTrack = useCallback(() => {
    if (isShuffle) {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * ALBUM_DATA.tracks.length)
      } while (randomIndex === ALBUM_DATA.tracks.findIndex(t => t.id === currentTrack.id) && ALBUM_DATA.tracks.length > 1)
      return ALBUM_DATA.tracks[randomIndex]
    }
    const currentIndex = ALBUM_DATA.tracks.findIndex(t => t.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? ALBUM_DATA.tracks.length - 1 : currentIndex - 1
    return ALBUM_DATA.tracks[prevIndex]
  }, [currentTrack.id, isShuffle])

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.file
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [currentTrack, isPlaying])

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      setIsLoading(true)
      audioRef.current.play().catch(() => {
        setAudioError("Unable to play this track.")
        setIsLoading(false)
      })
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // Play specific track
  const playTrack = useCallback((track: typeof ALBUM_DATA.tracks[0]) => {
    setProgress(0)
    setAudioError(null)
    setCurrentTrack(track)
    setIsPlaying(true)
    setIsLoading(true)
  }, [])

  // Next/Previous track
  const nextTrack = useCallback(() => {
    setProgress(0)
    setAudioError(null)
    setCurrentTrack(getNextTrack())
  }, [getNextTrack])

  const prevTrack = useCallback(() => {
    setProgress(0)
    setAudioError(null)
    setCurrentTrack(getPrevTrack())
  }, [getPrevTrack])

  // Event handlers
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      setIsLoading(false)
    }
  }, [])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * duration
  }, [duration])

  const handleEnded = useCallback(() => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
    } else if (repeatMode === 'all' || ALBUM_DATA.tracks.findIndex(t => t.id === currentTrack.id) < ALBUM_DATA.tracks.length - 1) {
      nextTrack()
    } else {
      setIsPlaying(false)
    }
  }, [repeatMode, currentTrack.id, nextTrack])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [isPlaying])

  const handleError = useCallback(() => {
    setAudioError("Audio file not found. Add MP3 files (01.mp3 - 15.mp3) to public folder.")
    setIsLoading(false)
    setIsPlaying(false)
  }, [])

  const toggleShuffle = () => setIsShuffle(!isShuffle)
  
  const cycleRepeat = () => {
    setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <AnimatedBackground />
      
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        onError={handleError}
        preload="metadata"
      />

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-gradient-to-b from-[#2a2015]/90 to-[#1a1510]/95 backdrop-blur-md rounded-3xl border-2 border-[#8b7355]/50 shadow-2xl overflow-hidden main-container">
        
        {/* Header */}
        <div className="text-center py-5 px-6 border-b border-[#8b7355]/30">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 album-title">
            {ALBUM_DATA.title}
          </h1>
          <p className="text-base italic text-amber-300/60 mt-2">{ALBUM_DATA.subtitle}</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row p-6 gap-6">
          
          {/* Left Section: Album Art + Player Controls */}
          <div className="md:w-1/2 flex flex-col items-center justify-center">
            
            {/* Album Cover */}
            <div 
              className="relative w-64 h-64 cursor-pointer group album-container mx-auto"
              onClick={() => setShowFrontCover(!showFrontCover)}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#a08060] via-[#8b7355] to-[#5a4a3a] p-1.5 shadow-xl">
                <div className="absolute inset-0 rounded-xl brass-frame" />
              </div>
              
              <div 
                className="relative m-2 rounded-lg overflow-hidden aspect-square album-art-container"
                style={{ transform: showFrontCover ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
              >
                <div className="absolute inset-0 album-front">
                  <img 
                    src="/album-front.png" 
                    alt="Album Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 album-back">
                  <img 
                    src="/album-back.png" 
                    alt="Album Back"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="absolute bottom-2 right-2 bg-black/60 px-3 py-1 rounded-full text-xs text-amber-200/70">
                Click to flip
              </div>
            </div>

            {/* Now Playing */}
            <div className="w-full mt-6 text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-mono font-bold text-amber-400 floor-number">
                  {String(currentTrack.id).padStart(2, '0')}
                </span>
                <div className="text-left">
                  <h2 className="text-xl font-serif font-semibold text-amber-100 leading-tight">
                    {currentTrack.title}
                  </h2>
                  <p className="text-sm text-amber-400/50 mt-1">{ALBUM_DATA.artist}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-5 max-w-md">
              <div 
                className="relative h-3 bg-[#1a1510] rounded-full cursor-pointer overflow-hidden"
                onClick={handleSeek}
              >
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all"
                  style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-amber-400/50 font-mono">
                <span>{formatTime(progress)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Player Controls with Shuffle/Repeat */}
            <div className="flex items-center justify-center gap-3 mt-5">
              {/* Shuffle */}
              <button 
                onClick={toggleShuffle}
                className={`p-3 rounded-full transition-all ${isShuffle ? 'bg-amber-600/30 text-amber-300' : 'text-amber-400/50 hover:text-amber-300'}`}
                title="Shuffle"
              >
                <ShuffleIcon className="w-6 h-6" />
              </button>
              
              {/* Previous */}
              <button 
                onClick={prevTrack}
                className="p-3 text-amber-400/70 hover:text-amber-300 transition-colors"
              >
                <SkipBackIcon className="w-7 h-7" />
              </button>
              
              {/* Play/Pause */}
              <button 
                onClick={togglePlay}
                disabled={isLoading}
                className="p-5 bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 rounded-full text-white shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <PauseIcon className="w-8 h-8" />
                ) : (
                  <PlayIcon className="w-8 h-8" />
                )}
              </button>
              
              {/* Next */}
              <button 
                onClick={nextTrack}
                className="p-3 text-amber-400/70 hover:text-amber-300 transition-colors"
              >
                <SkipForwardIcon className="w-7 h-7" />
              </button>
              
              {/* Repeat */}
              <button 
                onClick={cycleRepeat}
                className={`p-3 rounded-full transition-all ${repeatMode !== 'off' ? 'bg-amber-600/30 text-amber-300' : 'text-amber-400/50 hover:text-amber-300'}`}
                title={repeatMode === 'off' ? 'Repeat All' : repeatMode === 'all' ? 'Repeat One' : 'Repeat Off'}
              >
                {repeatMode === 'one' ? <RepeatOneIcon className="w-6 h-6" /> : <RepeatIcon className="w-6 h-6" />}
              </button>
            </div>

            {audioError && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm text-center max-w-md">
                {audioError}
              </div>
            )}
          </div>

          {/* Right Section: Elevator Panel */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h3 className="text-sm font-serif font-semibold text-amber-300/60 mb-5 text-center tracking-widest uppercase">
              Select Floor
            </h3>
            
            {/* Elevator Button Panel */}
            <div className="grid grid-cols-5 gap-4 max-w-md mx-auto w-full">
              {ALBUM_DATA.tracks.map((track) => (
                <ElevatorButton 
                  key={track.id}
                  number={track.id}
                  isActive={currentTrack.id === track.id}
                  isPlaying={isPlaying}
                  onClick={() => playTrack(track)}
                />
              ))}
            </div>

            {/* Current Track Display */}
            <div className="mt-6 text-center bg-[#1a1510]/60 rounded-xl py-3 px-5 border border-[#8b7355]/20">
              <p className="text-sm text-amber-100">
                <span className="text-amber-400 font-semibold">Floor {currentTrack.id}</span>
                <span className="text-amber-400/40 mx-3">—</span>
                {currentTrack.title}
              </p>
            </div>

            {/* Horizontal Volume Control */}
            <div className="mt-5">
              <ElevatorVolumeControl volume={volume} onVolumeChange={setVolume} />
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-amber-400/25">
                Elevator Atmospheres © {ALBUM_DATA.year}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

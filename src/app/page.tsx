'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// Album configuration with floor images
const ALBUM_DATA = {
  title: "VERTICAL LEISURE",
  subtitle: "Background Music for Important Waiting",
  artist: "Elevator Atmospheres",
  year: 2026,
  tracks: [
    { id: 1, title: "Lobby Ambience", duration: "3:42", file: "/01.mp3", floorImage: "/floors/floor1.png" },
    { id: 2, title: "Going Up", duration: "4:15", file: "/02.mp3", floorImage: "/floors/floor2.png" },
    { id: 3, title: "Neutral Zone", duration: "3:58", file: "/03.mp3", floorImage: "/floors/floor3.png" },
    { id: 4, title: "Soft Jazz for Staring", duration: "4:32", file: "/04.mp3", floorImage: "/floors/floor4.png" },
    { id: 5, title: "Caffeine Break Room", duration: "3:21", file: "/05.mp3", floorImage: "/floors/floor5.png" },
    { id: 6, title: "Elevator to the Sky", duration: "4:47", file: "/06.mp3", floorImage: "/floors/floor6.png" },
    { id: 7, title: "Conference Call Serenade", duration: "3:55", file: "/07.mp3", floorImage: "/floors/floor7.png" },
    { id: 8, title: "Light Hold Music", duration: "4:08", file: "/08.mp3", floorImage: "/floors/floor8.png" },
    { id: 9, title: "The View from Floor 9", duration: "4:22", file: "/09.mp3", floorImage: "/floors/floor9.png" },
    { id: 10, title: "Executive Pause", duration: "3:38", file: "/10.mp3", floorImage: "/floors/floor10.png" },
    { id: 11, title: "Brief Interlude", duration: "2:54", file: "/11.mp3", floorImage: "/floors/floor11.png" },
    { id: 12, title: "Boardroom Bliss", duration: "4:11", file: "/12.mp3", floorImage: "/floors/floor12.png" },
    { id: 13, title: "Chime of Anticipation", duration: "3:27", file: "/13.mp3", floorImage: "/floors/floor13.png" },
    { id: 14, title: "Down to Ground Level", duration: "4:03", file: "/14.mp3", floorImage: "/floors/floor14.png" },
    { id: 15, title: "Departure Lounge", duration: "5:16", file: "/15.mp3", floorImage: "/floors/floor15.png" },
  ]
}

// Elevator facts for display
const ELEVATOR_FACTS = [
  "The world's longest elevator ride is 67 floors in the Burj Khalifa",
  "Elevators are statistically the safest form of transport",
  "The first elevator was built in 1743 for King Louis XV",
  "Elevators travel about 18 billion miles per year in the US alone",
  "The average elevator holds about 1,000-4,000 pounds",
  "There are approximately 900,000 elevators in the United States",
  "Elevators are 20 times safer than escalators",
  "Music in elevators was introduced to calm nervous passengers",
  "The fastest elevators travel at speeds up to 45 mph",
  "Elevator operators used to manually control every stop",
  "The 'door close' button often doesn't work - it's placebo!",
  "Most elevator music is set to 72 BPM - a relaxed heart rate",
  "Tokyo has more elevators than the entire United States",
  "The elevator was invented before the spiral staircase",
  "Early elevators were powered by steam engines"
]

// Elevator announcements
const ANNOUNCEMENTS = [
  "Please mind the gap",
  "Going up?",
  "Watch your step, please",
  "Next stop: productivity",
  "Thank you for riding with us",
  "Have a pleasant journey",
  "Your floor is approaching",
  "Doors closing, please stand clear",
  "Now arriving at your destination",
  "Please hold the door for others"
]

// Format time helper
function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

function EmergencyStopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  )
}

// (1) Pulsierende Floor-Anzeige Component
function PulsingFloorDisplay({ floor, isPlaying }: { floor: number; isPlaying: boolean }) {
  return (
    <div className={`pulsing-floor-display ${isPlaying ? 'active' : ''}`}>
      <span className="floor-number-large">
        {String(floor).padStart(2, '0')}
      </span>
      <div className="floor-label">FLOOR</div>
    </div>
  )
}

// (2) Retro LCD Display Component
function RetroLCDDisplay({ text, isPlaying }: { text: string; isPlaying: boolean }) {
  const [displayText, setDisplayText] = useState(text)
  
  useEffect(() => {
    setDisplayText(text)
  }, [text])
  
  return (
    <div className="retro-lcd-container">
      <div className="lcd-screen">
        <div className="lcd-scanlines" />
        <div className={`lcd-text ${isPlaying ? 'scrolling' : ''}`}>
          <span>{displayText}</span>
          {isPlaying && <span className="lcd-cursor">_</span>}
        </div>
      </div>
    </div>
  )
}

// (3) Audio Visualizer Component - Decorative animated bars
function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)
      
      const time = Date.now() / 1000
      const barCount = 32
      const barWidth = width / barCount - 2
      
      for (let i = 0; i < barCount; i++) {
        let barHeight: number
        
        if (isPlaying) {
          // Active visualization - more dynamic
          const baseHeight = 8
          const variation = Math.sin(time * 4 + i * 0.5) * 12 + Math.sin(time * 2 + i * 0.3) * 8
          barHeight = baseHeight + variation + Math.random() * 4
        } else {
          // Idle animation - gentle waves
          barHeight = Math.sin(time * 2 + i * 0.3) * 5 + 8
        }
        
        const x = i * (barWidth + 2)
        const y = height - barHeight
        
        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, height, 0, y)
        if (isPlaying) {
          gradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0.3)')
        } else {
          gradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)')
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0.1)')
        }
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)
      }
      
      animationRef.current = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])
  
  return (
    <div className="audio-visualizer-container">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={40}
        className="audio-visualizer-canvas"
      />
    </div>
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

// Building Side View Component
function BuildingSideView({ currentFloor }: { currentFloor: number }) {
  return (
    <div className="building-side-view">
      {[...Array(15)].map((_, i) => {
        const floorNum = 15 - i
        return (
          <div 
            key={floorNum} 
            className={`building-floor ${currentFloor === floorNum ? 'active' : ''}`}
          >
            <div className="floor-indicator">
              {currentFloor === floorNum && (
                <div className="elevator-indicator">▬</div>
              )}
            </div>
            <span className="floor-num">{floorNum}</span>
          </div>
        )
      })}
      <div className="building-ground">
        <span className="floor-num">G</span>
      </div>
    </div>
  )
}

// Animated Floor Display
function AnimatedFloorDisplay({ floor, isChanging }: { floor: number; isChanging: boolean }) {
  return (
    <div className={`animated-floor-display ${isChanging ? 'changing' : ''}`}>
      <div className="floor-digits">
        <span className="floor-digit">{String(floor).padStart(2, '0')}</span>
      </div>
      <div className="floor-arrow up">▲</div>
    </div>
  )
}

// Elevator Doors Animation
function ElevatorDoors({ isOpening }: { isOpening: boolean }) {
  return (
    <div className="elevator-doors-container">
      <div className={`door left ${isOpening ? 'open' : ''}`} />
      <div className={`door right ${isOpening ? 'open' : ''}`} />
    </div>
  )
}

// Volume Control
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
      
      <div className="relative mx-auto" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="volume-track-container">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="floor-line-v" style={{ left: `${(i + 1) * 10}%` }} />
          ))}
          
          <div 
            className="volume-fill"
            style={{ width: `${volume * 100}%` }}
          />
          
          <div 
            className="volume-click-area"
            onClick={handleClick}
          >
            <div 
              className="volume-elevator-car"
              style={{ left: `${volume * 100}%` }}
            >
              <span className="car-number">{Math.round(volume * 15)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs font-mono text-amber-400/60 font-bold">G</span>
          <span className="text-xs font-mono text-amber-400/60 font-bold">TOP</span>
        </div>
      </div>
    </div>
  )
}

// (14) End-of-Track Fact Display
function EndOfTrackFact({ fact, show }: { fact: string; show: boolean }) {
  return (
    <div className={`end-of-track-fact ${show ? 'visible' : ''}`}>
      <div className="fact-icon">💡</div>
      <div className="fact-text">{fact}</div>
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
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [playedTracks, setPlayedTracks] = useState<Set<number>>(new Set())
  
  // New features state
  const [isFloorChanging, setIsFloorChanging] = useState(false)
  const [doorsOpen, setDoorsOpen] = useState(true)
  const [currentFact, setCurrentFact] = useState(() => ELEVATOR_FACTS[Math.floor(Math.random() * ELEVATOR_FACTS.length)])
  const [currentAnnouncement, setCurrentAnnouncement] = useState("")
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [waitTime, setWaitTime] = useState(0)
  const [isEmergencyStop, setIsEmergencyStop] = useState(false)
  const [prevVolume, setPrevVolume] = useState(0.8)
  
  // (14) End of track fact state
  const [showEndFact, setShowEndFact] = useState(false)
  const [endFact, setEndFact] = useState("")
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const waitTimeRef = useRef<NodeJS.Timeout | null>(null)

  // (4) Door sound using Web Audio API
  const playDoorSound = useCallback((open: boolean) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      
      // Create a more complex door sound
      const oscillator1 = ctx.createOscillator()
      const oscillator2 = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      
      oscillator1.connect(filter)
      oscillator2.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, ctx.currentTime)
      
      if (open) {
        // Opening sound - ascending
        oscillator1.frequency.setValueAtTime(150, ctx.currentTime)
        oscillator1.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3)
        oscillator2.frequency.setValueAtTime(200, ctx.currentTime)
        oscillator2.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3)
      } else {
        // Closing sound - descending
        oscillator1.frequency.setValueAtTime(300, ctx.currentTime)
        oscillator1.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3)
        oscillator2.frequency.setValueAtTime(400, ctx.currentTime)
        oscillator2.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3)
      }
      
      oscillator1.type = 'square'
      oscillator2.type = 'sawtooth'
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      
      oscillator1.start(ctx.currentTime)
      oscillator2.start(ctx.currentTime)
      oscillator1.stop(ctx.currentTime + 0.4)
      oscillator2.stop(ctx.currentTime + 0.4)
    } catch {
      // Audio context might not be available
    }
  }, [])

  // Play ding sound using Web Audio API
  const playDing = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(880, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch {
      // Audio context might not be available
    }
  }, [])

  // Show random announcement on track change
  const showRandomAnnouncement = useCallback(() => {
    const announcement = ANNOUNCEMENTS[Math.floor(Math.random() * ANNOUNCEMENTS.length)]
    setCurrentAnnouncement(announcement)
    setShowAnnouncement(true)
    setTimeout(() => setShowAnnouncement(false), 3000)
  }, [])

  // Smart shuffle helpers
  const getNextTrack = useCallback((currentId: number, played: Set<number>, shuffle: boolean) => {
    if (shuffle) {
      const unplayedTracks = ALBUM_DATA.tracks.filter(t => !played.has(t.id))
      if (unplayedTracks.length === 0) {
        const allTracks = [...ALBUM_DATA.tracks]
        const randomIndex = Math.floor(Math.random() * allTracks.length)
        return { track: allTracks[randomIndex], newPlayed: new Set([allTracks[randomIndex].id]) }
      }
      const randomIndex = Math.floor(Math.random() * unplayedTracks.length)
      const nextTrack = unplayedTracks[randomIndex]
      return { track: nextTrack, newPlayed: new Set([...played, nextTrack.id]) }
    }
    const currentIndex = ALBUM_DATA.tracks.findIndex(t => t.id === currentId)
    const nextIndex = (currentIndex + 1) % ALBUM_DATA.tracks.length
    return { track: ALBUM_DATA.tracks[nextIndex], newPlayed: played }
  }, [])

  const getPrevTrack = useCallback((currentId: number, shuffle: boolean) => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * ALBUM_DATA.tracks.length)
      return ALBUM_DATA.tracks[randomIndex]
    }
    const currentIndex = ALBUM_DATA.tracks.findIndex(t => t.id === currentId)
    const prevIndex = currentIndex === 0 ? ALBUM_DATA.tracks.length - 1 : currentIndex - 1
    return ALBUM_DATA.tracks[prevIndex]
  }, [])

  // Play specific track with animations
  const playTrack = useCallback((track: typeof ALBUM_DATA.tracks[0]) => {
    // (4) Play door closing sound
    playDoorSound(false)
    
    setDoorsOpen(false)
    setIsFloorChanging(true)
    playDing()
    showRandomAnnouncement()
    
    setTimeout(() => {
      setProgress(0)
      setAudioError(null)
      setCurrentTrack(track)
      setIsPlaying(true)
      setIsLoading(true)
      
      setPlayedTracks(prev => new Set([...prev, track.id]))
      
      setTimeout(() => {
        setDoorsOpen(true)
        setIsFloorChanging(false)
        // (4) Play door opening sound
        playDoorSound(true)
      }, 500)
    }, 300)
  }, [playDing, showRandomAnnouncement, playDoorSound])

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

  // Next/Previous track
  const nextTrack = useCallback(() => {
    const { track, newPlayed } = getNextTrack(currentTrack.id, playedTracks, isShuffle)
    setPlayedTracks(newPlayed)
    playTrack(track)
  }, [currentTrack.id, playedTracks, isShuffle, getNextTrack, playTrack])

  const prevTrack = useCallback(() => {
    const track = getPrevTrack(currentTrack.id, isShuffle)
    playTrack(track)
  }, [currentTrack.id, isShuffle, getPrevTrack, playTrack])

  // Emergency stop (mute)
  const handleEmergencyStop = useCallback(() => {
    if (isEmergencyStop) {
      setIsEmergencyStop(false)
      setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setIsEmergencyStop(true)
    }
  }, [isEmergencyStop, volume, prevVolume])

  // Keyboard shortcuts - AFTER all functions are defined
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      switch(e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          prevTrack()
          break
        case 'ArrowRight':
          nextTrack()
          break
        case 'KeyM':
          handleEmergencyStop()
          break
        case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4': case 'Digit5':
        case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
          const trackNum = parseInt(e.code.replace('Digit', ''))
          playTrack(ALBUM_DATA.tracks[trackNum - 1])
          break
        case 'Digit0':
          playTrack(ALBUM_DATA.tracks[9])
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, prevTrack, nextTrack, handleEmergencyStop, playTrack])

  // Wait time counter
  useEffect(() => {
    if (isPlaying) {
      waitTimeRef.current = setInterval(() => {
        setWaitTime(prev => prev + 1)
      }, 1000)
    } else if (waitTimeRef.current) {
      clearInterval(waitTimeRef.current)
    }
    return () => {
      if (waitTimeRef.current) clearInterval(waitTimeRef.current)
    }
  }, [isPlaying])

  // Random fact rotation
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(ELEVATOR_FACTS[Math.floor(Math.random() * ELEVATOR_FACTS.length)])
    }, 15000)
    return () => clearInterval(factInterval)
  }, [])

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
      audioRef.current.volume = isEmergencyStop ? 0 : volume
    }
  }, [volume, isEmergencyStop])

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

  // (14) Show fact at end of track
  const handleEnded = useCallback(() => {
    // Show end-of-track fact
    const newFact = ELEVATOR_FACTS[Math.floor(Math.random() * ELEVATOR_FACTS.length)]
    setEndFact(newFact)
    setShowEndFact(true)
    setTimeout(() => setShowEndFact(false), 4000)
    
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

  const toggleShuffle = () => {
    if (!isShuffle) {
      setPlayedTracks(new Set([currentTrack.id]))
    }
    setIsShuffle(!isShuffle)
  }
  
  const cycleRepeat = () => {
    setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated Floor Background */}
      <div 
        className="fixed inset-0 -z-10 floor-background"
        style={{ backgroundImage: `url("${currentTrack.floorImage}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1510]/70 via-[#1a1510]/50 to-[#1a1510]/80" />
      </div>
      
      {/* (3) Audio Visualizer Background */}
      <div className="fixed bottom-0 left-0 right-0 -z-5 opacity-30 pointer-events-none">
        <AudioVisualizer isPlaying={isPlaying} />
      </div>
      
      {/* Elevator Doors Overlay */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <ElevatorDoors isOpening={doorsOpen} />
      </div>
      
      {/* (14) End of Track Fact */}
      <EndOfTrackFact fact={endFact} show={showEndFact} />
      
      {/* Announcement Toast */}
      {showAnnouncement && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-amber-600/90 text-white px-6 py-3 rounded-full font-serif text-sm animate-bounce">
          {currentAnnouncement}
        </div>
      )}
      
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
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#2a2015]/95 to-[#1a1510]/98 backdrop-blur-md rounded-3xl border-2 border-[#8b7355]/50 shadow-2xl overflow-hidden main-container">
        
        {/* Header */}
        <div className="text-center py-4 px-6 border-b border-[#8b7355]/30">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 album-title">
            {ALBUM_DATA.title}
          </h1>
          <p className="text-base italic text-amber-300/60 mt-1">{ALBUM_DATA.subtitle}</p>
        </div>

        {/* Main Content */}
        <div className="flex p-4 gap-4">
          
          {/* Building Side View */}
          <div className="hidden lg:flex flex-col items-center">
            <BuildingSideView currentFloor={currentTrack.id} />
          </div>

          {/* Left Section: Album Art + Player Controls */}
          <div className="flex-1 flex flex-col items-center justify-center">
            
            {/* Floor Image Display */}
            <div className="relative w-56 h-56 rounded-xl overflow-hidden border-2 border-[#8b7355]/50 shadow-xl mb-4">
              <img 
                src={currentTrack.floorImage}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Animated Floor Display */}
              <div className="absolute top-2 right-2">
                <AnimatedFloorDisplay floor={currentTrack.id} isChanging={isFloorChanging} />
              </div>
            </div>

            {/* (1) Pulsing Floor Display */}
            <PulsingFloorDisplay floor={currentTrack.id} isPlaying={isPlaying} />

            {/* (2) Retro LCD Display for Track Name */}
            <RetroLCDDisplay text={currentTrack.title} isPlaying={isPlaying} />
            <p className="text-xs text-amber-400/50 mt-1">{ALBUM_DATA.artist}</p>

            {/* Progress Bar */}
            <div className="w-full mt-4 max-w-sm">
              <div 
                className="relative h-2 bg-[#1a1510] rounded-full cursor-pointer overflow-hidden"
                onClick={handleSeek}
              >
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all"
                  style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-amber-400/50 font-mono">
                <span>{formatTime(progress)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button 
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-all ${isShuffle ? 'bg-amber-600/30 text-amber-300' : 'text-amber-400/50 hover:text-amber-300'}`}
                title="Smart Shuffle"
              >
                <ShuffleIcon className="w-5 h-5" />
              </button>
              
              <button 
                onClick={prevTrack}
                className="p-2 text-amber-400/70 hover:text-amber-300 transition-colors"
              >
                <SkipBackIcon className="w-6 h-6" />
              </button>
              
              <button 
                onClick={togglePlay}
                disabled={isLoading}
                className="p-4 bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 rounded-full text-white shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </button>
              
              <button 
                onClick={nextTrack}
                className="p-2 text-amber-400/70 hover:text-amber-300 transition-colors"
              >
                <SkipForwardIcon className="w-6 h-6" />
              </button>
              
              <button 
                onClick={cycleRepeat}
                className={`p-2 rounded-full transition-all ${repeatMode !== 'off' ? 'bg-amber-600/30 text-amber-300' : 'text-amber-400/50 hover:text-amber-300'}`}
              >
                {repeatMode === 'one' ? <RepeatOneIcon className="w-5 h-5" /> : <RepeatIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Wait Time & Emergency Stop */}
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-[10px] text-amber-400/40 uppercase tracking-wider">Wait Time</p>
                <p className="text-sm font-mono text-amber-300">{formatDuration(waitTime)}</p>
              </div>
              
              <button 
                onClick={handleEmergencyStop}
                className={`p-2 rounded-full border-2 transition-all ${isEmergencyStop ? 'bg-red-600 border-red-400 text-white' : 'border-red-500/50 text-red-400/50 hover:border-red-400 hover:text-red-400'}`}
                title="Emergency Stop (The Boss is Coming!)"
              >
                <EmergencyStopIcon className="w-5 h-5" />
              </button>
            </div>

            {audioError && (
              <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-xs text-center max-w-sm">
                {audioError}
              </div>
            )}
          </div>

          {/* Right Section: Elevator Panel */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-serif font-semibold text-amber-300/60 mb-3 text-center tracking-widest uppercase">
              Select Floor
            </h3>
            
            {/* Elevator Button Panel */}
            <div className="grid grid-cols-5 gap-3 max-w-md mx-auto w-full">
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

            {/* Current Track & Fact */}
            <div className="mt-4 space-y-2">
              <div className="text-center bg-[#1a1510]/60 rounded-lg py-2 px-4 border border-[#8b7355]/20">
                <p className="text-xs text-amber-100">
                  <span className="text-amber-400 font-semibold">Floor {currentTrack.id}</span>
                  <span className="text-amber-400/40 mx-2">—</span>
                  {currentTrack.title}
                </p>
              </div>
              
              <div className="text-center py-2">
                <p className="text-[10px] text-amber-400/40 italic leading-relaxed">
                  💡 {currentFact}
                </p>
              </div>
            </div>

            {/* Volume Control */}
            <div className="mt-3">
              <ElevatorVolumeControl volume={volume} onVolumeChange={setVolume} />
            </div>

            {/* Footer */}
            <div className="mt-3 text-center">
              <p className="text-[10px] text-amber-400/25">
                Elevator Atmospheres © {ALBUM_DATA.year}
              </p>
              <p className="text-[10px] text-amber-400/20 mt-1">
                ⌨️ Space: Play | ←→: Skip | 1-9: Tracks | M: Mute
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

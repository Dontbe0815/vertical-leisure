'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

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

const ANNOUNCEMENTS = [
  "Please mind the gap", "Going up?", "Watch your step, please",
  "Next stop: productivity", "Thank you for riding with us",
  "Have a pleasant journey", "Your floor is approaching",
  "Doors closing, please stand clear", "Now arriving at your destination",
  "Please hold the door for others"
]

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

function PlayIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
}

function PauseIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
}

function SkipBackIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
}

function SkipForwardIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
}

function ShuffleIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
}

function RepeatIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
}

function RepeatOneIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/></svg>
}

function EmergencyStopIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
}

function ServiceModeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
}

function ToolsIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
}

function FlipDigitDisplay({ floor, isChanging }: { floor: number; isChanging: boolean }) {
  const digits = String(floor).padStart(2, '0').split('')
  return (
    <div className="flip-digit-container">
      <div className="flip-digit-wrapper">
        {digits.map((digit, i) => (
          <div key={i} className={`flip-digit ${isChanging ? 'flipping' : ''}`}>
            <div className="digit-top"><span>{digit}</span></div>
            <div className="digit-bottom"><span>{digit}</span></div>
            <div className="digit-flip">
              <div className="flip-front"><span>{digit}</span></div>
              <div className="flip-back"><span>{digit}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div className="floor-label-flip">FLOOR</div>
    </div>
  )
}

function AmbientGlow({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={`ambient-glow-container ${isPlaying ? 'active' : ''}`}>
      <div className="glow-ring glow-1" />
      <div className="glow-ring glow-2" />
      <div className="glow-ring glow-3" />
    </div>
  )
}

function WeatherEffects({ floor }: { floor: number }) {
  const isRainy = floor <= 5
  const isSunny = floor >= 10
  const isCloudy = floor > 5 && floor < 10
  return (
    <div className="weather-effects-container">
      {isRainy && (
        <div className="rain-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="raindrop" style={{left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.5 + Math.random() * 0.5}s`}} />
          ))}
        </div>
      )}
      {isSunny && <div className="sun-container"><div className="sun-rays" /></div>}
      {isCloudy && <div className="clouds-container"><div className="cloud cloud-1" /><div className="cloud cloud-2" /><div className="cloud cloud-3" /></div>}
    </div>
  )
}

function RetroLCDDisplay({ text, isPlaying }: { text: string; isPlaying: boolean }) {
  const [displayText, setDisplayText] = useState(text)
  useEffect(() => { setDisplayText(text) }, [text])
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

function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const draw = () => {
      const width = canvas.width, height = canvas.height
      ctx.clearRect(0, 0, width, height)
      const time = Date.now() / 1000, barCount = 32, barWidth = width / barCount - 2
      for (let i = 0; i < barCount; i++) {
        let barHeight: number
        if (isPlaying) {
          const baseHeight = 8, variation = Math.sin(time * 4 + i * 0.5) * 12 + Math.sin(time * 2 + i * 0.3) * 8
          barHeight = baseHeight + variation + Math.random() * 4
        } else {
          barHeight = Math.sin(time * 2 + i * 0.3) * 5 + 8
        }
        const x = i * (barWidth + 2), y = height - barHeight
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
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [isPlaying])
  return <div className="audio-visualizer-container"><canvas ref={canvasRef} width={300} height={40} className="audio-visualizer-canvas" /></div>
}

function ElevatorButton({ number, isActive, isPlaying, onClick }: { number: number; isActive: boolean; isPlaying: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`elevator-button ${isActive ? 'active' : ''}`} aria-label={`Play track ${number}`}>
      <span className="button-text">
        {isActive && isPlaying ? (<span className="playing-bars"><span className="bar" /><span className="bar" /><span className="bar" /></span>) : number}
      </span>
    </button>
  )
}

function BuildingSideView({ currentFloor }: { currentFloor: number }) {
  return (
    <div className="building-side-view">
      {[...Array(15)].map((_, i) => {
        const floorNum = 15 - i
        return (
          <div key={floorNum} className={`building-floor ${currentFloor === floorNum ? 'active' : ''}`}>
            <div className="floor-indicator">{currentFloor === floorNum && <div className="elevator-indicator">▬</div>}</div>
            <span className="floor-num">{floorNum}</span>
          </div>
        )
      })}
      <div className="building-ground"><span className="floor-num">G</span></div>
    </div>
  )
}

function AnimatedFloorDisplay({ floor, isChanging }: { floor: number; isChanging: boolean }) {
  return (
    <div className={`animated-floor-display ${isChanging ? 'changing' : ''}`}>
      <div className="floor-digits"><span className="floor-digit">{String(floor).padStart(2, '0')}</span></div>
      <div className="floor-arrow up">▲</div>
    </div>
  )
}

function ElevatorDoors({ isOpening }: { isOpening: boolean }) {
  return (
    <div className="elevator-doors-container">
      <div className={`door left ${isOpening ? 'open' : ''}`} />
      <div className={`door right ${isOpening ? 'open' : ''}`} />
    </div>
  )
}

function ElevatorVolumeControl({ volume, onVolumeChange }: { volume: number; onVolumeChange: (v: number) => void }) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onVolumeChange(percent)
  }, [onVolumeChange])
  return (
    <div className="w-full">
      <div className="text-center mb-2"><span className="text-xs font-mono text-amber-400/50 tracking-widest uppercase">Volume Control</span></div>
      <div className="relative mx-auto" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="volume-track-container">
          {[...Array(10)].map((_, i) => (<div key={i} className="floor-line-v" style={{ left: `${(i + 1) * 10}%` }} />))}
          <div className="volume-fill" style={{ width: `${volume * 100}%` }} />
          <div className="volume-click-area" onClick={handleClick}>
            <div className="volume-elevator-car" style={{ left: `${volume * 100}%` }}><span className="car-number">{Math.round(volume * 15)}</span></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 px-1"><span className="text-xs font-mono text-amber-400/60 font-bold">G</span><span className="text-xs font-mono text-amber-400/60 font-bold">TOP</span></div>
      </div>
    </div>
  )
}

function EndOfTrackFact({ fact, show }: { fact: string; show: boolean }) {
  return (
    <div className={`end-of-track-fact ${show ? 'visible' : ''}`}>
      <div className="fact-icon">💡</div>
      <div className="fact-text">{fact}</div>
    </div>
  )
}

function MiniWidgetPlayer({ currentTrack, isPlaying, onPlayPause, onNext, onPrev, progress, duration, isEmergencyStop, onEmergencyStop }: { currentTrack: typeof ALBUM_DATA.tracks[0]; isPlaying: boolean; onPlayPause: () => void; onNext: () => void; onPrev: () => void; progress: number; duration: number; isEmergencyStop: boolean; onEmergencyStop: () => void }) {
  return (
    <div className="mini-widget">
      <div className="mini-floor">{String(currentTrack.id).padStart(2, '0')}</div>
      <div className="mini-info">
        <div className="mini-title">{currentTrack.title}</div>
        <div className="mini-progress"><div className="mini-progress-fill" style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }} /></div>
      </div>
      <div className="mini-controls">
        <button onClick={onPrev} className="mini-btn">◀</button>
        <button onClick={onPlayPause} className="mini-btn play">{isPlaying ? '⏸' : '▶'}</button>
        <button onClick={onNext} className="mini-btn">▶</button>
      </div>
      <button onClick={onEmergencyStop} className={`mini-emergency ${isEmergencyStop ? 'active' : ''}`} title="Emergency Stop">⚠</button>
    </div>
  )
}

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
  const [isFloorChanging, setIsFloorChanging] = useState(false)
  const [doorsOpen, setDoorsOpen] = useState(true)
  const [currentFact, setCurrentFact] = useState(() => ELEVATOR_FACTS[Math.floor(Math.random() * ELEVATOR_FACTS.length)])
  const [currentAnnouncement, setCurrentAnnouncement] = useState("")
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [waitTime, setWaitTime] = useState(0)
  const [isEmergencyStop, setIsEmergencyStop] = useState(false)
  const [prevVolume, setPrevVolume] = useState(0.8)
  const [isServiceMode, setIsServiceMode] = useState(false)
  const [showMiniWidget, setShowMiniWidget] = useState(false)
  const [showEndFact, setShowEndFact] = useState(false)
  const [endFact, setEndFact] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const waitTimeRef = useRef<NodeJS.Timeout | null>(null)

  const playDoorSound = useCallback((open: boolean) => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const ctx = audioContextRef.current
      const osc1 = ctx.createOscillator(), osc2 = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter()
      osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, ctx.currentTime)
      if (open) { osc1.frequency.setValueAtTime(150, ctx.currentTime); osc1.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3); osc2.frequency.setValueAtTime(200, ctx.currentTime); osc2.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3) }
      else { osc1.frequency.setValueAtTime(300, ctx.currentTime); osc1.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3); osc2.frequency.setValueAtTime(400, ctx.currentTime); osc2.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3) }
      osc1.type = 'square'; osc2.type = 'sawtooth'
      gain.gain.setValueAtTime(0.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      osc1.start(ctx.currentTime); osc2.start(ctx.currentTime); osc1.stop(ctx.currentTime + 0.4); osc2.stop(ctx.currentTime + 0.4)
    } catch {}
  }, [])

  const playMovementSound = useCallback((goingUp: boolean) => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter()
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(200, ctx.currentTime)
      const baseFreq = goingUp ? 120 : 80
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime); osc.frequency.linearRampToValueAtTime(baseFreq + (goingUp ? 40 : -20), ctx.currentTime + 0.5); osc.type = 'sine'
      gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1); gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.4); gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6)
    } catch {}
  }, [])

  const playDing = useCallback(() => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5)
    } catch {}
  }, [])

  const showRandomAnnouncement = useCallback(() => {
    const announcement = ANNOUNCEMENTS[Math.floor(Math.random() * ANNOUNCEMENTS.length)]
    setCurrentAnnouncement(announcement); setShowAnnouncement(true); setTimeout(() => setShowAnnouncement(false), 3000)
  }, [])

  const getNextTrack = useCallback((currentId: number, played: Set<number>, shuffle: boolean) => {
    if (shuffle) {
      const unplayedTracks = ALBUM_DATA.tracks.filter(t => !played.has(t.id))
      if (unplayedTracks.length === 0) { const allTracks = [...ALBUM_DATA.tracks]; const randomIndex = Math.floor(Math.random() * allTracks.length); return { track: allTracks[randomIndex], newPlayed: new Set([allTracks[randomIndex].id]) } }
      const randomIndex = Math.floor(Math.random() * unplayedTracks.length); const nextTrack = unplayedTracks[randomIndex]; return { track: nextTrack, newPlayed: new Set([...played, nextTrack.id]) }
    }
    const currentIndex = ALBUM_DATA.tracks.findIndex(t => t.id === currentId); const nextIndex = (currentIndex + 1) % ALBUM_DATA.tracks.length
    return { track: ALBUM_DATA.tracks[nextIndex], newPlayed: played }
  }, [])

  const getPrevTrack = useCallback((currentId: number, shuffle: boolean) => {
    if (shuffle) return ALBUM_DATA.tracks[Math.floor(Math.random() * ALBUM_DATA.tracks.length)]
    const currentIndex = ALBUM_DATA.tracks.findIndex(t => t.id === currentId); const prevIndex = currentIndex === 0 ? ALBUM_DATA.tracks.length - 1 : currentIndex - 1
    return ALBUM_DATA.tracks[prevIndex]
  }, [])

  const playTrack = useCallback((track: typeof ALBUM_DATA.tracks[0]) => {
    const goingUp = track.id > currentTrack.id
    setDoorsOpen(false); playDoorSound(false); setIsFloorChanging(true); showRandomAnnouncement()
    setTimeout(() => playMovementSound(goingUp), 500)
    setTimeout(() => {
      setProgress(0); setAudioError(null); setCurrentTrack(track); setIsPlaying(true); setIsLoading(true)
      setPlayedTracks(prev => new Set([...prev, track.id]))
      setTimeout(() => { setDoorsOpen(true); playDoorSound(true); setIsFloorChanging(false); setTimeout(() => playDing(), 200) }, 300)
    }, 800)
  }, [currentTrack.id, playDoorSound, playMovementSound, playDing, showRandomAnnouncement])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else { setIsLoading(true); audioRef.current.play().catch(() => { setAudioError("Unable to play this track."); setIsLoading(false) }) }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const nextTrack = useCallback(() => { const { track, newPlayed } = getNextTrack(currentTrack.id, playedTracks, isShuffle); setPlayedTracks(newPlayed); playTrack(track) }, [currentTrack.id, playedTracks, isShuffle, getNextTrack, playTrack])
  const prevTrack = useCallback(() => playTrack(getPrevTrack(currentTrack.id, isShuffle)), [currentTrack.id, isShuffle, getPrevTrack, playTrack])

  const handleEmergencyStop = useCallback(() => {
    if (isEmergencyStop) { setIsEmergencyStop(false); setVolume(prevVolume) }
    else { setPrevVolume(volume); setIsEmergencyStop(true) }
  }, [isEmergencyStop, volume, prevVolume])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      switch(e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break
        case 'ArrowLeft': prevTrack(); break
        case 'ArrowRight': nextTrack(); break
        case 'KeyM': handleEmergencyStop(); break
        case 'KeyS': setIsServiceMode(prev => !prev); break
        case 'KeyW': setShowMiniWidget(prev => !prev); break
        case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4': case 'Digit5': case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
          playTrack(ALBUM_DATA.tracks[parseInt(e.code.replace('Digit', '')) - 1]); break
        case 'Digit0': playTrack(ALBUM_DATA.tracks[9]); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, prevTrack, nextTrack, handleEmergencyStop, playTrack])

  useEffect(() => {
    if (isPlaying) { waitTimeRef.current = setInterval(() => setWaitTime(prev => prev + 1), 1000) }
    else if (waitTimeRef.current) clearInterval(waitTimeRef.current)
    return () => { if (waitTimeRef.current) clearInterval(waitTimeRef.current) }
  }, [isPlaying])

  useEffect(() => { const factInterval = setInterval(() => setCurrentFact(ELEVATOR_FACTS[Math.floor(Math.random() * ELEVATOR_FACTS.length)]), 15000); return () => clearInterval(factInterval) }, [])
  useEffect(() => { if (audioRef.current) { audioRef.current.src = currentTrack.file; audioRef.current.load(); if (isPlaying) audioRef.current.play().catch(() => {}) } }, [currentTrack, isPlaying])
  useEffect(() => { if (audioRef.current) audioRef.current.volume = isEmergencyStop ? 0 : volume }, [volume, isEmergencyStop])

  const handleTimeUpdate = useCallback(() => { if (audioRef.current) setProgress(audioRef.current.currentTime) }, [])
  const handleLoadedMetadata = useCallback(() => { if (audioRef.current) { setDuration(audioRef.current.duration); setIsLoading(false) } }, [])
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => { if (!audioRef.current || !duration) return; const rect = e.currentTarget.getBoundingClientRect(); audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration }, [duration])
  const handleEnded = useCallback(() => {
    setEndFact(ELEVATOR_FACTS[Math.floor(Math.random() * ELEVATOR_FACTS.length)]); setShowEndFact(true); setTimeout(() => setShowEndFact(false), 4000)
    if (repeatMode === 'one') { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}) } }
    else if (repeatMode === 'all' || ALBUM_DATA.tracks.findIndex(t => t.id === currentTrack.id) < ALBUM_DATA.tracks.length - 1) nextTrack()
    else setIsPlaying(false)
  }, [repeatMode, currentTrack.id, nextTrack])
  const handleCanPlay = useCallback(() => { setIsLoading(false); if (isPlaying && audioRef.current) audioRef.current.play().catch(() => {}) }, [isPlaying])
  const handleError = useCallback(() => { setAudioError("Audio file not found. Add MP3 files (01.mp3 - 15.mp3) to public folder."); setIsLoading(false); setIsPlaying(false) }, [])

  const toggleShuffle = () => { if (!isShuffle) setPlayedTracks(new Set([currentTrack.id])); setIsShuffle(!isShuffle) }
  const cycleRepeat = () => setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')

  if (isServiceMode) {
    return (
      <div className="service-elevator-mode">
        <div className="service-header"><span className="service-label">SERVICE ELEVATOR</span><button onClick={() => setIsServiceMode(false)} className="service-exit">✕</button></div>
        <div className="service-content">
          <div className="service-floor-display"><span className="service-floor-number">{String(currentTrack.id).padStart(2, '0')}</span></div>
          <div className="service-track-name">{currentTrack.title}</div>
          <div className="service-controls"><button onClick={prevTrack} className="service-btn">◀</button><button onClick={togglePlay} className="service-btn main">{isPlaying ? '⏸' : '▶'}</button><button onClick={nextTrack} className="service-btn">▶</button></div>
          <div className="service-progress"><div className="service-progress-fill" style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }} /></div>
          <div className="service-footer"><span>VERTICAL LEISURE</span><span>{formatTime(progress)} / {currentTrack.duration}</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 floor-background" style={{ backgroundImage: `url("${currentTrack.floorImage}")` }}><div className="absolute inset-0 bg-gradient-to-b from-[#1a1510]/70 via-[#1a1510]/50 to-[#1a1510]/80" /></div>
      <WeatherEffects floor={currentTrack.id} />
      <AmbientGlow isPlaying={isPlaying} />
      <div className="fixed bottom-0 left-0 right-0 -z-5 opacity-30 pointer-events-none"><AudioVisualizer isPlaying={isPlaying} /></div>
      <div className="fixed inset-0 -z-5 pointer-events-none"><ElevatorDoors isOpening={doorsOpen} /></div>
      <EndOfTrackFact fact={endFact} show={showEndFact} />
      {showAnnouncement && <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-amber-600/90 text-white px-6 py-3 rounded-full font-serif text-sm animate-bounce">{currentAnnouncement}</div>}
      <button onClick={() => setShowMiniWidget(prev => !prev)} className="fixed top-4 right-4 z-50 p-2 bg-[#2a2015]/80 border border-[#8b7355]/50 rounded-lg text-amber-400/60 hover:text-amber-300 transition-all" title="Toggle Mini Widget (W)"><ToolsIcon className="w-5 h-5" /></button>
      {showMiniWidget && <div className="fixed top-16 right-4 z-50"><MiniWidgetPlayer currentTrack={currentTrack} isPlaying={isPlaying} onPlayPause={togglePlay} onNext={nextTrack} onPrev={prevTrack} progress={progress} duration={duration} isEmergencyStop={isEmergencyStop} onEmergencyStop={handleEmergencyStop} /></div>}
      <button onClick={() => setIsServiceMode(true)} className="fixed top-4 left-4 z-50 p-2 bg-[#2a2015]/80 border border-[#8b7355]/50 rounded-lg text-amber-400/60 hover:text-amber-300 transition-all" title="Service Elevator Mode (S)"><ServiceModeIcon className="w-5 h-5" /></button>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnded} onCanPlay={handleCanPlay} onError={handleError} preload="metadata" />
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#2a2015]/95 to-[#1a1510]/98 backdrop-blur-md rounded-3xl border-2 border-[#8b7355]/50 shadow-2xl overflow-hidden main-container">
        <div className="text-center py-4 px-6 border-b border-[#8b7355]/30">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 album-title">{ALBUM_DATA.title}</h1>
          <p className="text-base italic text-amber-300/60 mt-1">{ALBUM_DATA.subtitle}</p>
        </div>
        <div className="flex p-4 gap-4">
          <div className="hidden lg:flex flex-col items-center"><BuildingSideView currentFloor={currentTrack.id} /></div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-56 h-56 rounded-xl overflow-hidden border-2 border-[#8b7355]/50 shadow-xl mb-4">
              <img src={currentTrack.floorImage} alt={currentTrack.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-2 right-2"><AnimatedFloorDisplay floor={currentTrack.id} isChanging={isFloorChanging} /></div>
            </div>
            <FlipDigitDisplay floor={currentTrack.id} isChanging={isFloorChanging} />
            <RetroLCDDisplay text={currentTrack.title} isPlaying={isPlaying} />
            <p className="text-xs text-amber-400/50 mt-1">{ALBUM_DATA.artist}</p>
            <div className="w-full mt-4 max-w-sm">
              <div className="relative h-2 bg-[#1a1510] rounded-full cursor-pointer overflow-hidden" onClick={handleSeek}><div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all" style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }} /></div>
              <div className="flex justify-between mt-1 text-xs text-amber-400/50 font-mono"><span>{formatTime(progress)}</span><span>{currentTrack.duration}</span></div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={toggleShuffle} className={`p-2 rounded-full transition-all ${isShuffle ? 'bg-amber-600/30 text-amber-300' : 'text-amber-400/50 hover:text-amber-300'}`} title="Smart Shuffle"><ShuffleIcon className="w-5 h-5" /></button>
              <button onClick={prevTrack} className="p-2 text-amber-400/70 hover:text-amber-300 transition-colors"><SkipBackIcon className="w-6 h-6" /></button>
              <button onClick={togglePlay} disabled={isLoading} className="p-4 bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 rounded-full text-white shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50">
                {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
              </button>
              <button onClick={nextTrack} className="p-2 text-amber-400/70 hover:text-amber-300 transition-colors"><SkipForwardIcon className="w-6 h-6" /></button>
              <button onClick={cycleRepeat} className={`p-2 rounded-full transition-all ${repeatMode !== 'off' ? 'bg-amber-600/30 text-amber-300' : 'text-amber-400/50 hover:text-amber-300'}`}>{repeatMode === 'one' ? <RepeatOneIcon className="w-5 h-5" /> : <RepeatIcon className="w-5 h-5" />}</button>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center"><p className="text-[10px] text-amber-400/40 uppercase tracking-wider">Wait Time</p><p className="text-sm font-mono text-amber-300">{formatDuration(waitTime)}</p></div>
              <button onClick={handleEmergencyStop} className={`p-2 rounded-full border-2 transition-all ${isEmergencyStop ? 'bg-red-600 border-red-400 text-white' : 'border-red-500/50 text-red-400/50 hover:border-red-400 hover:text-red-400'}`} title="Emergency Stop (The Boss is Coming!)"><EmergencyStopIcon className="w-5 h-5" /></button>
            </div>
            {audioError && <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-xs text-center max-w-sm">{audioError}</div>}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-serif font-semibold text-amber-300/60 mb-3 text-center tracking-widest uppercase">Select Floor</h3>
            <div className="grid grid-cols-5 gap-3 max-w-md mx-auto w-full">{ALBUM_DATA.tracks.map((track) => (<ElevatorButton key={track.id} number={track.id} isActive={currentTrack.id === track.id} isPlaying={isPlaying} onClick={() => playTrack(track)} />))}</div>
            <div className="mt-4 space-y-2">
              <div className="text-center bg-[#1a1510]/60 rounded-lg py-2 px-4 border border-[#8b7355]/20"><p className="text-xs text-amber-100"><span className="text-amber-400 font-semibold">Floor {currentTrack.id}</span><span className="text-amber-400/40 mx-2">—</span>{currentTrack.title}</p></div>
              <div className="text-center py-2"><p className="text-[10px] text-amber-400/40 italic leading-relaxed">💡 {currentFact}</p></div>
            </div>
            <div className="mt-3"><ElevatorVolumeControl volume={volume} onVolumeChange={setVolume} /></div>
            <div className="mt-3 text-center"><p className="text-[10px] text-amber-400/25">Elevator Atmospheres © {ALBUM_DATA.year}</p><p className="text-[10px] text-amber-400/20 mt-1">⌨️ Space: Play | ←→: Skip | S: Service | W: Widget | M: Mute</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

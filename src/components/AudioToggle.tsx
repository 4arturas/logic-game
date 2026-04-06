import { useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { MusicEngine } from '../lib/music'
import { AudioEngine } from '../lib/audio'

export default function AudioToggle() {
  const { audioEnabled, toggleAudio } = useSettings()

  useEffect(() => {
    // Whenever audioEnabled changes, turn the music engine on/off
    // and also update the sound effects context
    MusicEngine.setPlaying(audioEnabled)
    AudioEngine.toggle(audioEnabled)
  }, [audioEnabled])

  return (
    <button
      onClick={toggleAudio}
      className="toolbar-btn flex items-center justify-center p-1.5 rounded transition-colors text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-[var(--foam)]"
      title={audioEnabled ? 'Mute Music & Sounds' : 'Enable Music & Sounds'}
      aria-label="Toggle Audio"
    >
      {audioEnabled ? (
        <Volume2 size={18} strokeWidth={2} />
      ) : (
        <VolumeX size={18} strokeWidth={2} />
      )}
    </button>
  )
}

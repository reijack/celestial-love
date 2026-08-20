import { useEffect, useRef, useState } from 'react'
import { SPOTIFY_PLAYLIST_URL } from '../content'

function extractPlaylistId(url) {
  const m = url.match(/\/playlist\/([a-zA-Z0-9]+)/)
  return m ? m[1] : null
}

export default function MusicPlayer() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const playlistId = extractPlaylistId(SPOTIFY_PLAYLIST_URL)

  useEffect(() => {
    function onDocClick(e) {
      if (open && !e.target.closest('#musicPlayer')) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  return (
    <div className="music-player" id="musicPlayer" ref={wrapRef}>
      <div className={`music-panel ${open ? 'open' : ''}`}>
        <div className="music-panel-header">
          <div className="music-panel-title">
            <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--secondary)' }}>
              library_music
            </span>
            <span>Our Celestial Playlist</span>
          </div>
          <button className="music-panel-close" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
          </button>
        </div>

        {playlistId ? (
          <div className="spotify-embed-wrap" style={{ height: 380 }}>
            <iframe
              title="Spotify playlist"
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ height: 380 }}
            />
          </div>
        ) : (
          <div style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
            Playlist tidak ditemukan
          </div>
        )}
      </div>

      <button
        className={`music-btn ${open ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        title="Buka Musik Romantis ✦"
      >
        <div className="music-equalizer-bars">
          <span className="eq-bar bar-1" />
          <span className="eq-bar bar-2" />
          <span className="eq-bar bar-3" />
        </div>
      </button>
    </div>
  )
}

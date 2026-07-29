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
    <div className="music-player" id="musicPlayer">
      <div className={`music-panel ${open ? 'open' : ''}`}>
        {playlistId ? (
          <div className="spotify-embed-wrap" style={{ height: 380 }}>
            <iframe
              title="Spotify playlist"
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
              width="100%" height="380" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ height: 380 }}
            />
          </div>
        ) : (
          <div style={{ padding: '1rem', fontSize: '0.85rem' }}>Playlist tidak valid</div>
        )}
      </div>
      <button className="music-btn" onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }} title="Music Player">
        <span className="material-symbols-outlined">music_note</span>
      </button>
    </div>
  )
}

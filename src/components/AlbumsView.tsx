import { useState } from 'react';
import type { Album, Category } from '../data/gallery';

interface AlbumsViewProps {
  albums: Album[];
  activeCategory: 'all' | Category;
  onOpenAlbum: (album: Album) => void;
  onAddAlbum: () => void;
}

export default function AlbumsView({ albums, activeCategory, onOpenAlbum, onAddAlbum }: AlbumsViewProps) {
  const filtered = activeCategory === 'all' ? albums : albums.filter(a => a.category === activeCategory);

  const handleShare = (album: Album, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${album.shareToken}`;
    if (navigator.share) {
      navigator.share({ title: album.title, text: `Lihat galeri foto ${album.title}`, url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert('Link galeri disalin!'));
    } else {
      prompt('Salin link galeri ini:', url);
    }
  };

  return (
    <div style={{ padding: '28px 20px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 32, maxWidth: 520 }}>
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 400, lineHeight: 1.2, margin: '0 0 10px', color: 'var(--foreground)' }}
        >
          Kenangan yang<br />
          <em style={{ color: 'var(--primary)' }}>tak terlupakan.</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.6 }}>
          Galeri eksklusif foto dan video dari setiap sesi bersama Lumio Studio.
          Akses, pilih, dan unduh kenangan Anda.
        </p>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            border: '2px dashed var(--border)',
            borderRadius: 12,
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--muted-foreground)', marginBottom: 16 }}>Belum ada album. Tambah album dari Google Drive.</p>
          <button
            onClick={onAddAlbum}
            style={{
              padding: '10px 20px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            + Tambah Album
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(album => (
          <AlbumCard key={album.id} album={album} onOpen={onOpenAlbum} onShare={handleShare} />
        ))}
      </div>

      {/* Footer stats */}
      {filtered.length > 0 && (
        <div
          style={{
            marginTop: 40,
            padding: '20px 24px',
            background: 'white',
            borderRadius: 10,
            border: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px 40px',
          }}
        >
          {[
            { label: 'Total Album', value: filtered.length },
            { label: 'Foto Tersimpan', value: filtered.reduce((s, a) => s + a.itemCount, 0).toLocaleString('id') },
            { label: 'Video Cinematic', value: filtered.reduce((s, a) => s + a.videoCount, 0) },
          ].map(s => (
            <div key={s.label}>
              <div className="font-display" style={{ fontSize: 26, fontWeight: 500, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AlbumCard({ album, onOpen, onShare }: { album: Album; onOpen: (a: Album) => void; onShare: (a: Album, e: React.MouseEvent) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => onOpen(album)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(album);
        }
      }}
      role="button"
      tabIndex={0}
      className="card-hover"
      style={{
        display: 'block',
        textAlign: 'left',
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        padding: 0,
        width: '100%',
      }}
    >
      {/* Cover */}
      <div style={{ position: 'relative', height: 200, background: 'var(--muted)' }}>
        <img
          src={album.coverSrc}
          alt={album.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            display: 'block',
          }}
        />
        {/* Category */}
        <span
          style={{
            position: 'absolute', top: 10, left: 10,
            padding: '3px 10px',
            background: 'rgba(250,248,245,0.92)',
            color: 'var(--primary)',
            fontSize: 11,
            borderRadius: 20,
            fontFamily: 'DM Mono, monospace',
            border: '1px solid var(--border)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {album.category}
        </span>
        {/* Share button */}
        <button
          onClick={e => onShare(album, e)}
          className="touch-target"
          style={{
            position: 'absolute', top: 6, right: 6,
            width: 32, height: 32,
            background: 'rgba(250,248,245,0.92)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            cursor: 'pointer',
            color: 'var(--muted-foreground)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Bagikan link"
          title="Salin link galeri"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="11" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="11" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4.5 6l5-2.5M4.5 8l5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
        {/* Video indicator */}
        {album.videoCount > 0 && (
          <span
            style={{
              position: 'absolute', bottom: 10, right: 10,
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px',
              background: 'rgba(44,36,32,0.75)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 11,
              borderRadius: 4,
              fontFamily: 'DM Mono, monospace',
            }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor"><polygon points="1,0.5 8,4.5 1,8.5"/></svg>
            {album.videoCount} video
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <h3 className="font-display" style={{ fontSize: 17, fontWeight: 400, margin: '0 0 4px', color: 'var(--foreground)', lineHeight: 1.25 }}>
          {album.title}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 10px' }}>{album.client}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace' }}>{album.date}</span>
          <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace' }}>
            {album.itemCount} foto
          </span>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { Album, DrivePhoto } from '../data/gallery';
import { getMockPhotos } from '../data/gallery';
import type { LayoutMode } from '../App';
import LightboxModal from './LightboxModal';
import SelectionBar from './SelectionBar';

type Tab = 'edited' | 'raw' | 'video';

interface AlbumDetailProps {
  album: Album;
  layout: LayoutMode;
}

const MAX_SELECT = 30;

export default function AlbumDetail({ album, layout }: AlbumDetailProps) {
  const [tab, setTab] = useState<Tab>('edited');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [lightbox, setLightbox] = useState<DrivePhoto | null>(null);

  const driveData = getMockPhotos(album.id);

  const photos =
    tab === 'edited' ? driveData.editedPhotos :
    tab === 'raw' ? driveData.rawPhotos :
    driveData.videos;

  const toggleSelect = (id: string) => {
    if (tab !== 'edited') return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_SELECT) {
          alert(`Maksimal ${MAX_SELECT} foto yang dapat dipilih.`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#${album.shareToken}`;
    if (navigator.share) {
      navigator.share({ title: album.title, url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert('Link galeri disalin!'));
    } else {
      prompt('Salin link galeri:', url);
    }
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'edited', label: 'EDITED', count: driveData.editedPhotos.length },
    { id: 'raw', label: 'RAW', count: driveData.rawPhotos.length },
    { id: 'video', label: 'VIDEO', count: driveData.videos.length },
  ];

  return (
    <div style={{ paddingBottom: selected.size > 0 ? 100 : 24 }}>
      {/* Album header */}
      <div
        style={{
          position: 'relative',
          height: 200,
          background: 'var(--muted)',
          overflow: 'hidden',
        }}
      >
        <img
          src={album.coverSrc}
          alt={album.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(250,248,245,0.95) 0%, rgba(250,248,245,0.3) 50%, transparent 100%)',
          }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <span
                style={{
                  fontSize: 11, fontFamily: 'DM Mono, monospace',
                  color: 'var(--primary)', letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {album.category}
              </span>
              <h2
                className="font-display"
                style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 400, margin: '2px 0 0', color: 'var(--foreground)', lineHeight: 1.2 }}
              >
                {album.title}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {/* Share */}
              <button
                onClick={handleShare}
                className="touch-target"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px',
                  background: 'white',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 6, fontSize: 13, cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="10.5" cy="2" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
                  <circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
                  <circle cx="10.5" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
                  <path d="M4 5.5l5-2.5M4 7.5l5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
                Bagikan
              </button>
              {/* Select mode toggle */}
              {tab === 'edited' && (
                <button
                  onClick={() => { setSelectMode(s => !s); setSelected(new Set()); }}
                  className="touch-target"
                  style={{
                    padding: '7px 12px',
                    background: selectMode ? 'var(--primary)' : 'white',
                    color: selectMode ? 'white' : 'var(--foreground)',
                    border: '1px solid',
                    borderColor: selectMode ? 'var(--primary)' : 'var(--border)',
                    borderRadius: 6, fontSize: 13, cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectMode ? 'Batal Pilih' : 'Pilih Foto'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'white',
          padding: '0 20px',
          position: 'sticky',
          top: 60,
          zIndex: 30,
        }}
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); if (t.id !== 'edited') setSelectMode(false); }}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === t.id ? 'var(--primary)' : 'var(--muted-foreground)',
              fontSize: 12,
              fontFamily: 'DM Mono, monospace',
              fontWeight: tab === t.id ? 500 : 400,
              cursor: 'pointer',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
          >
            {t.label}
            <span
              style={{
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 10,
                background: tab === t.id ? 'rgba(139,111,71,0.12)' : 'var(--muted)',
                color: tab === t.id ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              {t.count}
            </span>
          </button>
        ))}

        {selectMode && selected.size > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--primary)', fontFamily: 'DM Mono, monospace' }}>
            {selected.size}/{MAX_SELECT} dipilih
          </div>
        )}
      </div>

      {/* Info bar for RAW */}
      {tab === 'raw' && (
        <div
          style={{
            margin: '12px 20px',
            padding: '10px 14px',
            background: 'var(--secondary)',
            borderRadius: 8,
            border: '1px solid var(--border)',
            fontSize: 12,
            color: 'var(--muted-foreground)',
          }}
        >
          File RAW adalah hasil asli dari kamera sebelum diedit. Unduh untuk keperluan editing lanjutan.
        </div>
      )}

      {/* Select instructions */}
      {selectMode && tab === 'edited' && (
        <div
          style={{
            margin: '12px 20px',
            padding: '10px 14px',
            background: 'rgba(139,111,71,0.06)',
            borderRadius: 8,
            border: '1px solid rgba(139,111,71,0.2)',
            fontSize: 12,
            color: 'var(--primary)',
          }}
        >
          Pilih hingga <strong>{MAX_SELECT} foto</strong> favorit Anda, lalu kirim pilihan ke tim kami.
        </div>
      )}

      {/* Photo grid */}
      <div style={{ padding: '12px 12px 0' }}>
        {layout === 'masonry' ? (
          <div className="masonry-grid">
            {photos.map(photo => (
              <div key={photo.id} className="masonry-item">
                <PhotoCard
                  photo={photo}
                  selectable={selectMode && tab === 'edited'}
                  selected={selected.has(photo.id)}
                  onToggle={toggleSelect}
                  onOpen={setLightbox}
                  isVideo={tab === 'video'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
            {photos.map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                selectable={selectMode && tab === 'edited'}
                selected={selected.has(photo.id)}
                onToggle={toggleSelect}
                onOpen={setLightbox}
                isVideo={tab === 'video'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selection bar */}
      {selected.size > 0 && (
        <SelectionBar
          count={selected.size}
          max={MAX_SELECT}
          selectedIds={[...selected]}
          albumTitle={album.title}
          onClear={() => setSelected(new Set())}
        />
      )}

      {/* Lightbox */}
      {lightbox && (
        <LightboxModal
          photo={lightbox}
          albumTitle={album.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

function PhotoCard({
  photo, selectable, selected, onToggle, onOpen, isVideo,
}: {
  photo: DrivePhoto;
  selectable: boolean;
  selected: boolean;
  onToggle: (id: string) => void;
  onOpen: (p: DrivePhoto) => void;
  isVideo: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  const handleClick = () => {
    if (selectable) { onToggle(photo.id); return; }
    onOpen(photo);
  };

  return (
    <div
      className="media-card"
      onClick={handleClick}
      style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--muted)',
        border: selected ? '2px solid var(--primary)' : '2px solid transparent',
        transition: 'border-color 0.15s',
      }}
    >
      <img
        src={photo.thumb}
        alt={photo.name}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Hover overlay */}
      <div className="img-overlay" />

      {/* Bottom info on hover */}
      <div
        className="img-overlay"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '8px 10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Mono, monospace', wordBreak: 'break-all' }}>
            {photo.name}
          </span>
          {!selectable && (
            <button
              onClick={e => {
                e.stopPropagation();
                window.open(`https://drive.google.com/uc?export=download&id=${photo.driveId}`, '_blank');
              }}
              style={{
                flexShrink: 0, marginLeft: 6,
                width: 26, height: 26,
                background: 'rgba(250,248,245,0.9)',
                border: 'none', borderRadius: 4,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--foreground)',
              }}
              aria-label="Unduh"
              title="Unduh foto ini"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 6.5l3 2 3-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M1 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Checkbox overlay */}
      {selectable && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: selected ? 'rgba(139,111,71,0.18)' : 'transparent',
            transition: 'background 0.15s',
          }}
        />
      )}
      {selectable && (
        <div
          style={{
            position: 'absolute', top: 8, left: 8,
            width: 22, height: 22,
            borderRadius: 4,
            border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.8)',
            background: selected ? 'var(--primary)' : 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      )}

      {/* Video play icon */}
      {isVideo && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(250,248,245,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(44,36,32,0.2)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--primary)">
              <polygon points="4,2 14,8 4,14"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

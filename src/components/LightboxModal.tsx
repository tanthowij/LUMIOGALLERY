import { useEffect, useState } from 'react';
import type { DrivePhoto } from '../data/gallery';

interface LightboxModalProps {
  photo: DrivePhoto;
  albumTitle: string;
  onClose: () => void;
}

export default function LightboxModal({ photo, albumTitle, onClose }: LightboxModalProps) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://drive.google.com/uc?export=download&id=${photo.driveId}`, '_blank');
  };

  const handleDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://drive.google.com/file/d/${photo.driveId}/view`, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(44,36,32,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 12,
          overflow: 'hidden',
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Topbar */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>{photo.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace' }}>
              {albumTitle} · {photo.size}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={handleDownload}
              className="touch-target"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 6,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v8M3 7.5l3.5 2 3.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M1 11.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Unduh
            </button>
            <button
              onClick={handleDrive}
              className="touch-target"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px',
                background: 'white', color: 'var(--muted-foreground)',
                border: '1px solid var(--border)', borderRadius: 6,
                fontSize: 13, cursor: 'pointer',
              }}
            >
              Drive
            </button>
            <button
              onClick={onClose}
              className="touch-target"
              style={{
                width: 36, height: 36,
                background: 'var(--muted)', color: 'var(--muted-foreground)',
                border: 'none', borderRadius: 6, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Tutup"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Media */}
        <div
          style={{
            flex: 1, overflow: 'hidden',
            background: '#F0EAE0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 0,
            position: 'relative',
          }}
        >
          {photo.type === 'video' ? (
            showVideo ? (
              <iframe
                src={`https://drive.google.com/file/d/${photo.driveId}/preview`}
                style={{ width: '100%', height: '100%', minHeight: 320, border: 'none' }}
                allow="autoplay"
                title={photo.name}
              />
            ) : (
              <div
                style={{ position: 'relative', width: '100%', cursor: 'pointer' }}
                onClick={() => setShowVideo(true)}
              >
                <img
                  src={photo.src}
                  alt={photo.name}
                  style={{ width: '100%', maxHeight: 520, objectFit: 'contain', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'rgba(250,248,245,0.92)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(44,36,32,0.2)',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="var(--primary)">
                      <polygon points="5,2 20,11 5,20"/>
                    </svg>
                  </div>
                </div>
              </div>
            )
          ) : (
            <img
              src={photo.src}
              alt={photo.name}
              style={{ maxWidth: '100%', maxHeight: 560, objectFit: 'contain', display: 'block' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

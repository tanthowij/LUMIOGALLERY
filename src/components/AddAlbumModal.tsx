import { useState } from 'react';
import type { Album, Category } from '../data/gallery';

interface AddAlbumModalProps {
  onClose: () => void;
  onAdd: (album: Album) => void;
}

function extractFolderId(url: string): string | null {
  // Handles: https://drive.google.com/drive/folders/FOLDER_ID
  // or: https://drive.google.com/drive/u/0/folders/FOLDER_ID
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  // Also handle raw ID input
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url.trim())) return url.trim();
  return null;
}

export default function AddAlbumModal({ onClose, onAdd }: AddAlbumModalProps) {
  const [driveUrl, setDriveUrl] = useState('');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState<Category>('wedding');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const folderId = extractFolderId(driveUrl);
    if (!folderId) {
      setError('Link Google Drive tidak valid. Pastikan formatnya: https://drive.google.com/drive/folders/...');
      return;
    }
    if (!title || !client || !date) {
      setError('Harap isi semua field yang wajib.');
      return;
    }

    setLoading(true);
    // Simulate Drive fetch delay
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    const token = `${client.toLowerCase().replace(/\s+/g, '-')}-${category}-${date.replace(/-/g, '')}`;
    const coverImages: Record<Category, string> = {
      wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format',
      wisuda: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&auto=format',
    };

    const newAlbum: Album = {
      id: `alb-${Date.now()}`,
      title,
      category,
      client,
      date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      coverSrc: coverImages[category],
      itemCount: Math.floor(Math.random() * 200) + 50,
      videoCount: Math.floor(Math.random() * 4),
      driveUrl: driveUrl.trim(),
      driveFolderId: folderId,
      shareToken: token,
    };

    onAdd(newAlbum);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 12,
          border: '1px solid var(--border)',
          width: '100%',
          maxWidth: 480,
          margin: '0 16px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 400, margin: 0 }}>Tambah Album Baru</h2>
            <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '2px 0 0', fontFamily: 'DM Mono, monospace' }}>
              Tautkan folder Google Drive
            </p>
          </div>
          <button
            onClick={onClose}
            className="touch-target"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
          {/* Drive URL */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>
              Link Folder Google Drive <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="url"
                className="lumio-input"
                style={{ paddingLeft: 32 }}
                placeholder="https://drive.google.com/drive/folders/..."
                value={driveUrl}
                onChange={e => setDriveUrl(e.target.value)}
                required
              />
            </div>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 4 }}>
              Folder harus berisi subfolder <strong>RAW</strong> dan <strong>EDITED</strong>
            </p>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>
              Nama Album <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type="text"
              className="lumio-input"
              placeholder="cth: Pernikahan Reza & Anisa"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Client */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>
              Nama Klien <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type="text"
              className="lumio-input"
              placeholder="cth: Reza Firmansyah"
              value={client}
              onChange={e => setClient(e.target.value)}
              required
            />
          </div>

          {/* Category & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>
                Kategori
              </label>
              <select
                className="lumio-input"
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
              >
                <option value="wedding">Wedding</option>
                <option value="wisuda">Wisuda</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--foreground)' }}>
                Tanggal <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="date"
                className="lumio-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: '#FFF5F5',
                border: '1px solid #FFD5D5',
                borderRadius: 6,
                fontSize: 13,
                color: '#C05050',
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {/* Folder structure info */}
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--secondary)',
              borderRadius: 8,
              marginBottom: 20,
              border: '1px solid var(--border)',
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 500, margin: '0 0 6px', color: 'var(--foreground)' }}>
              Struktur Folder yang Disarankan
            </p>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1.8 }}>
              <div>📁 Nama Album/</div>
              <div style={{ paddingLeft: 16 }}>📁 RAW/</div>
              <div style={{ paddingLeft: 32 }}>🖼 RAW_0001.ARW</div>
              <div style={{ paddingLeft: 16 }}>📁 EDITED/</div>
              <div style={{ paddingLeft: 32 }}>🖼 EDITED_0001.jpg</div>
              <div style={{ paddingLeft: 16 }}>🎬 Highlight.mp4 (opsional)</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '11px', background: 'white',
                color: 'var(--muted-foreground)', border: '1px solid var(--border)',
                borderRadius: 6, fontSize: 14, cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2, padding: '11px',
                background: loading ? 'var(--muted)' : 'var(--primary)',
                color: loading ? 'var(--muted-foreground)' : 'white',
                border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 500,
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 14" strokeLinecap="round"/>
                  </svg>
                  Menghubungkan...
                </>
              ) : 'Buat Album dari Drive'}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

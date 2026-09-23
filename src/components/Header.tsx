import type { LayoutMode } from '../App';
import type { Album } from '../data/gallery';
import type { GoogleUser } from '../auth/google';
import type { Role } from '../auth/AuthContext';

interface HeaderProps {
  openAlbum: Album | null;
  activeCategory: 'all' | 'wedding' | 'wisuda';
  setActiveCategory: (c: 'all' | 'wedding' | 'wisuda') => void;
  layout: LayoutMode;
  setLayout: (l: LayoutMode) => void;
  onBack: () => void;
  onAddAlbum: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: Role | null;
  brandName: string | null;
  pendingCount: number;
  user: GoogleUser | null;
  onLoginClick: () => void;
  onApprovalClick: () => void;
  onLogout: () => void;
}

export default function Header({
  openAlbum, activeCategory, setActiveCategory, layout, setLayout, onBack, onAddAlbum,
  isAdmin, isSuperAdmin, role, brandName, pendingCount, user, onLoginClick, onApprovalClick, onLogout,
}: HeaderProps) {
  const cats: { id: 'all' | 'wedding' | 'wisuda'; label: string }[] = [
    { id: 'all', label: 'Semua Album' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'wisuda', label: 'Wisuda' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(250,248,245,0.95)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Main bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {openAlbum && (
            <button
              onClick={onBack}
              className="touch-target"
              style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: 4 }}
              aria-label="Kembali"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="font-display" style={{ fontSize: 22, fontWeight: 400, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                Lumio
              </span>
              <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 300 }}>Gallery</span>
            </div>
            {openAlbum && (
              <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: 0, fontFamily: 'DM Mono, monospace' }}>
                {openAlbum.client} · {openAlbum.date}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Layout toggle - only in album view */}
          {!openAlbum && (
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              {(['masonry', 'grid'] as LayoutMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setLayout(m)}
                  className="touch-target"
                  style={{
                    width: 36,
                    height: 36,
                    background: layout === m ? 'var(--primary)' : 'transparent',
                    color: layout === m ? 'white' : 'var(--muted-foreground)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label={m}
                >
                  {m === 'masonry' ? (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="1" y="1" width="5.5" height="8" rx="1" fill="currentColor" opacity=".8"/>
                      <rect x="8.5" y="1" width="5.5" height="5" rx="1" fill="currentColor" opacity=".8"/>
                      <rect x="8.5" y="8" width="5.5" height="6" rx="1" fill="currentColor" opacity=".8"/>
                      <rect x="1" y="11" width="5.5" height="3" rx="1" fill="currentColor" opacity=".8"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".8"/>
                      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".8"/>
                      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".8"/>
                      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".8"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {isAdmin && (
            <button
              onClick={onAddAlbum}
              className="touch-target"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ display: 'none' }} className="sm-show">Tambah Album</span>
              <span className="sm-hide">+</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={onApprovalClick}
              className="touch-target"
              title="Setujui pendaftaran brand baru"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px',
                background: 'white',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              Persetujuan
              {pendingCount > 0 && (
                <span
                  style={{
                    minWidth: 20, height: 20, borderRadius: 10,
                    background: '#b42318', color: 'white',
                    fontSize: 11, fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 6px',
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {!user && (
            <button
              onClick={onLoginClick}
              className="touch-target"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px',
                background: isAdmin ? 'white' : 'var(--primary)',
                color: isAdmin ? 'var(--primary)' : 'white',
                border: isAdmin ? '1px solid var(--border)' : 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
              </svg>
              Masuk
            </button>
          )}

          {user && !isAdmin && (role === 'guest' || role === 'rejected') && (
            <button
              onClick={onLoginClick}
              className="touch-target"
              style={{
                padding: '8px 14px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Daftarkan Brand
            </button>
          )}

          {user && !isAdmin && role === 'pending' && (
            <button
              onClick={onLoginClick}
              className="touch-target"
              title="Lihat status pengajuan brand"
              style={{
                padding: '8px 14px',
                background: 'white',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ⏳ Cek Status
            </button>
          )}

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  title={user.email}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)' }}
                />
              ) : (
                <span
                  title={user.email}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--secondary)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600,
                    border: '1px solid var(--border)',
                  }}
                >
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
              )}
              {(brandName || role) && (
                <span
                  title={user.email}
                  style={{
                    fontSize: 11,
                    color: isAdmin ? 'var(--primary)' : 'var(--muted-foreground)',
                    fontFamily: 'DM Mono, monospace',
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isSuperAdmin ? 'Super Admin' : brandName ?? (role === 'pending' ? 'menunggu…' : user.name)}
                </span>
              )}
              <button
                onClick={onLogout}
                title={`Keluar (${user.email})`}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted-foreground)', fontSize: 12,
                  padding: '4px 6px',
                }}
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category filter - only on albums page */}
      {!openAlbum && (
        <div style={{ display: 'flex', gap: 6, padding: '0 20px 12px', overflowX: 'auto' }}>
          {cats.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'var(--primary)' : 'var(--border)',
                background: activeCategory === cat.id ? 'var(--primary)' : 'white',
                color: activeCategory === cat.id ? 'white' : 'var(--muted-foreground)',
                fontSize: 13,
                fontWeight: activeCategory === cat.id ? 500 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

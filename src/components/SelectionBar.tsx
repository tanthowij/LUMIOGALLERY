import { useState } from 'react';

interface SelectionBarProps {
  count: number;
  max: number;
  selectedIds: string[];
  albumTitle: string;
  onClear: () => void;
}

const WA_NUMBER = '6283129308055';

export default function SelectionBar({ count, max, selectedIds, albumTitle, onClear }: SelectionBarProps) {
  const [showMailForm, setShowMailForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const sendWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Lumio Gallery! 📸\n\nSaya ingin mengirimkan pilihan foto dari album *${albumTitle}*.\n\n` +
      `Jumlah foto dipilih: *${count} foto*\n` +
      `ID foto: ${selectedIds.join(', ')}\n\n` +
      `Mohon segera diproses. Terima kasih! 🙏`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
  };

  const sendMail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Pilihan Foto — ${albumTitle}`);
    const body = encodeURIComponent(
      `Nama: ${name}\nEmail: ${email}\nAlbum: ${albumTitle}\n\nFoto dipilih (${count}):\n${selectedIds.join('\n')}`
    );
    window.open(`mailto:admin@lumiogallery.com?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
    setTimeout(() => { setSent(false); setShowMailForm(false); }, 3000);
  };

  return (
    <>
      {/* Mail form modal */}
      {showMailForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowMailForm(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 12,
              border: '1px solid var(--border)',
              width: '100%',
              maxWidth: 420,
              margin: '0 16px',
              padding: '24px',
            }}
          >
            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, margin: '0 0 4px' }}>
              Kirim ke Admin
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 20px' }}>
              {count} foto dipilih dari <em>{albumTitle}</em>
            </p>

            {sent ? (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(139,111,71,0.08)',
                  borderRadius: 8,
                  border: '1px solid rgba(139,111,71,0.2)',
                  textAlign: 'center',
                  color: 'var(--primary)',
                  fontSize: 14,
                }}
              >
                ✓ Pilihan Anda berhasil dikirim ke admin!
              </div>
            ) : (
              <form onSubmit={sendMail}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 5 }}>Nama Anda</label>
                  <input
                    type="text" className="lumio-input"
                    value={name} onChange={e => setName(e.target.value)} required
                    placeholder="Nama lengkap"
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 5 }}>Email</label>
                  <input
                    type="email" className="lumio-input"
                    value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="email@contoh.com"
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowMailForm(false)}
                    style={{
                      flex: 1, padding: '10px',
                      background: 'white', color: 'var(--muted-foreground)',
                      border: '1px solid var(--border)', borderRadius: 6,
                      fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2, padding: '10px',
                      background: 'var(--primary)', color: 'white',
                      border: 'none', borderRadius: 6,
                      fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    Kirim ke Admin
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sticky bottom bar */}
      <div
        className="safe-bottom"
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 50,
          background: 'white',
          borderTop: '1px solid var(--border)',
          padding: '14px 20px',
          boxShadow: '0 -4px 24px rgba(44,36,32,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 600, margin: '0 auto' }}>
          {/* Count badge */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'var(--secondary)',
              borderRadius: 20,
              border: '1px solid var(--border)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--primary)' }}>{count}</span>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>/ {max} foto</span>
          </div>

          {/* Progress */}
          <div style={{ flex: 1, height: 4, background: 'var(--muted)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(count / max) * 100}%`,
                background: count >= max ? '#E07070' : 'var(--primary)',
                borderRadius: 2,
                transition: 'width 0.2s ease',
              }}
            />
          </div>

          <button
            onClick={onClear}
            style={{
              padding: '8px 12px',
              background: 'none', color: 'var(--muted-foreground)',
              border: '1px solid var(--border)',
              borderRadius: 6, fontSize: 12, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Hapus
          </button>

          <button
            onClick={() => setShowMailForm(true)}
            style={{
              padding: '8px 12px',
              background: 'white', color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 6, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="2.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
              <path d="M1 4l5.5 4L12 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
            Email
          </button>

          <button
            onClick={sendWhatsApp}
            style={{
              padding: '8px 14px',
              background: '#25D366', color: 'white',
              border: 'none',
              borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M7 0.875A6.125 6.125 0 00.875 7c0 1.075.279 2.085.768 2.96L.875 13.125l3.279-.743A6.125 6.125 0 107 0.875zm-2.188 3.5c.14 0 .285.005.405.01.14.007.29.015.428.35.168.404.53 1.302.579 1.397.05.096.082.208.016.336-.065.128-.098.207-.193.32-.097.112-.204.25-.291.336-.097.096-.198.2-.085.392.113.192.502.828 1.079 1.342.741.66 1.367.864 1.558.961.192.097.304.082.416-.048.112-.13.48-.56.608-.752.128-.193.256-.16.432-.097.176.064 1.12.528 1.312.624.192.096.32.144.368.224.048.08.048.464-.128.912-.176.448-.992.856-1.36.896-.368.04-.72.056-2.352-.512-1.952-.693-3.2-2.64-3.296-2.768-.096-.128-.784-.992-.784-1.888 0-.896.464-1.328.64-1.52a.672.672 0 01.489-.224l-.01.008z" fill="currentColor"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}

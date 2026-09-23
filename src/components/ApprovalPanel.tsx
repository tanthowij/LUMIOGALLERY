import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface ApprovalPanelProps {
  onClose: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default function ApprovalPanel({ onClose }: ApprovalPanelProps) {
  const { isSuperAdmin, requests, pendingCount, approve, reject } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  if (!isSuperAdmin) {
    return (
      <div className="modal-backdrop" onClick={onClose} style={{ padding: 16 }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', maxWidth: 400, width: '100%', padding: 24, textAlign: 'center' }}
        >
          <p style={{ fontSize: 14 }}>Halaman ini khusus super-admin.</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: 13, cursor: 'pointer' }}>
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const pending = requests.filter(r => r.status === 'pending');
  const decided = requests.filter(r => r.status !== 'pending');

  const act = (email: string, fn: (email: string) => void) => {
    setActing(email);
    setError(null);
    try {
      fn(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aksi gagal.');
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ padding: 16 }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 12,
          border: '1px solid var(--border)',
          maxWidth: 520,
          width: '100%',
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Persetujuan pendaftaran brand"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>
            Persetujuan Brand
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted-foreground)' }}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 20px' }}>
          {pendingCount > 0 ? `${pendingCount} pengajuan menunggu konfirmasimu.` : 'Tidak ada pengajuan menunggu.'}
        </p>

        {error && (
          <p style={{ fontSize: 13, color: '#b42318', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '8px 12px', margin: '0 0 16px' }}>
            {error}
          </p>
        )}

        {pending.length === 0 && decided.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', textAlign: 'center', padding: '24px 0' }}>
            Belum ada yang mendaftar. Saat seseorang mengajukan brand, akan muncul di sini.
          </p>
        )}

        {pending.map(req => (
          <div
            key={req.email}
            style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center' }}
          >
            {req.picture ? (
              <img src={req.picture} alt={req.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
            ) : (
              <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--primary)' }}>
                {(req.name || req.email).charAt(0).toUpperCase()}
              </span>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>“{req.brandName}”</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{req.name} · {req.email}</div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace' }}>{timeAgo(req.createdAt)}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => act(req.email, approve)}
                disabled={acting === req.email}
                style={{ padding: '8px 14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Setujui
              </button>
              <button
                onClick={() => act(req.email, reject)}
                disabled={acting === req.email}
                style={{ padding: '8px 14px', background: 'white', color: '#b42318', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
              >
                Tolak
              </button>
            </div>
          </div>
        ))}

        {decided.length > 0 && (
          <>
            <h3 style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace', margin: '20px 0 10px' }}>
              RIWAYAT KEPUTUSAN
            </h3>
            {decided.map(req => (
              <div key={req.email} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--secondary)', fontSize: 13 }}>
                <span
                  style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    background: req.status === 'approved' ? '#ecfdf5' : '#fef2f2',
                    color: req.status === 'approved' ? '#047857' : '#b42318',
                  }}
                >
                  {req.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
                </span>
                <span style={{ fontWeight: 600 }}>“{req.brandName}”</span>
                <span style={{ color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.email}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

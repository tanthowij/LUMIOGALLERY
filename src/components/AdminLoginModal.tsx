import { useCallback, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getGoogleClientId, getSuperAdminEmails } from '../auth/google';
import GoogleLoginButton from './GoogleLoginButton';

interface AdminLoginModalProps {
  onClose: () => void;
}

export default function AdminLoginModal({ onClose }: AdminLoginModalProps) {
  const { user, role, brandName, submitBrand, loginWithCredential } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [brandInput, setBrandInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const clientId = getGoogleClientId();
  const superAdmins = getSuperAdminEmails();

  const handleCredential = useCallback(
    (credential: string) => {
      try {
        loginWithCredential(credential);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login gagal. Coba lagi.');
      }
    },
    [loginWithCredential],
  );

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleSubmitBrand = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      submitBrand(brandInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pengajuan gagal. Coba lagi.');
    } finally {
      setSubmitting(false);
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
          maxWidth: 420,
          width: '100%',
          padding: '28px 24px',
          textAlign: 'center',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Login dan pendaftaran admin"
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 22,
          }}
        >
          🔒
        </div>

        {!clientId ? (
          <>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 8px' }}>
              Login Admin
            </h2>
            <div
              style={{
                textAlign: 'left',
                background: 'var(--secondary)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '14px 16px',
                fontSize: 12,
                lineHeight: 1.7,
                color: 'var(--foreground)',
              }}
            >
              <strong>Google Client ID belum dikonfigurasi.</strong>
              <ol style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                <li>
                  Buat OAuth Client ID di{' '}
                  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer">
                    Google Cloud Console
                  </a>{' '}
                  (tipe: Web application).
                </li>
                <li>
                  Tambahkan <code>http://localhost:5173</code> ke Authorized JavaScript origins.
                </li>
                <li>
                  Isi <code>VITE_GOOGLE_CLIENT_ID</code> di file <code>.env</code>, lalu restart dev server.
                </li>
              </ol>
            </div>
          </>
        ) : !user ? (
          <>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 8px' }}>
              Masuk / Daftar
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 20px', lineHeight: 1.6 }}>
              Masuk dengan Google. Semua orang bisa mendaftar brand — akun aktif setelah disetujui super-admin.
            </p>
            <GoogleLoginButton onCredential={handleCredential} onError={handleError} />
            {superAdmins.length > 0 && (
              <p style={{ fontSize: 11, color: 'var(--muted-foreground)', margin: '16px 0 0', fontFamily: 'DM Mono, monospace' }}>
                Disetujui oleh tim super-admin
              </p>
            )}
          </>
        ) : role === 'superadmin' || role === 'admin' ? (
          <>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 8px' }}>
              Halo, {brandName}! 👋
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 20px', lineHeight: 1.6 }}>
              {user.email}
              <br />
              {role === 'superadmin'
                ? 'Masuk sebagai Super Admin — kamu bisa menyetujui pendaftaran brand baru.'
                : `Brand “${brandName}” sudah aktif — kamu bisa menambah dan mengelola album.`}
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Mulai Kelola
            </button>
          </>
        ) : role === 'pending' ? (
          <>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 8px' }}>
              Menunggu persetujuan ⏳
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 8px', lineHeight: 1.6 }}>
              Brand <strong>“{brandName}”</strong> ({user.email}) sedang menunggu konfirmasi super-admin.
            </p>
            <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 20px' }}>
              Biarkan halaman ini terbuka atau cek lagi nanti — status terupdate otomatis.
            </p>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: 13, cursor: 'pointer' }}
            >
              Tutup
            </button>
          </>
        ) : (
          <>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 8px' }}>
              Daftarkan Brand
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 6px', lineHeight: 1.6 }}>
              Masuk sebagai <strong>{user.email}</strong>
            </p>
            {role === 'rejected' ? (
              <p style={{ fontSize: 13, color: '#b42318', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '8px 12px', margin: '0 0 16px' }}>
                Pengajuan “{brandName}” ditolak. Ganti nama brand lalu ajukan ulang.
              </p>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 16px', lineHeight: 1.6 }}>
                Buat nama brand/studiomu. Aktif setelah disetujui super-admin.
              </p>
            )}
            <form onSubmit={handleSubmitBrand} style={{ textAlign: 'left' }}>
              <label style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace' }}>
                NAMA BRAND
              </label>
              <input
                className="lumio-input"
                value={brandInput}
                onChange={e => setBrandInput(e.target.value)}
                placeholder="mis. Kirana Studio"
                maxLength={40}
                style={{ marginTop: 6 }}
              />
              <button
                type="submit"
                disabled={submitting || brandInput.trim().length < 3}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '10px 24px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: submitting || brandInput.trim().length < 3 ? 'not-allowed' : 'pointer',
                  opacity: submitting || brandInput.trim().length < 3 ? 0.6 : 1,
                }}
              >
                {submitting ? 'Mengirim…' : 'Ajukan Brand'}
              </button>
            </form>
          </>
        )}

        {error && (
          <p style={{ fontSize: 13, color: '#b42318', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '8px 12px', margin: '16px 0 0' }}>
            {error}
          </p>
        )}

        {(role === null || role === 'guest' || role === 'rejected') && (user || clientId) && (
          <button
            onClick={onClose}
            style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: 13, cursor: 'pointer' }}
          >
            Batal
          </button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { getGoogleClientId, loadGoogleScript } from '../auth/google';

interface GoogleLoginButtonProps {
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleLoginButton({ onCredential, onError }: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const clientId = getGoogleClientId();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!clientId) {
        setLoading(false);
        return;
      }
      try {
        await loadGoogleScript();
        if (cancelled) return;
        if (!window.google?.accounts?.id) {
          throw new Error('Google Identity Services tidak tersedia.');
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              onCredential(response.credential);
            } else {
              onError('Login Google dibatalkan. Coba lagi.');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: 280,
          });
        }
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          onError(err instanceof Error ? err.message : 'Gagal memuat login Google.');
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential, onError]);

  if (!clientId) return null;
  if (loading) {
    return <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0 }}>Memuat tombol Google…</p>;
  }
  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }} />;
}

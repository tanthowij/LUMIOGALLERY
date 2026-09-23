export interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export function getGoogleClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';
}

export function getSuperAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? '';
  return raw
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** 3 akun penyetuju utama. Kosong = mode demo (semua yang login jadi super-admin). */
export function isSuperAdmin(email: string): boolean {
  const allowlist = getSuperAdminEmails();
  if (allowlist.length === 0) return true;
  return allowlist.includes(email.trim().toLowerCase());
}

/** Alias lama — sama dengan super-admin. */
export const getAdminEmails = getSuperAdminEmails;
export const isAdminEmail = isSuperAdmin;

export function decodeGoogleCredential(credential: string): GoogleUser {
  const parts = credential.split('.');
  if (parts.length < 2) throw new Error('Kredensial Google tidak valid.');
  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
  const json = atob(padded);
  const data = JSON.parse(decodeURIComponent(escape(json)));
  if (!data.email) throw new Error('Kredensial Google tidak memuat email.');
  return {
    sub: String(data.sub ?? ''),
    email: String(data.email),
    name: String(data.name ?? data.email),
    picture: data.picture ? String(data.picture) : undefined,
  };
}

let scriptPromise: Promise<void> | null = null;

export function loadGoogleScript(): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
    return Promise.resolve();
  }
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Gagal memuat Google Identity Services.')));
      return;
    }
    const script = document.createElement('script');
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat Google Identity Services. Periksa koneksi internet.'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

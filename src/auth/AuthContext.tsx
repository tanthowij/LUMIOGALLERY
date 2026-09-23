import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  decodeGoogleCredential,
  isSuperAdmin,
  type GoogleUser,
} from './google';
import {
  REGISTRY_KEY,
  countPending,
  decideBrandRequest,
  getBrandRequests,
  getMyRequest,
  submitBrandRequest,
  type BrandRequest,
} from './registry';

const STORAGE_KEY = 'lumio_admin_user';

export type Role = 'superadmin' | 'admin' | 'pending' | 'rejected' | 'guest';

interface AuthContextValue {
  user: GoogleUser | null;
  role: Role | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  brandName: string | null;
  myRequest: BrandRequest | null;
  requests: BrandRequest[];
  pendingCount: number;
  loginWithCredential: (credential: string) => Role;
  logout: () => void;
  submitBrand: (brandName: string) => void;
  approve: (email: string) => void;
  reject: (email: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): GoogleUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GoogleUser;
    if (!parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function resolveRole(user: GoogleUser | null): { role: Role | null; request: BrandRequest | null } {
  if (!user) return { role: null, request: null };
  if (isSuperAdmin(user.email)) return { role: 'superadmin', request: null };
  const request = getMyRequest(user.email);
  if (!request) return { role: 'guest', request: null };
  if (request.status === 'approved') return { role: 'admin', request };
  if (request.status === 'pending') return { role: 'pending', request };
  return { role: 'rejected', request };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(() => loadStoredUser());
  const [registryVersion, setRegistryVersion] = useState(0);

  // Sinkron antar tab: pengajuan baru / keputusan super-admin langsung terlihat.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === REGISTRY_KEY) setRegistryVersion(v => v + 1);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const loginWithCredential = useCallback((credential: string): Role => {
    const profile = decodeGoogleCredential(credential);
    setUser(profile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // abaikan - mode private / storage penuh
    }
    return resolveRole(profile).role!;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // abaikan
    }
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.disableAutoSelect();
      } catch {
        // abaikan
      }
    }
  }, []);

  const submitBrand = useCallback(
    (brandName: string) => {
      if (!user) throw new Error('Masuk dulu dengan akun Google.');
      submitBrandRequest(user, brandName);
      setRegistryVersion(v => v + 1);
    },
    [user],
  );

  const approve = useCallback(
    (email: string) => {
      if (!user || !isSuperAdmin(user.email)) throw new Error('Hanya super-admin yang bisa menyetujui.');
      decideBrandRequest(email, 'approved', user.email);
      setRegistryVersion(v => v + 1);
    },
    [user],
  );

  const reject = useCallback(
    (email: string) => {
      if (!user || !isSuperAdmin(user.email)) throw new Error('Hanya super-admin yang bisa menolak.');
      decideBrandRequest(email, 'rejected', user.email);
      setRegistryVersion(v => v + 1);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(() => {
    void registryVersion;
    const { role, request } = resolveRole(user);
    const superAdmin = role === 'superadmin';
    const admin = role === 'admin';
    const brandName =
      superAdmin ? 'Super Admin' : request && request.status === 'approved' ? request.brandName : request?.brandName ?? null;
    return {
      user,
      role,
      isSuperAdmin: superAdmin,
      isAdmin: superAdmin || admin,
      brandName,
      myRequest: request,
      requests: getBrandRequests(),
      pendingCount: countPending(),
      loginWithCredential,
      logout,
      submitBrand,
      approve,
      reject,
    };
  }, [user, registryVersion, loginWithCredential, logout, submitBrand, approve, reject]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}

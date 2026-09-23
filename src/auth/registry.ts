import type { GoogleUser } from './google';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface BrandRequest {
  email: string;
  name: string;
  picture?: string;
  brandName: string;
  status: RequestStatus;
  createdAt: number;
  decidedBy?: string;
  decidedAt?: number;
}

export const REGISTRY_KEY = 'lumio_brand_requests';

export function getBrandRequests(): BrandRequest[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r: any) => r && typeof r.email === 'string');
  } catch {
    return [];
  }
}

function saveBrandRequests(requests: BrandRequest[]): void {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(requests));
  } catch {
    // abaikan - mode private / storage penuh
  }
}

export function getMyRequest(email: string): BrandRequest | null {
  const key = email.trim().toLowerCase();
  return getBrandRequests().find(r => r.email === key) ?? null;
}

export function getApprovedBrand(email: string): string | null {
  const req = getMyRequest(email);
  return req && req.status === 'approved' ? req.brandName : null;
}

export function isApprovedAdmin(email: string): boolean {
  return getApprovedBrand(email) !== null;
}

export function countPending(): number {
  return getBrandRequests().filter(r => r.status === 'pending').length;
}

export function validateBrandName(brandName: string): string {
  const name = brandName.trim();
  if (name.length < 3) throw new Error('Nama brand minimal 3 karakter.');
  if (name.length > 40) throw new Error('Nama brand maksimal 40 karakter.');
  return name;
}

/** Daftar / ajukan ulang. Lempar Error bila nama brand tidak valid. */
export function submitBrandRequest(profile: GoogleUser, brandName: string): BrandRequest {
  const name = validateBrandName(brandName);
  const email = profile.email.trim().toLowerCase();
  const requests = getBrandRequests();
  const existing = requests.find(r => r.email === email);
  const now = Date.now();

  if (existing) {
    if (existing.status === 'approved') return existing;
    existing.brandName = name;
    existing.name = profile.name;
    existing.picture = profile.picture;
    existing.status = 'pending';
    existing.createdAt = now;
    delete existing.decidedBy;
    delete existing.decidedAt;
  } else {
    requests.unshift({
      email,
      name: profile.name,
      picture: profile.picture,
      brandName: name,
      status: 'pending',
      createdAt: now,
    });
  }
  saveBrandRequests(requests);
  return requests.find(r => r.email === email)!;
}

export function decideBrandRequest(
  targetEmail: string,
  decision: 'approved' | 'rejected',
  decidedBy: string,
): BrandRequest[] {
  const key = targetEmail.trim().toLowerCase();
  const requests = getBrandRequests();
  const target = requests.find(r => r.email === key);
  if (!target) throw new Error('Pengajuan tidak ditemukan.');
  target.status = decision;
  target.decidedBy = decidedBy.trim().toLowerCase();
  target.decidedAt = Date.now();
  saveBrandRequests(requests);
  return requests;
}

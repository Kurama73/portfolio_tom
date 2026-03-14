const LOCALHOSTS = new Set(['localhost', '127.0.0.1']);

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const resolveConfiguredApiBase = (): string | null => {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (!configured) return null;
  return trimTrailingSlash(configured);
};

const resolveDefaultApiBase = (): string => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3001/api';
  }

  const { protocol, hostname, port } = window.location;
  if (LOCALHOSTS.has(hostname) && port !== '3001') {
    return `${protocol}//${hostname}:3001/api`;
  }

  return '/api';
};

export const API_BASE_URL = resolveConfiguredApiBase() ?? resolveDefaultApiBase();

const resolveApiOrigin = (): string => {
  if (API_BASE_URL.startsWith('/')) {
    return '';
  }

  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
};

const API_ORIGIN = resolveApiOrigin();

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const buildAssetUrl = (path?: string | null): string => {
  if (!path) return '';

  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_ORIGIN ? `${API_ORIGIN}${normalizedPath}` : normalizedPath;
};
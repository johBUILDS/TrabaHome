const WORKER_AUTH_STORAGE_KEY = 'trabahome_worker_auth';
const LEGACY_TEMP_WORKER_SESSION_KEY = 'trabahome_worker_session';

export interface WorkerSessionProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}

export interface WorkerAuthSession {
  token: string;
  email: string;
  worker: WorkerSessionProfile | null;
  signedInAt: string;
}

interface SaveWorkerSessionInput {
  token: string;
  email: string;
  worker?: WorkerSessionProfile | null;
}

const isBrowser = (): boolean => typeof window !== 'undefined';

const parseStoredSession = (rawSession: string | null): WorkerAuthSession | null => {
  if (!rawSession) return null;

  try {
    const parsed = JSON.parse(rawSession) as Partial<WorkerAuthSession>;
    if (!parsed || typeof parsed.token !== 'string' || !parsed.token.trim()) return null;

    return {
      token: parsed.token,
      email: typeof parsed.email === 'string' ? parsed.email : '',
      worker: parsed.worker && typeof parsed.worker === 'object' ? parsed.worker as WorkerSessionProfile : null,
      signedInAt: typeof parsed.signedInAt === 'string' ? parsed.signedInAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

export const saveWorkerSession = ({ token, email, worker = null }: SaveWorkerSessionInput): void => {
  if (!isBrowser()) return;

  const session: WorkerAuthSession = {
    token,
    email,
    worker,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(WORKER_AUTH_STORAGE_KEY, JSON.stringify(session));
  window.localStorage.removeItem(LEGACY_TEMP_WORKER_SESSION_KEY);
};

export const getWorkerSession = (): WorkerAuthSession | null => {
  if (!isBrowser()) return null;

  const rawSession = window.localStorage.getItem(WORKER_AUTH_STORAGE_KEY);
  const parsedSession = parseStoredSession(rawSession);

  if (!parsedSession) {
    window.localStorage.removeItem(WORKER_AUTH_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_TEMP_WORKER_SESSION_KEY);
    return null;
  }

  return parsedSession;
};

export const getWorkerAuthToken = (): string | null => {
  return getWorkerSession()?.token ?? null;
};

export const isWorkerAuthenticated = (): boolean => {
  return Boolean(getWorkerAuthToken());
};

export const clearWorkerSession = (): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(WORKER_AUTH_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_TEMP_WORKER_SESSION_KEY);
};

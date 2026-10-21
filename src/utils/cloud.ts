// 云端存储（Supabase）：把文章/分类/标签/设置整存整取地放在 blog_store 表里。
// 读：任何人可用 anon key 读（网站公开内容）。
// 写：只有管理员邮箱登录后的令牌能写（数据库规则锁死到该邮箱）。
// 这里只用原生 fetch 调 Supabase 的 REST/Auth 接口，不引新依赖。

export const CLOUD_URL = "https://fgwsrnqwffggumsuovdo.supabase.co";
export const CLOUD_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnd3NybnF3ZmZnZ3Vtc3VvdmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDg3ODgsImV4cCI6MjEwODE4NDc4OH0.VE2F0ADtapdglUscfnVf8DkxE03Pn0HFSIfVvE1rczw";

const SESSION_KEY = "blog_cloud_session";
const SYNCED_KEY = "blog_cloud_synced";

export interface CloudSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // 秒级时间戳
  email: string;
}

export function cloudConfigured(): boolean {
  return !CLOUD_URL.includes("REPLACE_ME") && !CLOUD_ANON_KEY.includes("REPLACE_ME");
}

export function getCloudSession(): CloudSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as CloudSession;
  } catch {
    // ignore
  }
  return null;
}

function saveCloudSession(s: CloudSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function clearCloudSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isCloudSynced(): boolean {
  return localStorage.getItem(SYNCED_KEY) === "1";
}

export function markCloudSynced(): void {
  localStorage.setItem(SYNCED_KEY, "1");
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: { email?: string };
}

function toSession(data: TokenResponse, fallbackEmail: string): CloudSession {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
    email: data.user?.email || fallbackEmail,
  };
}

export async function cloudSignIn(
  email: string,
  password: string
): Promise<CloudSession> {
  const res = await fetch(
    `${CLOUD_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: CLOUD_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!res.ok) {
    throw new Error("sign-in failed");
  }
  const data = (await res.json()) as TokenResponse;
  const session = toSession(data, email);
  saveCloudSession(session);
  return session;
}

export async function getAccessToken(): Promise<string | null> {
  const session = getCloudSession();
  if (!session) return null;
  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at - 60 > now) {
    return session.access_token;
  }
  // 令牌快过期了，用 refresh token 续一次
  try {
    const res = await fetch(
      `${CLOUD_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          apikey: CLOUD_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: session.refresh_token }),
      }
    );
    if (!res.ok) throw new Error("refresh failed");
    const data = (await res.json()) as TokenResponse;
    const next = toSession(data, session.email);
    saveCloudSession(next);
    return next.access_token;
  } catch {
    clearCloudSession();
    return null;
  }
}

// 拉取云端全部数据：成功返回 key->value 的对象（表为空时返回空对象），失败返回 null
export async function fetchCloudCollections(): Promise<Record<
  string,
  unknown
> | null> {
  if (!cloudConfigured()) return null;
  try {
    const res = await fetch(`${CLOUD_URL}/rest/v1/blog_store?select=key,value`, {
      headers: {
        apikey: CLOUD_ANON_KEY,
        Authorization: `Bearer ${CLOUD_ANON_KEY}`,
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { key: string; value: unknown }[];
    const map: Record<string, unknown> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  } catch {
    return null;
  }
}

// 把一整组数据（如全部文章）写到云端。需要管理员登录令牌。
export async function pushCollection(
  key: string,
  value: unknown
): Promise<boolean> {
  if (!cloudConfigured()) return false;
  const token = await getAccessToken();
  if (!token) return false;
  try {
    const res = await fetch(`${CLOUD_URL}/rest/v1/blog_store`, {
      method: "POST",
      headers: {
        apikey: CLOUD_ANON_KEY,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify([
        { key, value, updated_at: new Date().toISOString() },
      ]),
    });
    if (res.ok) {
      markCloudSynced();
    }
    return res.ok;
  } catch {
    return false;
  }
}

// 设置里含后台密码字段，绝不能同步到公开可读的云端，同步前剔除
export function stripSettingsForCloud<T extends { adminPassword?: string }>(
  settings: T
): Omit<T, "adminPassword"> {
  const { adminPassword: _removed, ...rest } = settings;
  return rest;
}

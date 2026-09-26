// A small GitHub REST client over fetch. The token goes in one header and
// nowhere else; redirects to storage hosts are followed without it.

export class GitHubError extends Error {
  constructor(status, message, { method, path } = {}) {
    super(`${method ?? ''} ${path ?? ''} → ${status}: ${message}`.trim());
    this.name = 'GitHubError';
    this.status = status;
  }
}

export function createClient({ token, apiUrl = 'https://api.github.com', fetch: fetchImpl = globalThis.fetch, userAgent = 'document-design-report' }) {
  const base = apiUrl.replace(/\/$/, '');

  async function request(method, path, { body, headers = {}, accept = 'application/vnd.github+json', raw = false, redirect = 'follow' } = {}) {
    const url = path.startsWith('http') ? path : `${base}${path}`;
    const init = {
      method,
      redirect: raw ? 'manual' : redirect,
      headers: { Accept: accept, Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': userAgent, ...headers },
    };
    if (body !== undefined) {
      if (Buffer.isBuffer(body) || body instanceof Uint8Array) init.body = body;
      else { init.body = JSON.stringify(body); init.headers['Content-Type'] = 'application/json'; }
    }
    let response = await fetchImpl(url, init);
    if (raw && [301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) throw new GitHubError(response.status, 'redirect without location', { method, path });
      // Storage hosts reject the API token; the redirect URL is self-signed.
      response = await fetchImpl(location, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': userAgent } });
    }
    if (!response.ok) {
      let detail = '';
      try { const text = await response.text(); detail = safeMessage(text); } catch {}
      throw new GitHubError(response.status, detail || response.statusText, { method, path });
    }
    if (raw) return Buffer.from(await response.arrayBuffer());
    if (response.status === 204) return null;
    const text = await response.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  }

  async function paginate(path, { limit = Infinity } = {}) {
    const out = [];
    let url = path.startsWith('http') ? path : `${base}${path}`;
    while (url && out.length < limit) {
      const response = await fetchImpl(url, { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': userAgent } });
      if (!response.ok) throw new GitHubError(response.status, safeMessage(await response.text().catch(() => '')), { method: 'GET', path });
      const page = await response.json();
      out.push(...(Array.isArray(page) ? page : []));
      const link = response.headers.get('link') ?? '';
      const next = /<([^>]+)>;\s*rel="next"/.exec(link);
      url = next ? next[1] : null;
    }
    return out.slice(0, limit);
  }

  return { request, paginate, apiUrl: base };
}

function safeMessage(text) {
  try {
    const json = JSON.parse(text);
    return String(json.message ?? text).slice(0, 300);
  } catch {
    return String(text).slice(0, 300);
  }
}

import type { HttpError } from '@/lib/http/types'

function getBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? ''
  return raw.replace(/\/+$/, '')
}

function toHttpError(status: number, message: string): HttpError {
  return { status, message }
}

export function isHttpError(e: unknown): e is HttpError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'status' in e &&
    typeof (e as { status: unknown }).status === 'number'
  )
}

export async function httpGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, { ...init, method: 'GET' })
  if (!res.ok) {
    throw toHttpError(res.status, res.statusText || 'Request failed')
  }
  return (await res.json()) as T
}

export async function httpPostJson<TBody, TResponse>(
  path: string,
  body: TBody,
  init?: RequestInit,
): Promise<TResponse> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let message = res.statusText || 'Request failed'
    try {
      const errBody = (await res.json()) as { message?: unknown }
      if (typeof errBody.message === 'string' && errBody.message.trim()) {
        message = errBody.message
      }
    } catch {
      /* ignore */
    }
    throw toHttpError(res.status, message)
  }
  return (await res.json()) as TResponse
}

export async function httpPutJson<TBody, TResponse>(
  path: string,
  body: TBody,
  init?: RequestInit,
): Promise<TResponse> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    ...init,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw toHttpError(res.status, res.statusText || 'Request failed')
  }
  return (await res.json()) as TResponse
}

export async function httpDelete(path: string, init?: RequestInit): Promise<void> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, { ...init, method: 'DELETE' })
  if (!res.ok) {
    throw toHttpError(res.status, res.statusText || 'Request failed')
  }
}

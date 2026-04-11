import { next } from '@vercel/edge'

/** Crawlers que leem o HTML sem executar JS (evitar match genérico em "Instagram" — UA do app móvel contém essa string). */
const SOCIAL_UA =
  /facebookexternalhit|Facebot|WhatsApp|LinkedInBot|Slackbot|Twitterbot|TelegramBot|Pinterest/i

export const config = {
  matcher: '/produto/:path*',
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const match = url.pathname.match(/^\/produto\/([^/]+)\/?$/)
  if (!match) return next()

  const ua = request.headers.get('user-agent') ?? ''
  if (!SOCIAL_UA.test(ua)) return next()

  const apiBase = (process.env.VITE_API_URL ?? '').replace(/\/+$/, '')
  if (!apiBase) return next()

  const slug = match[1]
  const upstream = `${apiBase}/internal/social-pdp/${encodeURIComponent(slug)}`

  try {
    const res = await fetch(upstream, {
      headers: {
        'X-Forwarded-Host': url.hostname,
        'X-Forwarded-Proto': url.protocol.replace(':', '') || 'https',
      },
    })
    if (!res.ok) return next()
    const html = await res.text()
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch {
    return next()
  }
}

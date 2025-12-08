import type { NextRequest } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://10.7.35.44:8080/api'

function buildTargetUrl(req: NextRequest, path: string[]) {
  const search = req.nextUrl.search || ''
  const joined = path?.length ? path.join('/') : ''
  return `${API_BASE}/${joined}${search}`
}

async function proxy(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const params = await paramsPromise
  const target = buildTargetUrl(req, params.path)
  const init: RequestInit = {
    method: req.method,
    headers: {
      'content-type': req.headers.get('content-type') || 'application/json',
    },
  }
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    init.body = await req.text()
  }
  const res = await fetch(target, init)
  const text = await res.text()
  return new Response(text, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
  })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params)
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params)
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params)
}

export async function OPTIONS(_req: NextRequest) {
  return new Response(null, { status: 204 })
}

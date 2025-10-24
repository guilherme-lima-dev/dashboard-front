import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/register'];
  
  // Se for uma rota pública, permitir acesso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Para desenvolvimento, permitir acesso a todas as rotas sem verificação de token
  // O Zustand store será verificado no lado do cliente
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

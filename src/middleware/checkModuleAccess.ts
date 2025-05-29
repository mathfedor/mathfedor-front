import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authService } from '@/services/auth.service';
import { purchaseService } from '@/services/purchase.service';

export async function checkModuleAccess(request: NextRequest) {
  try {
    // Verificar si el usuario está autenticado
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Obtener el ID del módulo de la URL
    const moduleId = request.nextUrl.pathname.split('/').pop();
    if (!moduleId) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Verificar si el usuario tiene acceso al módulo
    const hasAccess = await purchaseService.hasAccessToModule(user.id, moduleId);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar acceso al módulo:', error);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
} 
'use client';

import './book.css';
import BookExperience from '@/components/book/BookExperience';

/**
 * Ruta del libro interactivo "Matemáticas de Fedor 2°", integrada en el
 * shell del dashboard (Sidebar + AuthenticatedNavbar via layout existente).
 */
export default function Libro2doPage() {
  return <BookExperience />;
}

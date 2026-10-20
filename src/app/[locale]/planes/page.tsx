import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingSection from '@/components/pricing/PricingSection';

export const metadata = {
  title: 'Planes y Precios | Matemáticas de Fedor',
  description: 'Conoce nuestros planes de suscripción mensual, semestral y anual para estudiantes y familias colombianas.',
};

export default function PlanesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 py-8">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

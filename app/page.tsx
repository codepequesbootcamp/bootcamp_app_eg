'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [animando, setAnimando] = useState(false);

  const irAlPanel = () => {
    setAnimando(true);
    // Esperamos 500ms a que la animación cubra la pantalla antes de cambiar de ruta
    setTimeout(() => {
      router.push('/nueva');
    }, 500);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden bg-gray-50">
      {/* CAPA DE ANIMACIÓN EXPANSIVA */}
      <div
        className={`fixed inset-0 bg-indigo-600 rounded-full transition-all duration-500 ease-in-out pointer-events-none z-50 ${
          animando ? 'scale-[3] opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{ transformOrigin: 'center' }}
      />

      {/* CONTENIDO PRINCIPAL */}
      <div className="text-center space-y-6 max-w-md z-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Gestor de Juguetes 🧸
        </h1>
        <p className="text-gray-600 text-lg">
          Bienvenido al sistema de inventario. Controla tus productos y favoritos en un solo lugar.
        </p>

        <button
          onClick={irAlPanel}
          disabled={animando}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
        >
          Ir al Panel de Inventario
        </button>
      </div>
    </main>
  );
}
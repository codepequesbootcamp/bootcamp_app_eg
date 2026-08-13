import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
      <div className="max-w-md space-y-6 bg-white p-8 rounded-xl shadow-md border">
        <h1 className="text-4xl font-extrabold text-gray-800">
          🧸 Tienda de Juguetes
        </h1>
        <p className="text-gray-600 text-lg">
          Bienvenido al sistema de gestión de juguetes. Desde aquí podrás administrar todo tu inventario en un solo lugar.
        </p>

        {/* BOTÓN GIGANTE AL PANEL */}
        <div className="pt-4">
          <Link
            href="/nueva"
            className="inline-block w-full py-4 px-6 bg-blue-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 transform hover:-translate-y-0.5"
          >
            🚀 Ir al Panel de Juguetes
          </Link>
        </div>
      </div>
    </main>
  );
}

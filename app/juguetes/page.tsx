'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  const fetchItems = async () => {
    try {
      const res = await fetch('/api/juguetes');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error al cargar datos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. CONFIRMACIÓN DE ELIMINACIÓN
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('¿Estás seguro que quieres eliminar esto?');
    if (!confirmed) return; // Si cancela, se interrumpe la ejecución

    try {
      const res = await fetch(`/api/juguetes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listado de Registros</h1>
        <Link
          href="/juguetes/nuevo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear nuevo
        </Link>
      </div>

      {/* 1. EMPTY STATE (SI NO HAY REGISTROS) */}
      {items.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">No hay registros disponibles aún.</p>
          <Link
            href="/juguetes/nuevo"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
          >
            Crear el primero
          </Link>
        </div>
      ) : (
        /* LISTA DE REGISTROS */
        <ul className="divide-y border rounded">
          {items.map((item) => (
            <li key={item.id} className="p-4 flex justify-between items-center">
              <span>{item.nombre}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
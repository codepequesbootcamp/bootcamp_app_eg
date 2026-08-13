'use client';

import { useEffect, useState } from 'react';

// 1. Actualizamos la interfaz para incluir esFavorito
interface Juguete {
  id: number;
  nombre: string;
  categoria: string;
  esFavorito?: boolean;
}

export default function PanelJuguetesPage() {
  const [juguetes, setJuguetes] = useState<Juguete[]>([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  // Cargar la lista desde la API
  const obtenerJuguetes = async () => {
    try {
      const res = await fetch('/api/juguetes', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setJuguetes(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerJuguetes();
  }, []);

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !categoria) return;

    if (idEditando !== null) {
      // Modo EDITAR (PUT)
      await fetch(`/api/juguetes/${idEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, categoria }),
      });
      setIdEditando(null);
    } else {
      // Modo CREAR (POST)
      await fetch('/api/juguetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, categoria }),
      });
    }

    setNombre('');
    setCategoria('');
    obtenerJuguetes();
  };

  // Cargar datos en el formulario para editar
  const prepararEdicion = (juguete: Juguete) => {
    setIdEditando(juguete.id);
    setNombre(juguete.nombre);
    setCategoria(juguete.categoria);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setIdEditando(null);
    setNombre('');
    setCategoria('');
  };

  // Eliminar Juguete (DELETE)
  const eliminarJuguete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este juguete?')) return;
    
    await fetch(`/api/juguetes/${id}`, { method: 'DELETE' });
    obtenerJuguetes();
  };

  // 2. FUNCIÓN: Alternar estrella (Frontend + Backend)
  const toggleFavoritoFrontend = async (id: number) => {
    // Buscamos cuál es el juguete que estamos tocando
    const jugueteActual = juguetes.find(j => j.id === id);
    if (!jugueteActual) return;
    
    const nuevoEstado = !jugueteActual.esFavorito;

    // A. Cambio visual instantáneo (Frontend)
    setJuguetes(juguetes.map((j) => {
      if (j.id === id) {
        return { ...j, esFavorito: nuevoEstado };
      }
      return j;
    }));

    // B. Guardar en la Base de Datos (Backend)
    try {
      await fetch(`/api/juguetes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: jugueteActual.nombre,
          categoria: jugueteActual.categoria,
          esFavorito: nuevoEstado 
        }),
      });
    } catch (error) {
      console.error('Error guardando favorito:', error);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">Panel de Inventario</h1>

      {/* FORMULARIO DE AGREGAR / EDITAR */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-gray-50 space-y-4 shadow-sm">
        <h2 className="text-xl font-semibold">
          {idEditando !== null ? '✏️ Editar Juguete' : '➕ Agregar Nuevo Juguete'}
        </h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: Balón de Fútbol"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: Deportes"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
          >
            {idEditando !== null ? 'Guardar Cambios' : 'Agregar a la Lista'}
          </button>
          
          {idEditando !== null && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTA DE JUGUETES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Lista de Juguetes</h2>

        {cargando ? (
          <p>Cargando inventario...</p>
        ) : juguetes.length === 0 ? (
          <p className="text-gray-500">No hay juguetes registrados.</p>
        ) : (
          <div className="space-y-3">
            {juguetes.map((j) => (
              <div key={j.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">{j.nombre}</p>
                    {/* Botón interactivo de Favorito */}
                    <button
                      type="button"
                      onClick={() => toggleFavoritoFrontend(j.id)}
                      className="text-xl hover:scale-125 transition-transform"
                      title={j.esFavorito ? 'Quitar de favoritos' : 'Marcar como favorito'}
                    >
                      {j.esFavorito ? '⭐' : '☆'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{j.categoria}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => prepararEdicion(j)}
                    className="text-blue-600 hover:underline text-sm font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarJuguete(j.id)}
                    className="text-red-600 hover:underline text-sm font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
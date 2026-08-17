'use client';

import { useEffect, useState } from 'react';

interface Juguete {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  imagenUrl?: string;
  esFavorito?: boolean;
}

export default function PanelJuguetesPage() {
  const [juguetes, setJuguetes] = useState<Juguete[]>([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [busqueda, setBusqueda] = useState(''); // 👈 Estado para el buscador
  
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !categoria) return;

    const payload = { nombre, categoria, descripcion, imagenUrl };

    if (idEditando !== null) {
      await fetch(`/api/juguetes/${idEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setIdEditando(null);
    } else {
      await fetch('/api/juguetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    limpiarFormulario();
    obtenerJuguetes();
  };

  const prepararEdicion = (juguete: Juguete) => {
    setIdEditando(juguete.id);
    setNombre(juguete.nombre);
    setCategoria(juguete.categoria);
    setDescripcion(juguete.descripcion || '');
    setImagenUrl(juguete.imagenUrl || '');
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre('');
    setCategoria('');
    setDescripcion('');
    setImagenUrl('');
    setMostrarFormulario(false);
  };

  const eliminarJuguete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este juguete?')) return;
    await fetch(`/api/juguetes/${id}`, { method: 'DELETE' });
    obtenerJuguetes();
  };

  const toggleFavoritoFrontend = async (id: number) => {
    const jugueteActual = juguetes.find(j => j.id === id);
    if (!jugueteActual) return;
    
    const nuevoEstado = !jugueteActual.esFavorito;

    setJuguetes(juguetes.map((j) => {
      if (j.id === id) {
        return { ...j, esFavorito: nuevoEstado };
      }
      return j;
    }));

    try {
      await fetch(`/api/juguetes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: jugueteActual.nombre,
          categoria: jugueteActual.categoria,
          descripcion: jugueteActual.descripcion,
          imagenUrl: jugueteActual.imagenUrl,
          esFavorito: nuevoEstado 
        }),
      });
    } catch (error) {
      console.error('Error guardando favorito:', error);
    }
  };

  // 1. FILTRADO POR BÚSQUEDA Y 2. ORDENADO POR FAVORITOS
  const juguetesFiltradosYOrdenados = juguetes
    .filter((j) => 
      j.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      j.categoria.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => Number(b.esFavorito || 0) - Number(a.esFavorito || 0));

  return (
    <main className="p-8 max-w-xl mx-auto space-y-8">
      {/* CABECERA */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Inventario</h1>
        <button
          type="button"
          onClick={() => {
            if (mostrarFormulario) {
              limpiarFormulario();
            } else {
              setMostrarFormulario(true);
            }
          }}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm flex items-center gap-2"
        >
          {mostrarFormulario ? '✕ Cerrar' : '➕ Agregar Juguete'}
        </button>
      </div>

      {/* FORMULARIO CORTINA */}
      <div
        className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
          mostrarFormulario
            ? 'grid-rows-[1fr] opacity-100 mb-8'
            : 'grid-rows-[0fr] opacity-0 mb-0'
        }`}
      >
        <div className="min-h-0">
          <form
            onSubmit={handleSubmit}
            className="p-6 border border-gray-200 rounded-xl bg-gray-50/80 backdrop-blur space-y-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-700">
              {idEditando !== null ? '✏️ Editar Juguete' : '➕ Agregar Nuevo Juguete'}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="Ej: Balón de Fútbol"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Categoría:</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="Ej: Deportes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Descripción:</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="Ej: Balón oficial de cuero sintético número 5..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">URL de la Imagen:</label>
              <input
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                {idEditando !== null ? 'Guardar Cambios' : 'Agregar a la Lista'}
              </button>

              <button
                type="button"
                onClick={limpiarFormulario}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECCIÓN LISTA CON CONTADOR Y BUSCADOR */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Lista de Juguetes
            <span className="text-sm font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
              {juguetesFiltradosYOrdenados.length}
            </span>
          </h2>
        </div>

        {/* CAMPO DE BÚSQUEDA UBICADO DONDE INDICASTE */}
        <div className="relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar juguete por nombre..."
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {cargando ? (
          <p className="text-gray-500">Cargando inventario...</p>
        ) : juguetesFiltradosYOrdenados.length === 0 ? (
          <p className="text-gray-500 text-sm italic py-4">
            {busqueda ? 'No se encontraron resultados para tu búsqueda.' : 'No hay juguetes registrados.'}
          </p>
        ) : (
          <div className="space-y-4">
            {juguetesFiltradosYOrdenados.map((j) => (
              <div 
                key={j.id} 
                className={`p-4 border rounded-xl bg-white shadow-sm flex gap-4 items-start transition-all ${
                  j.esFavorito ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-gray-200'
                }`}
              >
                {j.imagenUrl && (
                  <img
                    src={j.imagenUrl}
                    alt={j.nombre}
                    className="w-20 h-20 object-cover rounded-lg border flex-shrink-0"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg text-gray-800">{j.nombre}</p>
                    <button
                      type="button"
                      onClick={() => toggleFavoritoFrontend(j.id)}
                      className="text-xl hover:scale-125 transition-transform"
                      title={j.esFavorito ? 'Quitar de favoritos' : 'Marcar como favorito'}
                    >
                      {j.esFavorito ? '⭐' : '☆'}
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                    {j.categoria}
                  </p>
                  {j.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{j.descripcion}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => prepararEdicion(j)}
                    className="text-indigo-600 hover:underline text-sm font-semibold"
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
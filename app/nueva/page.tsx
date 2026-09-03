'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Juguete {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  imagenUrl?: string;
  esFavorito?: boolean;
}

const CATEGORIAS_DISPONIBLES = [
  'Deportes',
  'Figuras de Acción',
  'Juegos de Mesa',
  'Educativos y Didácticos',
  'Muñecas y Accesorios',
  'Vehículos y Pistas',
  'Electrónicos y Videojuegos',
  'Puzzles y Rompecabezas',
  'Construcción y Bloques',
  'Peluches'
];

export default function PanelJuguetesPage() {
  const router = useRouter();
  const [juguetes, setJuguetes] = useState<Juguete[]>([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [errorCategoria, setErrorCategoria] = useState('');
  
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

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCategoria('');

    if (!nombre) return;

    // VALIDACIÓN ESTRICTA DE CATEGORÍA
    if (!CATEGORIAS_DISPONIBLES.includes(categoria)) {
      setErrorCategoria('Debes seleccionar una categoría válida de la lista.');
      return;
    }

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
    setErrorCategoria('');
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre('');
    setCategoria('');
    setDescripcion('');
    setImagenUrl('');
    setErrorCategoria('');
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

  const juguetesFiltradosYOrdenados = juguetes
    .filter((j) => {
      const coincideBusqueda = 
        j.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        j.categoria.toLowerCase().includes(busqueda.toLowerCase());

      if (filtroCategoria === 'FAVORITOS') {
        return coincideBusqueda && j.esFavorito;
      }
      if (filtroCategoria !== 'TODAS') {
        return coincideBusqueda && j.categoria === filtroCategoria;
      }

      return coincideBusqueda;
    })
    .sort((a, b) => Number(b.esFavorito || 0) - Number(a.esFavorito || 0));

  return (
    <main className="p-8 max-w-xl mx-auto space-y-8 min-h-screen bg-slate-900 text-white">
      {/* CABECERA */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Panel de Inventario</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (mostrarFormulario) {
                limpiarFormulario();
              } else {
                setMostrarFormulario(true);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 active:scale-95 transition-all shadow-sm flex items-center gap-2 text-sm"
          >
            {mostrarFormulario ? '✕ Cerrar' : '➕ Agregar Juguete'}
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 active:scale-95 transition-all shadow-sm text-sm"
          >
            Cerrar sesión
          </button>
        </div>
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
            className="p-6 border border-slate-700 rounded-xl bg-slate-800 space-y-4 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white">
              {idEditando !== null ? '✏️ Editar Juguete' : '➕ Agregar Nuevo Juguete'}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2.5 bg-white text-gray-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium transition-all"
                placeholder="Ej: Balón de Fútbol"
                required
              />
            </div>

            {/* SELECCIÓN STRICTA DE CATEGORÍA */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Categoría:</label>
              <select
                value={categoria}
                onChange={(e) => {
                  setCategoria(e.target.value);
                  setErrorCategoria('');
                }}
                className="w-full p-2.5 bg-white text-gray-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium transition-all cursor-pointer"
                required
              >
                <option value="" disabled>
                  -- Selecciona una categoría --
                </option>
                {CATEGORIAS_DISPONIBLES.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errorCategoria && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errorCategoria}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Descripción:</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-2.5 bg-white text-gray-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium transition-all"
                placeholder="Ej: Balón oficial de cuero sintético número 5..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Imagen del Juguete:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 bg-white text-gray-900 border border-slate-300 rounded-lg focus:outline-none text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {imagenUrl && (
                <div className="mt-2 flex items-center gap-3 bg-slate-700/50 p-2 rounded-lg border border-slate-600">
                  <img src={imagenUrl} alt="Vista previa" className="w-12 h-12 object-cover rounded-md" />
                  <span className="text-xs text-slate-300">Vista previa de la imagen cargada</span>
                  <button
                    type="button"
                    onClick={() => setImagenUrl('')}
                    className="ml-auto text-xs text-red-400 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-sm"
              >
                {idEditando !== null ? 'Guardar Cambios' : 'Agregar a la Lista'}
              </button>

              <button
                type="button"
                onClick={limpiarFormulario}
                className="py-2.5 px-4 bg-slate-700 text-slate-200 rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECCIÓN LISTA CON CONTADOR, BUSCADOR Y FILTROS */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Lista de Juguetes
            <span className="text-sm font-semibold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
              {juguetesFiltradosYOrdenados.length}
            </span>
          </h2>
        </div>

        {/* BUSCADOR Y FILTRO DE CATEGORÍA */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔍 Buscar por nombre..."
              className="w-full pl-4 pr-10 py-2.5 bg-white text-gray-900 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="py-2.5 px-3 bg-white text-gray-900 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all cursor-pointer"
          >
            <option value="TODAS">📁 Todas las categorías</option>
            <option value="FAVORITOS">⭐ Solo Favoritos</option>
            {CATEGORIAS_DISPONIBLES.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {cargando ? (
          <p className="text-slate-400">Cargando inventario...</p>
        ) : juguetesFiltradosYOrdenados.length === 0 ? (
          <p className="text-slate-400 text-sm italic py-4">
            {busqueda || filtroCategoria !== 'TODAS'
              ? 'No se encontraron resultados para los filtros aplicados.'
              : 'No hay juguetes registrados.'}
          </p>
        ) : (
          <div className="space-y-4">
            {juguetesFiltradosYOrdenados.map((j) => (
              <div 
                key={j.id} 
                className={`p-4 border rounded-xl bg-white text-gray-900 shadow-md flex gap-4 items-start transition-all ${
                  j.esFavorito ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
                }`}
              >
                {j.imagenUrl && (
                  <img
                    src={j.imagenUrl}
                    alt={j.nombre}
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg text-gray-900">{j.nombre}</p>
                    <button
                      type="button"
                      onClick={() => toggleFavoritoFrontend(j.id)}
                      className="text-xl hover:scale-125 transition-transform"
                      title={j.esFavorito ? 'Quitar de favoritos' : 'Marcar como favorito'}
                    >
                      {j.esFavorito ? '⭐' : '☆'}
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    {j.categoria}
                  </p>
                  {j.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{j.descripcion}</p>
                  )}
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
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditarJuguete({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // 1. Cargar datos actuales del registro mediante GET
  useEffect(() => {
    async function obtenerJuguete() {
      try {
        const res = await fetch(`/api/juguetes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNombre(data.nombre || '');
          setCategoria(data.categoria || '');
        } else {
          setMensaje('No se pudo cargar el juguete');
        }
      } catch (error) {
        setMensaje('Error de conexión');
      } finally {
        setLoading(false);
      }
    }

    obtenerJuguete();
  }, [id]);

  // 2. Enviar los cambios actualizados mediante PUT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('Guardando cambios...');

    try {
      const res = await fetch(`/api/juguetes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, categoria }),
      });

      if (res.ok) {
        // Redirigir a la lista al ser exitoso
        router.push('/lista');
      } else {
        setMensaje('Error al actualizar');
      }
    } catch (error) {
      setMensaje('Error al enviar los datos');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>Cargando datos del juguete...</div>;
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Editar Juguete</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Categoría:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Guardar Cambios
        </button>
      </form>

      {mensaje && <p style={{ marginTop: '15px', color: '#666' }}>{mensaje}</p>}

      <div style={{ marginTop: '20px' }}>
        <Link href="/lista" style={{ color: '#0070f3', textDecoration: 'none' }}>
          Cancelar y volver
        </Link>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NuevoJuguete() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');

  const guardarJuguete = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !categoria) {
      alert('Por favor llena todos los campos');
      return;
    }

    // 1. Obtener los juguetes que ya existen guardados
    const guardados = JSON.parse(localStorage.getItem('mis_juguetes') || '[]');

    // 2. Crear el nuevo juguete
    const nuevo = {
      id: Date.now(),
      nombre: nombre,
      categoria: categoria,
    };

    // 3. Guardar la nueva lista en localStorage
    const nuevaLista = [...guardados, nuevo];
    localStorage.setItem('mis_juguetes', JSON.stringify(nuevaLista));

    // 4. Mostrar mensaje y limpiar campos
    setMensaje('¡Juguete guardado con éxito! 🎉');
    setNombre('');
    setCategoria('');

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Agregar Nuevo Juguete</h1>

      {mensaje && (
        <div style={{ padding: '12px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          {mensaje}
        </div>
      )}

      <form onSubmit={guardarJuguete} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del Juguete:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Balón de fútbol"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Categoría:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ej. Deportes"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Guardar Juguete
        </button>
      </form>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Volver al inicio
        </Link>
        <Link href="/lista" style={{ color: '#2e7d32', textDecoration: 'none', fontWeight: 'bold' }}>
          Ver Lista de Juguetes →
        </Link>
      </div>
    </main>
  );
}
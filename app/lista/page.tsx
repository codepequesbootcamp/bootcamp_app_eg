'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Juguete {
  id: number;
  nombre: string;
  categoria: string;
}

export default function ListaJuguetes() {
  const [juguetes, setJuguetes] = useState<Juguete[]>([]);

  useEffect(() => {
    // Cargar los juguetes guardados en el navegador
    const guardados = JSON.parse(localStorage.getItem('mis_juguetes') || '[]');
    setJuguetes(guardados);
  }, []);

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Lista de Juguetes</h1>

      {juguetes.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '30px' }}>
          Aún no has agregado ningún juguete. ¡Ve al formulario para crear el primero!
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
          {juguetes.map((juguete) => (
            <li key={juguete.id} style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
              <strong>{juguete.nombre}</strong> — <span style={{ color: '#666' }}>{juguete.categoria}</span>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Volver al inicio
        </Link>
        <Link href="/nueva" style={{ color: '#2e7d32', textDecoration: 'none' }}>
          + Agregar otro juguete
        </Link>
      </div>
    </main>
  );
}
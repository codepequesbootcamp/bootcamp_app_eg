import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Tienda de Juguetes</h1>
      <p style={{ marginBottom: '30px', color: '#555' }}>
        Bienvenido al sistema de gestión de juguetes.
      </p>
      
      <nav style={{ display: 'flex', gap: '15px' }}>
        <Link 
          href="/lista" 
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', borderRadius: '5px', textDecoration: 'none' }}
        >
          Ver Lista de Juguetes
        </Link>
        <Link 
          href="/nueva" 
          style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white', borderRadius: '5px', textDecoration: 'none' }}
        >
          Agregar Nuevo Juguete
        </Link>
      </nav>
    </main>
  );
}

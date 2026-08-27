'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
const router = useRouter();

const handleLogout = async () => {
const res = await fetch('/api/auth/logout', {
method: 'POST',
});

if (res.ok) {
router.push('/login');
}
};

return (
<div style={{ padding: '20px' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<h1>Panel Principal</h1>
<button 
onClick={handleLogout}
style={{ padding: '8px 16px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
>
Cerrar sesión
</button>
</div>
{/* Resto de tu contenido */}
</div>
);
}
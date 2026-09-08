'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
  enabled: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario actual y lista de usuarios
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Obtener usuario en sesión
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData);
        }

        // 2. Obtener lista de usuarios
        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error inicializando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleUpdate = async (id: number, data: Partial<User>) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchUsers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchUsers();
  };

  const isCurrentSuperAdmin = currentUser?.role?.toLowerCase() === 'super_admin';

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-6 min-h-screen bg-slate-900 text-slate-100">
      <h1 className="text-3xl font-extrabold tracking-tight text-sky-400">
        Gestión de Usuarios
      </h1>

      {loading ? (
        <p className="text-slate-400">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto border border-sky-900/50 rounded-xl bg-slate-900 shadow-2xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-sky-900/80 bg-slate-950/80 text-sky-300 font-semibold uppercase text-xs tracking-wider">
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-950">
              {users.map((u) => {
                const targetIsSuperAdmin = u.role.toLowerCase() === 'super_admin';
                
                // Solo un super_admin puede cambiar roles
                const canEditRole = isCurrentSuperAdmin && !targetIsSuperAdmin;
                
                // Un admin o super_admin no puede desactivar/eliminar a un super_admin
                const canModifyUser = isCurrentSuperAdmin || (!targetIsSuperAdmin && currentUser?.role === 'admin');

                return (
                  <tr key={u.id} className="hover:bg-sky-950/40 transition-colors">
                    {/* EMAIL */}
                    <td className="p-4 font-medium text-sky-200">{u.email}</td>

                    {/* ROL */}
                    <td className="p-4">
                      <select
                        value={u.role}
                        disabled={!canEditRole}
                        onChange={(e) =>
                          handleUpdate(u.id, { role: e.target.value })
                        }
                        className={`py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none transition-all ${
                          !canEditRole
                            ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                            : 'bg-sky-950 text-sky-100 border-sky-800 focus:ring-2 focus:ring-sky-500 cursor-pointer'
                        }`}
                      >
                        <option value="client">client</option>
                        <option value="admin">admin</option>
                        <option value="super_admin">super_admin</option>
                      </select>
                    </td>

                    {/* ESTADO */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                          u.enabled
                            ? 'bg-lime-400 text-slate-950 shadow-lime-500/20'
                            : 'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}
                      >
                        {u.enabled ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() =>
                          handleUpdate(u.id, { enabled: !u.enabled })
                        }
                        disabled={!canModifyUser}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          !canModifyUser
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : u.enabled
                            ? 'bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-800 active:scale-95'
                            : 'bg-lime-400 hover:bg-lime-300 text-slate-950 active:scale-95'
                        }`}
                      >
                        {u.enabled ? 'Desactivar' : 'Activar'}
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={!canModifyUser}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          !canModifyUser
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-red-600/80 hover:bg-red-500 text-white active:scale-95'
                        }`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
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

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async (id: number, data: Partial<User>) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchUsers();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchUsers();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Rol</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleUpdate(u.id, { role: e.target.value })}
                    className="border rounded px-2 py-1 text-sm bg-white"
                  >
                    <option value="client">client</option>
                    <option value="admin">admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      u.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {u.enabled ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleUpdate(u.id, { enabled: !u.enabled })}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    {u.enabled ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
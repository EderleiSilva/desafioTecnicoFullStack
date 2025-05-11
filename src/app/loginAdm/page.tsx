'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    cep: string;
    estado: string;
    localidade: string;
    role: string;
}

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newUserName, setNewUserName] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('admToken');
            
            if (!token) {
                setError('Não autorizado.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setUsers(data.users || []);
                    setError(null);
                } else if (response.status === 401 || response.status === 403) {
                    setError('Não autorizado a acessar esta página.');
                    router.push('/login');
                } else {
                    setError('Erro ao buscar usuários.');
                }
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                setError('Erro ao buscar usuários.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setNewUserName(user.name);
        setIsEditing(true);
    };

    const handleCloseEditModal = () => {
        setIsEditing(false);
        setEditingUser(null);
        setNewUserName('');
    };

    const handleNewUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUserName(event.target.value);
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        const token = localStorage.getItem('admToken');

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: editingUser.id, name: newUserName }),
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === editingUser.id ? { ...user, name: newUserName } : user
                    )
                );
                handleCloseEditModal();
            } else {
                setError(data?.message || 'Erro ao salvar as alterações.');
            }
        } catch (error) {
            console.error('Erro ao salvar as alterações:', error);
            setError('Erro ao salvar as alterações.');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const token = localStorage.getItem('admToken');
        if (!token) {
            setError('Não autorizado.');
            return;
        }

        try {
            const response = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: userId }),
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                
            } else {
                setError(data?.message || 'Erro ao excluir o usuário.');
            }
        } catch (error) {
            console.error('Erro ao excluir o usuário:', error);
            setError('Erro ao excluir o usuário.');
        }
    };

    if (isLoading) {
        return <div>Carregando lista de usuários...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold text-whith-800 mb-6">Lista de Usuários Cadastrados</h1>
            {users.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">ID</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Nome</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Email</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">CEP</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Estado</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Cidade</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Role</th>
                                <th className="py-3 px-6 text-left font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b">
                                    <td className="py-4 px-6 text-gray-700">{user.id}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.name}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.email}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.cep}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.estado}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.localidade}</td>
                                    <td className="py-4 px-6 text-gray-700">{user.role}</td>
                                    <td className="py-4 px-6">
                                        <button
                                            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
                                            onClick={() => handleOpenEditModal(user)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={() => {
                            localStorage.removeItem('admToken');
                            router.push('/login');
                        }}
                        className="cursor-pointer mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sair
                    </button>
                </div>
            ) : (
                <p>Nenhum usuário cadastrado.</p>
            )}

            {isEditing && editingUser && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Editar nome do usuário</h2>
                        <p className="mb-2 text-gray-700">ID: {editingUser.id}</p>
                        <div className="mb-4">
                            <label htmlFor="newUserName" className="block text-gray-700 text-sm font-bold mb-2">
                                Novo Nome:
                            </label>
                            <input
                                type="text"
                                id="newUserName"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newUserName}
                                onChange={handleNewUserNameChange}
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleSaveEdit}
                            >
                                Salvar
                            </button>
                            <button
                                className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                onClick={handleCloseEditModal}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
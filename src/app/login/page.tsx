'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.role === 'admin') {
            localStorage.setItem('admToken', data.token);
            router.push('/loginAdm');
        } else if (response.ok && data.role === 'user') {
            localStorage.setItem('authToken', data.token);
            router.push('/welcome');
        } else {
            setError(data.message || 'Erro ao fazer login.');
            console.error('Erro ao fazer login:', data);
        }
    } catch (error) {
        setError('Ocorreu um erro ao tentar fazer login.');
        console.error('Erro ao fazer login:', error);
    }
};

    return (
        <div className="p-20 h-screen flex justify-center items-center">
            <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="block text-gray-700 text-xl font-bold mb-4">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Senha:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Entrar
                        </button>

                        <a className="cursor-pointer inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/">
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
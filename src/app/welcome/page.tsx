'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const WelcomePage = () => {
    const [userData, setUserData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken'); 

            if (token) {
                
                try {
                    const response = await fetch('/api/auth/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json(); 

                    if (response.ok) {
                        setUserData(data);
                    } else {
                        localStorage.removeItem('authToken');
                        router.push('/login'); 
                    }
                } catch (error) {
                    console.error('Erro ao verificar autenticação:', error);
                    localStorage.removeItem('authToken');
                    router.push('/login');
                } finally {
                    setIsLoading(false);
                }
            } else {
                router.push('/login');
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (!userData) {
        return <div>Usuário não encontrado.</div>;
    }

    return (
        <div className="p-20 h-screen flex justify-center items-center">
            <div className="bg-white shadow-md rounded px-16 py-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Bem-vindo(a), {userData?.name}!
                </h1>
                <p className="text-gray-700 mb-4">
                    Você acessou sua área de usuário padrão. Aqui você pode encontrar informações relevantes
                    e realizar ações específicas para sua conta.
                </p>
                
                <div className="mt-8">
                    
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações do Usuário:</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Email: {userData?.email}</li>
                        <li>CEP: {userData?.cep}</li>
                        <li>Localidade: {userData?.localidade}</li>
                        <li>Estado: {userData?.estado}</li>
                    </ul>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('authToken');
                        router.push('/login');
                    }}
                    className="cursor-pointer mt-8 bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sair
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
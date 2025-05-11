'use client'

import { useState, FormEvent } from "react"

interface ErrorForm {
    name?: string;
    email?: string;
    password?: string;
    cep?: string;
}

interface Address {
    localidade: string;
    estado: string;
    erro?: boolean;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    cep: string;
    localidade: string;
    estado: string;
}

export default function Form() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [cep, setCep] = useState<string>('');

    const [localidade, setLocalidade] = useState<string>('');
    const [estado, setEstado] = useState<string>('');

    const [error, setError] = useState({});
    const [mensageSucess, setMensageSucess] = useState<string>('');
    const [mensageError, setMensageError] = useState<string>('');

    const [address, setAddress] = useState<Address>({
        localidade: '',
        estado: '',
    });

    const cleanFormCep = () => {
        setAddress({
            localidade: '',
            estado: '',
        });
    };

    const newError: ErrorForm = {};

    const searshCep = async () => {

        if (cep.length === 8) {
            setAddress({
                localidade: '...',
                estado: '...',
            });

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data: Address = await response.json();

                if (!data.erro) {
                    setAddress(data);
                } else {
                    cleanFormCep();
                    newError.cep = "CEP não encontrado."
                    alert('CEP não encontrado.');
                }
            } catch (error) {
                cleanFormCep();
                newError.cep = "Erro ao buscar CEP."
                alert('Erro ao buscar CEP.');
            }
        } else if (cep.length > 0) {
            cleanFormCep();
            newError.cep = "Formato de CEP inválido."
            alert('Formato de CEP inválido.');
        } else {
            cleanFormCep();
        }
    };

    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCep(event.target.value.replace(/\D/g, ''));
    };

    const calidateForm = (): boolean => {

        if (!name.trim()) {
            newError.name = 'O nome é obrigatório.';
        }

        if (!email.trim()) {
            newError.email = 'O email é obrigatório.';
        }

        if (!password.trim()) {
            newError.password = 'A senha é obrigatória.';
        } else if (password.length < 6) {
            newError.password = 'A senha deve conter pelo menos 6 caracteres.'
        } else if (!/[A-Z]/.test(password)) {
            newError.password = 'A senha deve conter pelo menos uma letra maiuscula.'
        } else if (!/[0-9]/.test(password)) {
            newError.password = 'A senha deve conter pelo menos um número'
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setMensageSucess('');
        setMensageError('');

        if (calidateForm()) {
            const formData: FormData = { name, email, password, cep, estado: address.estado, localidade: address.localidade };

            try {
                const response = await fetch("/api/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setMensageSucess('Formulário enviado com sucesso!');
                    setName('');
                    setEmail('');
                    setPassword('');
                    setCep('');
                    setEstado('');
                    setLocalidade('');
                    setError({});
                } else {
                    setMensageError('Ocorreu um erro ao enviar o formulário.');
                }
            } catch (error) {
                console.error('Ocorreu um erro: ', error);
                setMensageError('Ocorreu um erro inesperado.');
            }
        } else {
            setMensageError('Por favor, corrija os erros no formulário.');
        }
    };

    return (
        <div className="p-20 h-screen flex justify-center items-center">
            <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mensageSucess && <p className="text-green-500 text-xs italic">{mensageSucess}</p>}
                    {mensageError && <p className="text-red-500 text-xs italic">{mensageError}</p>}

                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome*:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}

                        />
                        {error.name && <p className="text-red-500 text-xs italic">{error.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email*:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                        />
                        {error.email && <p className="text-red-500 text-xs italic">{error.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha*:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />
                        {error.password && <p className="text-red-500 text-xs italic">{error.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="cep" className="block text-gray-700 text-sm font-bold mb-2">CEP:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="cep"
                            value={cep}
                            onChange={handleCepChange}
                            onBlur={searshCep}
                            maxLength={9}
                        />
                    </div>

                    <div>
                        <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="state"
                            value={address.estado}
                            onChange={(e) => setEstado(e.target.value)}
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">Cidade:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="city"
                            value={address.localidade}
                            onChange={(e) => setLocalidade(e.target.value)}
                            readOnly
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 
                            hover:bg-blue-700 
                            text-white 
                            font-bold 
                            py-2 
                            px-4 
                            rounded 
                            cursor-pointer">Enviar</button>
                        <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/">
                            Cancelar
                        </a>
                    </div>

                </form>
            </div>
        </div>
    )
}
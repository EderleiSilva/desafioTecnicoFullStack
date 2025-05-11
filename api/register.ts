import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

interface FormData {
    name: string;
    email: string;
    password: string;
    cep: string;
    localidade: string;
    estado: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const formData: FormData = req.body;

            console.log('Tentando conectar ao banco de dados...');
            const db = await open({
                filename: path.join(process.cwd(), 'database', 'mydb.sqlite'),
                driver: sqlite3.Database
            });

            console.log('Banco de dados conectado com sucesso!');
            console.log('Tentando criar a tabela...');
            await db.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    cep TEXT,
                    localidade TEXT,
                    estado TEXT
                )
            `);
            console.log('Tabela criada (ou já existia).');

            // Insira os dados na tabela
            const statement = await db.prepare(`
                INSERT INTO users (name, email, password, cep, localidade, estado)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            await statement.bind(
                formData.name,
                formData.email,
                formData.password,
                formData.cep,
                formData.localidade,
                formData.estado
            );

            const result = await statement.run();
            await statement.finalize();
            await db.close();

            res.status(200).json({ message: 'Usuário registrado com sucesso!' });

        } catch (error: any) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({ error: error.message || 'Erro ao registrar usuário.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
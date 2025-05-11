import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

interface FormData {
    name: string;
    email: string;
    password: string;
    cep: string;
    localidade: string;
    estado: string;
}

export async function POST(request: NextRequest) {
    try {
        const formData: FormData = await request.json();

        const db = await open({
            filename: path.join(process.cwd(), 'database', 'mydb.sqlite'), // Ajuste o caminho se necessário
            driver: sqlite3.Database
        });

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

        return NextResponse.json({ message: 'Usuário registrado com sucesso!' }, { status: 200 });

    } catch (error: any) {
        console.error('Erro ao registrar usuário:', error);
        return NextResponse.json({ error: error.message || 'Erro ao registrar usuário.' }, { status: 500 });
    }
}
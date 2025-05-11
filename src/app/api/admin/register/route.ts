import { NextResponse, NextRequest } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

interface FormData {
    name: string;
    email: string;
    password: string;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, adminPassword } = await request.json();

        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
        }

        const db = await open({
            filename: path.join(process.cwd(), 'database', 'mydb.sqlite'),
            driver: sqlite3.Database
        });

        const statement = await db.prepare(`
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `);
        
        await statement.bind([name, email, password, 'admin']);
        const result = await statement.run();
        await statement.finalize();
        await db.close();

        return NextResponse.json({ message: 'Usuário administrador registrado com sucesso!' }, { status: 201 });

    } catch (error: any) {
        console.error('Erro ao registrar administrador:', error);
        return NextResponse.json({ error: error.message || 'Erro ao registrar administrador.' }, { status: 500 });
    }
}
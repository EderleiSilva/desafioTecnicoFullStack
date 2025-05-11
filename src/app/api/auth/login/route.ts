import { NextResponse, NextRequest } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    try {
        const db = await open({
            filename: path.join(process.cwd(), 'database', 'mydb.sqlite'),
            driver: sqlite3.Database
        });

        const user = await db.get('SELECT id, password, role FROM users WHERE email = ?', [email]);

        if (!user || user.password !== password) {
            await db.close();
            return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
        }

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET não definido no ambiente.');
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        await db.run('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        await db.close();

        return NextResponse.json({ token, role: user.role }, { status: 200 });

    } catch (error: any) {
        console.error('Erro ao fazer login:', error);
        return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 });
    }
}
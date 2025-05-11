import { NextResponse, NextRequest } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: number };
        const userId = decoded.userId;

        const db = await open({
            filename: path.join(process.cwd(), 'database', 'mydb.sqlite'),
            driver: sqlite3.Database
        });

        const statement = await db.prepare(`
            SELECT id, name, email, cep, localidade, estado, role
            FROM users
            WHERE id = ?
        `);

        const user = await statement.get(userId);
        await statement.finalize();
        await db.close();

        if (user) {
            return NextResponse.json(user, { status: 200 });
        } else if (!JWT_SECRET){
            return NextResponse.json({ message: 'JWT_SECRET não configurado.' }, { status: 500 });
        } else{
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
        }

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({ message: 'Token expirado.' }, { status: 401 });
        }
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: 'Token inválido.' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Erro na autenticação.' }, { status: 500 });
    }
}
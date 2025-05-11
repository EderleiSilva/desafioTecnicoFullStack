import { NextResponse, NextRequest } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

async function connectDatabase() {
    return open({
        filename: path.join(process.cwd(), 'database', 'mydb.sqlite'),
        driver: sqlite3.Database
    });
}

async function verifyAdmin(token: string) {
    if (!JWT_SECRET) {
        console.error('JWT_SECRET não está definido nas variáveis de ambiente');
        return false;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: number, role: string };
        return decoded.role === 'admin';
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return false;
    }
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: number, role: string };
        const role = decoded.role;

        if (role !== 'admin') {
            return NextResponse.json({ message: 'Acesso negado. Você não tem permissão para acessar esta rota.' }, { status: 403 });
        }

        if (!JWT_SECRET) {
            console.error('JWT_SECRET não está definido nas variáveis de ambiente');
            return NextResponse.json({ message: 'Erro interno de configuração.' }, { status: 500 });
        }

        const db = await open({
            filename: path.join(process.cwd(), 'database', 'mydb.sqlite'),
            driver: sqlite3.Database
        });

        const statement = await db.prepare(`
            SELECT id, name, email, cep, localidade, estado, role
            FROM users
        `);
        const users = await statement.all();
        await statement.finalize();
        await db.close();

        return NextResponse.json({ users }, { status: 200 });

    } catch (error: any) {
        console.error('Erro ao verificar token ou buscar usuários:', error);
        return NextResponse.json({ message: 'Não autenticado ou erro no servidor.' }, { status: 401 });
    }
}

export async function PUT(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!await verifyAdmin(token)) {
        return NextResponse.json({ message: 'Acesso negado. Você não tem permissão para editar usuários.' }, { status: 403 });
    }

    try {
        const { id, name } = await request.json();

        if (!id || !name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ message: 'ID e novo nome são obrigatórios.' }, { status: 400 });
        }

        const db = await connectDatabase();
        const result = await db.run(
            'UPDATE users SET name = ? WHERE id = ?',
            [name.trim(), id]
        );
        await db.close();

        if (result.changes > 0) {
            return NextResponse.json({ message: 'Nome do usuário atualizado com sucesso.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Usuário não encontrado ou nome já é o mesmo.' }, { status: 404 });
        }

    } catch (error: any) {
        console.error('Erro ao atualizar nome do usuário:', error);
        return NextResponse.json({ message: 'Erro ao atualizar nome do usuário.' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!await verifyAdmin(token)) {
        return NextResponse.json({ message: 'Acesso negado. Você não tem permissão para excluir usuários.' }, { status: 403 });
    }

    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ message: 'O ID do usuário a ser excluído é obrigatório.' }, { status: 400 });
        }

        const db = await connectDatabase();
        const result = await db.run(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        await db.close();

        if (result.changes > 0) {
            return NextResponse.json({ message: 'Usuário excluído com sucesso.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
        }

    } catch (error: any) {
        console.error('Erro ao excluir usuário:', error);
        return NextResponse.json({ message: 'Erro ao excluir usuário.' }, { status: 500 });
    }
}
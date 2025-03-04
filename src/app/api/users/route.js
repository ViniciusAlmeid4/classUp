import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Lista de usuários' });
}

export async function POST(req) {
  return NextResponse.json({ message: 'Usuário criado' }, { status: 201 });
}

export async function PUT(req) {
  return NextResponse.json({ message: 'Usuário atualizado' });
}

export async function DELETE(req) {
  return NextResponse.json({ message: 'Usuário deletado' });
}
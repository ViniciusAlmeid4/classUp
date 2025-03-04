import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Lista de atividades' });
}

export async function POST(req) {
  return NextResponse.json({ message: 'Atividade criada' }, { status: 201 });
}

export async function PUT(req) {
  return NextResponse.json({ message: 'Atividade atualizada' });
}

export async function DELETE(req) {
  return NextResponse.json({ message: 'Atividade deletada' });
}
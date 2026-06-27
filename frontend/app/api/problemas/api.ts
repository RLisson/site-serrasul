import { verifyToken } from "@/app/lib/auth";
import { getDb } from "@/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();
    const problemasRef = db.collection("problemas");
    const snapshot = await problemasRef.get();
    const problemas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: problemas }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";

    if (message.includes("5 NOT_FOUND")) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    verifyToken(request);
    const db = getDb();
    const { titulo, descricao, status, inicioEm, fimEstimado } = await request.json();
    if (!titulo || !descricao || !status || !inicioEm || !fimEstimado) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }
    const novoProblema = {
      titulo,
      descricao,
      status,
      inicioEm,
      fimEstimado,
      criadoEm: new Date().toISOString(),
    };

    const docRef = await db.collection("problemas").add(novoProblema);
    const problemaCriado = { id: docRef.id, ...novoProblema };
    return NextResponse.json({ success: true, data: problemaCriado }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    verifyToken(request);
    const db = getDb();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID do problema é obrigatório" }, { status: 400 });
    }
    await db.collection("problemas").doc(id).delete();
    return NextResponse.json({ success: true, message: "Problema deletado com sucesso" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    verifyToken(request);
    const db = getDb();
    const { id, titulo, descricao, status, inicioEm, fimEstimado } = await request.json();
    if (!id || !titulo || !descricao || !status || !inicioEm || !fimEstimado) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }
    const problemaAtualizado = {
      titulo,
      descricao,
      status,
      inicioEm,
      fimEstimado,
      atualizadoEm: new Date().toISOString(),
    };

    await db.collection("problemas").doc(id).update(problemaAtualizado);
    const problemaAtualizadoComId = { id, ...problemaAtualizado };
    return NextResponse.json({ success: true, data: problemaAtualizadoComId }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
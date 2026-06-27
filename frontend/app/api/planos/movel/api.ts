import { db } from "../../../lib/firebaseAdmin";
import { verifyToken } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await verifyToken(request);
    const planosRef = db.collection("planos").where("categoria", "==", "movel");
    const snapshot = await planosRef.get();
    const planos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: planos }, { status: 200 });
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
    await verifyToken(request);
    const { nome, preco, descricao, beneficios } =
      await request.json();
    if (!nome || !preco || !descricao || !beneficios) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }
    const novoPlano = {
      nome,
      preco,
      descricao,
      beneficios,
      categoria: "movel",
      criadoEm: new Date().toISOString(),
    };

    const docRef = await db.collection("planos").add(novoPlano);
    const planoCriado = { id: docRef.id, ...novoPlano };
    return NextResponse.json({ success: true, data: planoCriado }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await verifyToken(request);
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID do plano é obrigatório" }, { status: 400 });
    }
    await db.collection("planos").doc(id).delete();
    return NextResponse.json({ success: true, message: "Plano deletado com sucesso" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await verifyToken(request);
    const { id, nome, preco, descricao, beneficios } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID do plano é obrigatório" }, { status: 400 });
    }
    const updateData: { nome?: string; preco?: number; descricao?: string; beneficios?: string[] } = {};
    if (nome) updateData.nome = nome;
    if (preco) updateData.preco = preco;
    if (descricao) updateData.descricao = descricao;
    if (beneficios) updateData.beneficios = beneficios;

    await db.collection("planos").doc(id).update(updateData);
    return NextResponse.json({ success: true, message: "Plano atualizado com sucesso" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
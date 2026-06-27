import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { verifyToken } from "../../../lib/auth";

type updateData = {
  nome?: string;
  velocidade?: string;
  preco?: number;
  descricao?: string;
  highlight?: boolean;
  beneficios?: string[];
}

export async function GET(request: Request) {
  try {
    await verifyToken(request);
    const planosRef = db.collection("planos").where("categoria", "==", "internet");
    const snapshot = await planosRef.get();
    const planos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ success: true, data: planos }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar planos";

    if (message.includes("5 NOT_FOUND")) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await verifyToken(request);
    const { nome, velocidade, preco, descricao, highlight, beneficios } =
      await request.json();
    if (
      !nome ||
      !velocidade ||
      preco === undefined ||
      preco === null ||
      !descricao ||
      !Array.isArray(beneficios)
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }
    const novoPlano = {
      nome,
      velocidade,
      preco,
      descricao,
      highlight,
      beneficios,
      categoria: "internet",
      criadoEm: new Date().toISOString(),
    };

    if (highlight) {
      const planosRef = db
        .collection("planos")
        .where("categoria", "==", "internet")
        .where("highlight", "==", true);
      const snapshot = await planosRef.get();
      const planosDestacados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (planosDestacados.length > 0) {
        return NextResponse.json(
          { error: "Já existe um plano destacado para internet" },
          { status: 400 },
        );
      }
    }

    const docRef = await db.collection("planos").add(novoPlano);
    const planoCriado = { id: docRef.id, ...novoPlano };
    return NextResponse.json(
      { success: true, data: planoCriado },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar plano";

    if (message.includes("5 NOT_FOUND")) {
      return NextResponse.json(
        {
          error:
            "Firestore não encontrado ou não habilitado para este projeto. Verifique se o banco foi criado e se o projectId do Admin SDK está correto.",
        },
        { status: 500 },
      );
    }

    if (message.includes("Token de autenticação")) {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
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
    const { id, nome, velocidade, preco, descricao, highlight, beneficios } =
      await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID do plano é obrigatório" }, { status: 400 });
    }
    const updateData: updateData = {};
    if (nome) updateData.nome = nome;
    if (velocidade) updateData.velocidade = velocidade;
    if (preco) updateData.preco = preco;
    if (descricao) updateData.descricao = descricao;
    if (highlight !== undefined) {
      if (highlight) {
        const planosRef = db
          .collection("planos")
          .where("categoria", "==", "internet")
          .where("highlight", "==", true);
        const snapshot = await planosRef.get();
        const planosDestacados = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (planosDestacados.length > 0 && planosDestacados[0].id !== id) {
          return NextResponse.json(
            { error: "Já existe um plano destacado para internet" },
            { status: 400 },
          );
        }
      }
      updateData.highlight = highlight;
    }
    if (beneficios) updateData.beneficios = beneficios;

    await db.collection("planos").doc(id).update(updateData);
    const planoAtualizadoDoc = await db.collection("planos").doc(id).get();
    const planoAtualizado = { id: planoAtualizadoDoc.id, ...planoAtualizadoDoc.data() };

    return NextResponse.json(
      { success: true, data: planoAtualizado },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

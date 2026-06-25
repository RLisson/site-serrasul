import { NextResponse } from "next/server";
import { auth, db } from "../../lib/firebaseAdmin";
import { verifyToken } from "../../lib/auth";

export async function GET(request: Request) {
  try {
    await verifyToken(request);
    const users = await auth.listUsers();
    return NextResponse.json(users.users);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: Request){
  try {
    await verifyToken(request);
    const { nome, email, password } = await request.json();
    if (!nome || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha deve conter pelo menos 8 caracteres" }, { status: 400 });
    }

    const userRecord = await auth.createUser({ displayName: nome, email, password });
    const dadosUsuario = {
      nome: userRecord.displayName,
      email: userRecord.email,
      ativo: userRecord.disabled === false,
      criadoEm: userRecord.metadata.creationTime,
      ultimoLogin: userRecord.metadata.lastSignInTime,
    }

    await db.collection("usuarios").doc(userRecord.uid).set(dadosUsuario);

    return NextResponse.json(
      {
        success: true,
        message: "Usuário criado com sucesso",
        data: {
          uid: userRecord.uid,
          ...dadosUsuario,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "auth/email-already-exists") {
      return NextResponse.json({ error: "O email já está em uso" }, { status: 400 });
    }

    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await verifyToken(request);
    const { uid } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "UID do usuário é obrigatório" }, { status: 400 });
    }

    await auth.deleteUser(uid);
    await db.collection("usuarios").doc(uid).delete();

    return NextResponse.json({ success: true, message: "Usuário deletado com sucesso" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await verifyToken(request);
    const { uid, nome, email, ativo } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "UID do usuário é obrigatório" }, { status: 400 });
    }

    const updateData: { displayName?: string; email?: string; disabled?: boolean } = {};
    if (nome) updateData.displayName = nome;
    if (email) updateData.email = email;
    if (ativo !== undefined) updateData.disabled = !ativo;

    await auth.updateUser(uid, updateData);

    const userRecord = await auth.getUser(uid);
    const dadosUsuario = {
      nome: userRecord.displayName,
      email: userRecord.email,
      ativo: userRecord.disabled === false,
      criadoEm: userRecord.metadata.creationTime,
      ultimoLogin: userRecord.metadata.lastSignInTime,
    }

    await db.collection("usuarios").doc(uid).update(dadosUsuario);

    return NextResponse.json(
      {
        success: true,
        message: "Usuário atualizado com sucesso",
        data: {
          uid: userRecord.uid,
          ...dadosUsuario,
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
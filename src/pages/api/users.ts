import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const corsMiddleware = Cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (result?: any) => void
  ) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

async function cors(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, corsMiddleware);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    console.log("[GET] Listando usuários...");
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (err) {
      console.error("[GET] Erro ao listar usuários:", err);
      return res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }

  if (req.method === "POST") {
    const { name, email } = req.body;
    console.log("[POST] Dados recebidos:", { name, email });

    try {
      const user = await prisma.user.create({
        data: { name, email },
      });
      console.log("[POST] Usuário criado com sucesso:", user);
      return res.status(201).json(user);
    } catch (error: any) {
      console.error("[POST] Erro ao criar usuário:", error);
      return res
        .status(400)
        .json({ error: "Erro ao criar usuário", details: error?.message });
    }
  }

  console.warn("[API] Método não permitido:", req.method);
  return res.status(405).json({ message: "Método não permitido" });
}

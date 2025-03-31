import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const corsMiddleware = Cors({
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
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { name, email } = req.body;

    try {
      const user = await prisma.user.create({
        data: { name, email },
      });
      return res.status(201).json(user);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: "Erro ao criar usuário", details: error?.message });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}

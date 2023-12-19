// pages/api/rsa.ts
import { NextApiRequest, NextApiResponse } from "next";
import NodeRSA from "node-rsa";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { operation, number, key } = req.body as { operation: string; number: string; key: string };

    if (!number || !key) {
      return res.status(400).json({ error: "Number or key is missing." });
    }

    const rsaKey = new NodeRSA();
    rsaKey.importKey(key, "pkcs8-private-pem");

    let result;
    if (operation === "encrypt") {
      result = rsaKey.encrypt(number, "base64");
    } else if (operation === "decrypt") {
      result = rsaKey.decrypt(number, "utf8");
    } else {
      return res.status(400).json({ error: "Invalid operation." });
    }

    return res.status(200).json({ result });
  }

  return res.status(405).end();
}

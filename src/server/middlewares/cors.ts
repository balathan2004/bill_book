import { NextApiRequest, NextApiResponse } from "next";

const rateMap = new Map<string, { count: number; time: number }>();

export default function withCors(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // --- CORS ---
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // --- Rate limit ---
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    const record = rateMap.get(ip as string) || { count: 0, time: now };

    if (now - record.time > 10 * 60 * 1000) {
      record.count = 0;
      record.time = now;
    }

    record.count++;

    if (record.count > 50) {
      res.status(429).json({ message: "Too many requests, please try again later." });
      return;
    }

    rateMap.set(ip as string, record);

    return handler(req, res);
  };
}

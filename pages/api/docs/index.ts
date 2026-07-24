
import { NextApiResponse } from "next";
import withCors from "@/src/server/middlewares/cors";
import { InvoiceDoc, InvoiceTagItem, JwtRequest, ListRes } from "@/src/server/utils/interfaces";
import { withErrorHandler } from "@/src/server/middlewares/withErrorHandler";
import { withJwt } from "@/src/server/middlewares/jwt";
import { DocService } from "@/src/server/services/doc.services";
import { OrderByDirection } from "firebase/firestore";
import { TagService } from "@/src/server/services/tag.services";

async function handler(
  req: JwtRequest,
  res: NextApiResponse<ListRes<InvoiceDoc>>
) {

  if (req.method !== "GET") throw new Error("Bad Request")

  const user = req.user;
  const params = req.query as { sort: keyof InvoiceDoc, orderBy: OrderByDirection }

  if (!user?.uid) throw new Error("User not found");

  const data = (await DocService.getDocsQuery(user.uid, params.sort, params.orderBy) as InvoiceDoc[]).filter(item => !item.deleted)

  const tags = await TagService.getDocsQuery(user.uid) as InvoiceTagItem[]

  const populatedData = data.map((doc) => ({
    ...doc,
    tags: (doc.tags as string[] || [])
      ?.map((tagId: string) => tags.find((tag) => tag.id === tagId))
      .filter(Boolean) as InvoiceTagItem[],
  }));

  return res.json({ data: populatedData, message: "docs fetched", });


}


export default withCors(withErrorHandler(withJwt(handler)))



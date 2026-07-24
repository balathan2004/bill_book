import { NextApiRequest, NextApiResponse } from "next";
import { InvoiceDoc, JwtRequest, ResponseConfig } from "@/src/server/utils/interfaces";
import { withErrorHandler } from '@/src/server/middlewares/withErrorHandler';
import { withJwt } from '@/src/server/middlewares/jwt';
import withCors from "@/src/server/middlewares/cors";
import { bodyValidator } from "@/src/server/middlewares/bodyValidator";
import { invoiceSchema } from "@/src/server/schemas/doc.schema";
import { DocService } from "@/src/server/services/doc.services";
import { AppError } from "@/src/server/utils/appError";

async function handler(
  req: JwtRequest,
  res: NextApiResponse<ResponseConfig>
) {

  const user = req.user

  if (!user) throw new AppError("UnAuthroised")


  if (req.method === "PUT") {


    const data = bodyValidator(invoiceSchema, req)

    const response = await DocService.putDoc(data as InvoiceDoc)

    return res.json({ message: "Invoice added successfully" })

  }

  if (req.method === "DELETE") {

    const invoiceId = req.query.id as string || false

    if (!invoiceId) throw new AppError("UnAuthroised")

    const response = await DocService.deleteDoc(user.uid, invoiceId)

    return res.json({ message: "Invoice Deleted" })


  }

}


export default withCors(withErrorHandler(withJwt(handler)))
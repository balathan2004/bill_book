import withCors from "@/src/server/middlewares/cors";
import { withJwt } from "@/src/server/middlewares/jwt";
import { withErrorHandler } from "@/src/server/middlewares/withErrorHandler";
import { TagService } from "@/src/server/services/tag.services";
import { AppError } from "@/src/server/utils/appError";
import { JwtRequest, ListRes, InvoiceTagItem, ResponseConfig } from "@/src/server/utils/interfaces";
import { NextApiResponse } from "next";


async function handler(req: JwtRequest, res: NextApiResponse) {

    const user = req?.user

    if (!user) throw new AppError("UnAuthorised")

    if (req.method !== "GET") throw new AppError("Bad Request")

    const data = await TagService.getDocsQuery(user.uid) || []

    return res.json({ data: data })



}


export default withCors(withErrorHandler(withJwt(handler)))
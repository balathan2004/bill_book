import { bodyValidator } from "@/src/server/middlewares/bodyValidator";
import withCors from "@/src/server/middlewares/cors";
import { withJwt } from "@/src/server/middlewares/jwt";
import { withErrorHandler } from "@/src/server/middlewares/withErrorHandler";
import { tagSchema } from "@/src/server/schemas/tag.schema";
import { TagService } from "@/src/server/services/tag.services";
import { AppError } from "@/src/server/utils/appError";
import { JwtRequest, ListRes, InvoiceTagItem, ResponseConfig } from "@/src/server/utils/interfaces";
import { NextApiResponse } from "next";
import { json } from "zod";


async function handler(req: JwtRequest, res: NextApiResponse) {


    const user = req?.user

    const params = req.query

    console.log({ params });

    if (!user) throw new AppError("UnAuthorised")

    if (req.method === "PUT") {

        const data = bodyValidator(tagSchema, req)

        await TagService.patchDoc(data, user.uid)

        return res.json({ message: "Tag Updated" })

    }
    if (req.method === "GET") {



    }
    if (req.method === "DELETE") {



    }

    else {
        throw new AppError("Method Unavailable")
    }


}


export default withCors(withErrorHandler(withJwt(handler)))
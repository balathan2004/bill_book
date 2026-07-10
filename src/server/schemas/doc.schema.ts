import z from "zod";


export const docSchema = z.object({
    doc_id: z.string("Id Missing"),
    doc_text: z.string("Content Missing"),
    doc_name: z.string("Title Missing"),
    uid: z.string("Uid Missing"),
    doc_created: z.number("Creation time Missing"),
    lastUpdated: z.number("time Missing"),
});
import z from "zod";

export const invoiceSchema = z.object({
    uid: z.string("Uid Missing"),
    doc_id: z.string("Document ID Missing"),
    created_at: z.number("Creation time Missing"),
    name: z.string("Name Missing"),
    invoice_time: z.number("Invoice time Missing"),
    price: z.number("Price Missing"),
    quantity: z.number("Quantity Missing"),
    gross_price: z.number("Gross Price Missing"),
    invoice_type: z.enum(["expense", "income"]),
    description: z.string("Description Missing"),
    deleted: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

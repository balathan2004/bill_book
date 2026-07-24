import z from "zod";

export const tagSchema = z.object({
    id: z.string("Document ID Missing"),
    created_at: z.number("Creation time Missing"),
    name: z.string("Name Missing"),
    icon: z.string("Description Missing"),
    deleted: z.boolean().optional(),
});

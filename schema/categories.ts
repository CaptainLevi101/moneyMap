import { z } from "zod";


export const createCategorySchema=z.object({
    name:z.string().min(3).max(20),
    icon:z.string().max(20),
    type:z.enum(['income','expense'])
});

export const DeleteCategorySchema=z.object({
    name:z.string().min(3).max(20),
    type:z.enum(['income','expense'])
})

export type DeleteCategorySchemaType=z.infer<typeof DeleteCategorySchema>;
export type createCategorySchemaType=z.infer<typeof createCategorySchema>;
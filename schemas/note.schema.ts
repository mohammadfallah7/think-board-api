import z from "zod";

export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(250, "Content must be at most 250 characters"),
});

export const OrderDirectionSchema = z.enum(
  ["asc", "desc"],
  "Order direction must be either asc or desc",
);

export const UpdateNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be at most 50 characters")
      .optional(),
    content: z
      .string()
      .min(10, "Content must be at least 10 characters")
      .max(250, "Content must be at most 250 characters")
      .optional(),
  })
  .refine((data) => data.title || data.content, {
    error: "Either title or content is required",
    path: ["title"],
  });

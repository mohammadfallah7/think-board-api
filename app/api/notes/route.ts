import prisma from "@/lib/prisma";
import { CreateNoteSchema, OrderDirectionSchema } from "@/schemas/note.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type OrderDirection = z.infer<typeof OrderDirectionSchema>;

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderDirection = searchParams.get("order_direction");
    const term = searchParams.get("term");

    if (orderDirection) {
      const validatedFields = OrderDirectionSchema.safeParse(orderDirection);
      if (!validatedFields.success) {
        return NextResponse.json(
          {
            success: false,
            error: z.treeifyError(validatedFields.error).errors,
            status: 400,
          },
          { status: 400 },
        );
      }
    }

    const notes = await prisma.note.findMany({
      where: {
        ...(term && {
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { content: { contains: term, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        createdAt: orderDirection ? (orderDirection as OrderDirection) : "desc",
      },
    });

    return NextResponse.json(
      { success: true, response: notes, status: 200 },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        status: 500,
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validatedFields = CreateNoteSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          error: z.treeifyError(validatedFields.error).properties,
          status: 400,
        },
        { status: 400 },
      );
    }

    const note = await prisma.note.create({
      data: { ...validatedFields.data },
    });

    return NextResponse.json(
      { success: true, response: note, status: 201 },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        status: 500,
      },
      { status: 500 },
    );
  }
};

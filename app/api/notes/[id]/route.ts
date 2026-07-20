import prisma from "@/lib/prisma";
import { UpdateNoteSchema } from "@/schemas/note.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found", status: 404 },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, response: note, status: 200 },
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

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
      select: { id: true },
    });
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found", status: 404 },
        { status: 404 },
      );
    }

    await prisma.note.delete({ where: { id: note.id } });

    return NextResponse.json(
      { success: true, response: "Note deleted successfully", status: 200 },
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

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedFields = UpdateNoteSchema.safeParse(body);
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

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
      select: { id: true },
    });
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found", status: 404 },
        { status: 404 },
      );
    }

    const newNote = await prisma.note.update({
      where: { id: note.id },
      data: { ...validatedFields.data },
    });

    return NextResponse.json(
      { success: true, response: newNote, status: 200 },
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

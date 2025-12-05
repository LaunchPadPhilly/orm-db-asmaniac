import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    // Validate that id is a number
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: id }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, imageUrl, projectUrl, githubUrl, technologies } = body;

    // Validate required fields if provided
    if (title !== undefined && !title) {
      return NextResponse.json(
        { error: 'Title cannot be empty' },
        { status: 400 }
      );
    }
    if (description !== undefined && !description) {
      return NextResponse.json(
        { error: 'Description cannot be empty' },
        { status: 400 }
      );
    }
    if (technologies !== undefined && (!Array.isArray(technologies) || technologies.length === 0)) {
      return NextResponse.json(
        { error: 'Technologies must be a non-empty array' },
        { status: 400 }
      );
    }

    try {
      const project = await prisma.project.update({
        where: { id: id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
          ...(projectUrl !== undefined && { projectUrl: projectUrl || null }),
          ...(githubUrl !== undefined && { githubUrl: githubUrl || null }),
          ...(technologies !== undefined && { technologies })
        }
      });

      return NextResponse.json(project);
    } catch (error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    try {
      await prisma.project.delete({
        where: { id: id }
      });

      return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getNote, updateNote } from '@/lib/server/services/obsidian';
import logger from '@/lib/server/logger';

// GET - Read note content
export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const requestId = Date.now();
  const notePath = params.path.join('/');

  logger.api(`[${requestId}] Reading note: "${notePath}"`);

  try {
    const content = await getNote(notePath);

    if (content === null) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    logger.success(`[${requestId}] Note read successfully`);
    return NextResponse.json({ success: true, content });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to read note`,
      error instanceof Error ? error : { error }
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// PUT - Overwrite note
export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const requestId = Date.now();
  const notePath = params.path.join('/');

  try {
    const { content } = (await req.json()) as { content: string };

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'content is required' },
        { status: 400 }
      );
    }

    logger.api(`[${requestId}] Overwriting note: "${notePath}"`);

    const updated = await updateNote(notePath, content);
    logger.success(`[${requestId}] Note overwritten: ${notePath}`);

    return NextResponse.json({ success: true, notePath, result: updated });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to overwrite note`,
      error instanceof Error ? error : { error }
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

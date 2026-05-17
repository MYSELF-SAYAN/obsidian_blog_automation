import { NextRequest, NextResponse } from 'next/server';
import { listNotes, createNote as createNoteService } from '@/lib/server/services/obsidian';
import logger from '@/lib/server/logger';

interface NotesResponse {
  success: boolean;
  notes?: string[];
  total?: number;
  error?: string;
}

interface CreateNoteBody {
  path: string;
  content: string;
}

// GET - List all notes
export async function GET(req: NextRequest): Promise<NextResponse<NotesResponse>> {
  const requestId = Date.now();
  logger.api(`[${requestId}] Notes list request received`);

  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const query = searchParams.get('query');
    const path = searchParams.get('path');

    const limitNum = limit ? parseInt(limit, 10) : undefined;

    let notes: string[] = [];

    if (query || path) {
      logger.api(`[${requestId}] Using search with query: "${query}", path: "${path}"`);
      // For now, just use listNotes and filter
      const allNotes = await listNotes(path || undefined, limitNum);
      notes = allNotes;
    } else {
      logger.api(`[${requestId}] Listing all files`);
      const allNotes = await listNotes(undefined, limitNum);
      notes = allNotes;
    }

    const finalNotes = limitNum ? notes.slice(0, limitNum) : notes;

    logger.success(`[${requestId}] Returning ${finalNotes.length} notes`);

    return NextResponse.json({
      success: true,
      notes: finalNotes,
      total: notes.length
    });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to list notes`,
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

// POST - Create note
export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = Date.now();

  try {
    const { path, content } = (await req.json()) as CreateNoteBody;

    if (!path || !content) {
      return NextResponse.json(
        { success: false, error: 'path and content are required' },
        { status: 400 }
      );
    }

    logger.api(`[${requestId}] Creating note: "${path}"`);

    const notePath = await createNoteService('Note', content, path);
    logger.success(`[${requestId}] Note created: ${path}`);

    return NextResponse.json({ success: true, notePath, result: notePath });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to create note`,
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

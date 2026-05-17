import { NextRequest, NextResponse } from 'next/server';
import { getDailyNote, appendToDailyNote } from '@/lib/server/services/obsidian';
import logger from '@/lib/server/logger';

// GET - Read daily note
export async function GET(_req: NextRequest): Promise<NextResponse> {
  const requestId = Date.now();
  logger.api(`[${requestId}] Reading daily note`);

  try {
    const content = await getDailyNote();

    logger.success(`[${requestId}] Daily note retrieved`);
    return NextResponse.json({ success: true, content });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to read daily note`,
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

// POST - Append to daily note
export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = Date.now();

  try {
    const { content } = (await req.json()) as { content: string };

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'content is required' },
        { status: 400 }
      );
    }

    logger.api(`[${requestId}] Appending to daily note`);

    const result = await appendToDailyNote(content);
    logger.success(`[${requestId}] Content appended to daily note`);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to append to daily note`,
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

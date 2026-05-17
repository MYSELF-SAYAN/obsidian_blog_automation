import { NextRequest, NextResponse } from 'next/server';
import { appendToNote } from '@/lib/server/services/obsidian';
import logger from '@/lib/server/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const requestId = Date.now();
  const notePath = params.path.slice(0, -1).join('/'); // Remove 'append' from path

  try {
    const { content } = (await req.json()) as { content: string };

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'content is required' },
        { status: 400 }
      );
    }

    logger.api(`[${requestId}] Appending to note: "${notePath}"`);

    const result = await appendToNote(notePath, content);
    logger.success(`[${requestId}] Content appended to: ${notePath}`);

    return NextResponse.json({ success: true, notePath, result });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to append to note`,
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

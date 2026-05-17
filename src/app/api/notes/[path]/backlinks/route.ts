import { NextRequest, NextResponse } from 'next/server';
import { getNoteBacklinks } from '@/lib/server/services/obsidian';
import logger from '@/lib/server/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const requestId = Date.now();
  const notePath = params.path.slice(0, -1).join('/'); // Remove 'backlinks' from path

  logger.api(`[${requestId}] Getting backlinks for: "${notePath}"`);

  try {
    const backlinks = await getNoteBacklinks(notePath);

    logger.success(`[${requestId}] Found ${backlinks.length} backlinks`);
    return NextResponse.json({
      success: true,
      backlinks,
      total: backlinks.length
    });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to get backlinks`,
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

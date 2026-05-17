import { NextRequest, NextResponse } from 'next/server';
import { getNoteOutgoing } from '@/lib/server/services/obsidian';
import logger from '@/lib/server/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const requestId = Date.now();
  const notePath = params.path.slice(0, -1).join('/'); // Remove 'outgoing' from path

  logger.api(`[${requestId}] Getting outgoing links for: "${notePath}"`);

  try {
    const outgoing = await getNoteOutgoing(notePath);

    logger.success(`[${requestId}] Found ${outgoing.length} outgoing links`);
    return NextResponse.json({
      success: true,
      outgoing,
      total: outgoing.length
    });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to get outgoing links`,
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

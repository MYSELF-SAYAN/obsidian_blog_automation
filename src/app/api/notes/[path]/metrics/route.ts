import { NextRequest, NextResponse } from 'next/server';
import { getNoteMetrics } from '@/lib/server/services/obsidian';
import logger from '@/lib/server/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const requestId = Date.now();
  const notePath = params.path.slice(0, -1).join('/'); // Remove 'metrics' from path

  logger.api(`[${requestId}] Getting metrics for: "${notePath}"`);

  try {
    const metrics = await getNoteMetrics(notePath);

    logger.success(`[${requestId}] Metrics retrieved for: ${notePath}`);
    return NextResponse.json({
      success: true,
      wordCount: metrics?.wordCount || 0,
      characterCount: (metrics?.wordCount || 0) * 5,
      outline: metrics?.outline || []
    });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to get metrics`,
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

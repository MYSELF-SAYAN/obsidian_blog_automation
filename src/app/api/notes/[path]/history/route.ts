import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const requestId = Date.now();
  const notePath = params.path.slice(0, -1).join('/'); // Remove 'history' from path

  logger.api(`[${requestId}] Getting history for: "${notePath}"`);

  try {
    // Placeholder: obsidian-sdk history support
    const history: any[] = [];

    logger.success(`[${requestId}] Found ${history.length} versions`);
    return NextResponse.json({
      success: true,
      history,
      total: history.length
    });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to get history`,
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

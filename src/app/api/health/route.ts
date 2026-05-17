import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/server/config';
import logger from '@/lib/server/logger';

export async function GET(_req: NextRequest): Promise<NextResponse> {
  const requestId = Date.now();
  logger.api(`[${requestId}] Health check`);

  try {
    return NextResponse.json({
      status: 'ok',
      vault: config.obsidianVaultName
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`[${requestId}] Health check failed`, err);
    return NextResponse.json(
      { status: 'error', error: 'Health check failed' },
      { status: 500 }
    );
  }
}

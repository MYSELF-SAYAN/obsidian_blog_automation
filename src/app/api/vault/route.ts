import { NextRequest, NextResponse } from 'next/server';
import { listNotes } from '@/lib/server/services/obsidian';
import { config } from '@/lib/server/config';
import logger from '@/lib/server/logger';

export async function GET(_req: NextRequest): Promise<NextResponse> {
  const requestId = Date.now();
  logger.api(`[${requestId}] Getting vault info`);

  try {
    const files = await listNotes();
    const totalFiles = files.length;

    logger.success(`[${requestId}] Vault info retrieved`);
    return NextResponse.json({
      success: true,
      vault: config.obsidianVaultName,
      totalFiles
    });
  } catch (error) {
    logger.error(
      `[${requestId}] Failed to get vault info`,
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

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class KeepAliveService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KeepAliveService.name);
  private timer: NodeJS.Timeout | null = null;

  onModuleInit(): void {
    // Render provides RENDER_EXTERNAL_URL automatically (e.g. https://bitebox-backend.onrender.com)
    // Custom URLs can also be supplied via KEEP_ALIVE_URL
    const rawUrl =
      process.env.KEEP_ALIVE_URL ??
      (process.env.RENDER_EXTERNAL_URL
        ? `${process.env.RENDER_EXTERNAL_URL}/api/health`
        : null);

    if (!rawUrl) {
      this.logger.log(
        'Keep-alive self-ping is inactive (no RENDER_EXTERNAL_URL or KEEP_ALIVE_URL detected).',
      );
      return;
    }

    const pingUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    // Render free-tier sleeps after 15 minutes of inactivity; ping every 10 minutes by default
    const intervalMinutes = Math.max(
      1,
      Number(process.env.KEEP_ALIVE_INTERVAL_MINUTES ?? 10),
    );
    const intervalMs = intervalMinutes * 60 * 1000;

    this.logger.log(
      `Keep-alive self-ping enabled: pinging ${pingUrl} every ${intervalMinutes} minute(s).`,
    );

    // Initial warm-up ping after 30 seconds
    const initialTimer = setTimeout(() => {
      void this.ping(pingUrl);
    }, 30_000);
    initialTimer.unref();

    // Periodic ping loop
    this.timer = setInterval(() => {
      void this.ping(pingUrl);
    }, intervalMs);
    this.timer.unref();
  }

  private async ping(url: string): Promise<void> {
    try {
      const res = await fetch(url);
      this.logger.log(`Keep-alive ping to ${url} succeeded (HTTP ${res.status})`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Keep-alive ping to ${url} failed: ${message}`);
    }
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

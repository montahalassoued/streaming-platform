import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Request, Response } from "express";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("sse")
  subscribe(
    @Req() req: Request,
    @Res() res: Response,
    @Query("userId") userId?: string,
  ) {
    const id = userId ?? (req.headers["x-user-id"] as string) ?? "anonymous";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    // disable buffering
    res.flushHeaders?.();

    // send a ping comment to establish the stream
    res.write(`:ok\n\n`);

    this.notificationsService.registerClient(id, res);

    req.on("close", () => {
      this.notificationsService.unregisterClient(id);
    });

    return res;
  }
}

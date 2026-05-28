import { Controller, Sse, Req, Res, UseGuards, UnauthorizedException } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RequestWithUser } from "../common/types/auth.types";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Sse("sse")
  subscribe(@Req() req: Request & RequestWithUser, @Res() res: Response) {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    const id = user.id;

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

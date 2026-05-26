import { Injectable } from "@nestjs/common";
import { CreateStreamDto } from "./dto/create-stream.dto";
import { UpdateStreamDto } from "./dto/update-stream.dto";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class StreamsService {
  constructor(private readonly redisService: RedisService) {}

  findAll() {
    return [{ message: "Streams list placeholder" }];
  }

  findOne(id: string) {
    return { message: "Stream detail placeholder", id };
  }

  create(createStreamDto: CreateStreamDto) {
    return { message: "Stream created placeholder", data: createStreamDto };
  }

  async update(id: string, updateStreamDto: UpdateStreamDto) {
    // If the stream is being set live, publish system messages to Redis
    if (updateStreamDto.isLive) {
      const streamerId = updateStreamDto.streamerId ?? null;
      const systemMessage = {
        streamId: id,
        content: "Streamer has started the stream",
        type: "system",
        timestamp: new Date().toISOString(),
      };

      const liveEvent = {
        streamId: id,
        streamerId,
        startedAt: updateStreamDto.startedAt ?? new Date().toISOString(),
      };

      // publish to chat.system.message channel so ChatGateway can broadcast
      void this.redisService.publish("chat.system.message", systemMessage);

      // publish to stream.went.live channel so NotificationsService can notify followers
      void this.redisService.publish("stream.went.live", liveEvent);
    }

    return { message: "Stream updated placeholder", id, data: updateStreamDto };
  }

  remove(id: string) {
    return { message: "Stream removed placeholder", id };
  }
}

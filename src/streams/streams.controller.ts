import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { StreamsService } from "./streams.service";
import { CreateStreamDto } from "./dto/create-stream.dto";
import { UpdateStreamDto } from "./dto/update-stream.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("streams")
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Get()
  findAll(
    @Query("categoryId") categoryId?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const p = page ? Number(page) : 1;
    const l = limit ? Number(limit) : 20;
    return this.streamsService.getLiveStreams(categoryId, p, l);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.streamsService.getStreamById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: any, @Body() createStreamDto: CreateStreamDto) {
    return this.streamsService.createStream(user.id, createStreamDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() updateStreamDto: UpdateStreamDto,
  ) {
    return this.streamsService.updateStream(id, user.id, updateStreamDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.streamsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/my/key")
  getKey(@CurrentUser() user: any) {
    return this.streamsService.getStreamKey(user.id);
  }

  @Post("/verify-key/:key")
  verifyKey(@Param("key") key: string) {
    return this.streamsService.verifyStreamKey(key);
  }

  @Post("/ended/:key")
  endByKey(@Param("key") key: string) {
    return this.streamsService.onStreamEnded(key);
  }
}
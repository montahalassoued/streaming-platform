import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { StreamsService } from "./streams.service";
import { CreateStreamDto, UpdateStreamDto } from "./streams.dto";

@Controller("streams")
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Get()
  findAll() {
    return this.streamsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.streamsService.findOne(id);
  }

  @Post()
  create(@Body() createStreamDto: CreateStreamDto) {
    return this.streamsService.create(createStreamDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStreamDto: UpdateStreamDto) {
    return this.streamsService.update(id, updateStreamDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.streamsService.remove(id);
  }
}

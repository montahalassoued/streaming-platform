import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { VodsService } from "./vods.service";
import { CreateVodDto, UpdateVodDto } from "./vods.dto";

@Controller("vods")
export class VodsController {
  constructor(private readonly vodsService: VodsService) {}

  @Get()
  findAll() {
    return this.vodsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.vodsService.findOne(id);
  }

  @Post()
  create(@Body() createVodDto: CreateVodDto) {
    return this.vodsService.create(createVodDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateVodDto: UpdateVodDto) {
    return this.vodsService.update(id, updateVodDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.vodsService.remove(id);
  }
}

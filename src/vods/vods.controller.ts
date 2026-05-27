import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { VodsService } from "./vods.service";
import { CreateVodDto } from "./dto/create-vod.dto";
import { UpdateVodDto } from "./dto/update-vod.dto";

@ApiTags("vods")
@Controller("vods")
export class VodsController {
  constructor(private readonly vodsService: VodsService) {}

  @Get()
  @ApiOperation({ summary: "List all public VODs" })
  @ApiResponse({ status: 200, description: "List of VODs" })
  findAll() {
    return this.vodsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a VOD by id" })
  @ApiResponse({ status: 200, description: "VOD detail" })
  @ApiResponse({ status: 404, description: "VOD not found" })
  findOne(@Param("id") id: string) {
    return this.vodsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a VOD record" })
  @ApiResponse({ status: 201, description: "Created VOD" })
  create(@Body() createVodDto: CreateVodDto) {
    return this.vodsService.create(createVodDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a VOD" })
  @ApiResponse({ status: 200, description: "Updated VOD" })
  update(@Param("id") id: string, @Body() updateVodDto: UpdateVodDto) {
    return this.vodsService.update(id, updateVodDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a VOD" })
  @ApiResponse({ status: 200, description: "Deleted VOD" })
  remove(@Param("id") id: string) {
    return this.vodsService.remove(id);
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVodDto } from "./dto/create-vod.dto";
import { UpdateVodDto } from "./dto/update-vod.dto";
import { VodEntity } from "./entities/vod.entity";
import { StreamEntity } from "../streams/entities/stream.entity";

@Injectable()
export class VodsService {
  constructor(
    @InjectRepository(VodEntity)
    private readonly vodRepo: Repository<VodEntity>,
    @InjectRepository(StreamEntity)
    private readonly streamRepo: Repository<StreamEntity>,
  ) {}

  findAll() {
    return this.vodRepo.find({
      relations: { stream: { streamer: true, category: true } },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string) {
    const vod = await this.vodRepo.findOne({
      where: { id },
      relations: { stream: { streamer: true, category: true } },
    });

    if (!vod) {
      throw new NotFoundException("VOD not found");
    }

    return vod;
  }

  async create(createVodDto: CreateVodDto) {
    const stream = await this.streamRepo.findOneBy({ id: createVodDto.streamId });
    if (!stream) {
      throw new NotFoundException("Stream not found");
    }

    const vod = this.vodRepo.create({
      streamId: createVodDto.streamId,
      title: createVodDto.title,
      videoUrl: createVodDto.videoUrl,
      thumbnailUrl: createVodDto.thumbnailUrl,
      durationSeconds: createVodDto.durationSeconds,
      isPublic: createVodDto.isPublic ?? true,
    });

    return this.vodRepo.save(vod);
  }

  async update(id: string, updateVodDto: UpdateVodDto) {
    const vod = await this.vodRepo.findOneBy({ id });
    if (!vod) {
      throw new NotFoundException("VOD not found");
    }

    if (updateVodDto.title !== undefined) vod.title = updateVodDto.title;
    if (updateVodDto.videoUrl !== undefined) vod.videoUrl = updateVodDto.videoUrl;
    if (updateVodDto.thumbnailUrl !== undefined) vod.thumbnailUrl = updateVodDto.thumbnailUrl;
    if (updateVodDto.durationSeconds !== undefined) {
      vod.durationSeconds = updateVodDto.durationSeconds;
    }
    if (updateVodDto.isPublic !== undefined) vod.isPublic = updateVodDto.isPublic;

    return this.vodRepo.save(vod);
  }

  async remove(id: string) {
    const vod = await this.vodRepo.findOneBy({ id });
    if (!vod) {
      throw new NotFoundException("VOD not found");
    }

    await this.vodRepo.remove(vod);
    return vod;
  }
}

import { Injectable } from "@nestjs/common";
import { CreateVodDto } from "./dto/create-vod.dto";
import { UpdateVodDto } from "./dto/update-vod.dto";

@Injectable()
export class VodsService {
  findAll() {
    return [{ message: "VODs list placeholder" }];
  }

  findOne(id: string) {
    return { message: "VOD detail placeholder", id };
  }

  create(createVodDto: CreateVodDto) {
    return { message: "VOD created placeholder", data: createVodDto };
  }

  update(id: string, updateVodDto: UpdateVodDto) {
    return { message: "VOD updated placeholder", id, data: updateVodDto };
  }

  remove(id: string) {
    return { message: "VOD removed placeholder", id };
  }
}

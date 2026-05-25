import { Injectable } from "@nestjs/common";
import { CreateStreamDto, UpdateStreamDto } from "./streams.dto";

@Injectable()
export class StreamsService {
  findAll() {
    return [{ message: "Streams list placeholder" }];
  }

  findOne(id: string) {
    return { message: "Stream detail placeholder", id };
  }

  create(createStreamDto: CreateStreamDto) {
    return { message: "Stream created placeholder", data: createStreamDto };
  }

  update(id: string, updateStreamDto: UpdateStreamDto) {
    return { message: "Stream updated placeholder", id, data: updateStreamDto };
  }

  remove(id: string) {
    return { message: "Stream removed placeholder", id };
  }
}

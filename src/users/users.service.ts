import { Injectable } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  findAll() {
    return [{ message: "Users list placeholder" }];
  }

  findOne(id: string) {
    return { message: "User detail placeholder", id };
  }

  create(createUserDto: CreateUserDto) {
    return { message: "User created placeholder", data: createUserDto };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return { message: "User updated placeholder", id, data: updateUserDto };
  }

  remove(id: string) {
    return { message: "User removed placeholder", id };
  }
}

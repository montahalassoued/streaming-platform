import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { UpdateUserDto } from "../users/dto/update-user.dto";

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  listUsers() {
    return this.usersService.findAll();
  }

  setAdmin(id: string, isAdmin: boolean) {
    return (async () => {
      const user = await this.usersService.findOne(id);
      if (!user) throw new NotFoundException("User not found");
      const update: UpdateUserDto = { isAdmin };
      return this.usersService.update(id, update);
    })();
  }
}

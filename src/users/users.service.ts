import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async findAll() {
    const users = await this.usersRepo.find();
    return users.map(({ passwordHash, ...user }) => user);
  }

  async findOne(id: string) {
    return (await this.usersRepo.findOneBy({ id })) ?? null;
  }

  async findByEmail(email: string) {
    return (await this.usersRepo.findOneBy({ email })) ?? null;
  }

  async findByUsername(username: string) {
    return (await this.usersRepo.findOneBy({ username })) ?? null;
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepo.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
      name: createUserDto.name,
      isAdmin: false,
    });

    return this.usersRepo.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) return null;

    if (updateUserDto.username !== undefined) user.username = updateUserDto.username;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    if (updateUserDto.passwordHash !== undefined)
      user.passwordHash = updateUserDto.passwordHash;
    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.isAdmin !== undefined) user.isAdmin = updateUserDto.isAdmin;

    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) return null;
    await this.usersRepo.remove(user);
    return user;
  }
}

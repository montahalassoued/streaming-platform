import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CreateUserDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  private readonly users: Array<{
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    name?: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt?: Date;
  }> = [];

  findAll() {
    return this.users.map(({ passwordHash, ...user }) => user);
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null;
  }

  findByUsername(username: string) {
    return this.users.find((user) => user.username === username) ?? null;
  }

  create(createUserDto: CreateUserDto) {
    const user = {
      id: randomUUID(),
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
      name: createUserDto.name,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.find((entry) => entry.id === id);
    if (!user) {
      return null;
    }

    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.passwordHash !== undefined) {
      user.passwordHash = updateUserDto.passwordHash;
    }
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.isAdmin !== undefined) {
      user.isAdmin = updateUserDto.isAdmin;
    }

    user.updatedAt = new Date();
    return user;
  }

  remove(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) {
      return null;
    }

    const [removedUser] = this.users.splice(index, 1);
    return removedUser;
  }
}

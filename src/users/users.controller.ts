import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post(":id/follow/:streamerId")
  follow(@Param("id") id: string, @Param("streamerId") streamerId: string) {
    return this.usersService.follow(id, streamerId);
  }

  @Delete(":id/unfollow/:streamerId")
  unfollow(@Param("id") id: string, @Param("streamerId") streamerId: string) {
    return this.usersService.unfollow(id, streamerId);
  }

  @Post(":id/donations")
  giveDonation(@Param("id") id: string, @Body() body: any) {
    // ensure the donation is attributed to the path user id
    const dto = { ...body, userId: id };
    return this.usersService.giveDonation(dto);
  }

  @Post(":id/subscribe")
  subscribe(
    @Param("id") id: string,
    @Body() body: { streamerId: string; tierId: string },
  ) {
    return this.usersService.subscribeToStreamer(
      id,
      body.streamerId,
      body.tierId,
    );
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}

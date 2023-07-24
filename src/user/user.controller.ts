import { Controller, Get, Post, Body, Patch,
  UseGuards, Param, Delete, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

var bcrypt = require('bcrypt')


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() request) {
    const userId = request.user.sub
    return this.userService.findAll()
  }

  @UseGuards(AuthGuard)
  @Get('basiq')
  async findBasiq(@Request() request)
  {
    const userId = request.user.sub
    return await this.userService.basiqUser(userId)
  }
  
  @UseGuards(AuthGuard)
  @Post('createConnection')
  async createConnection(@Request() request,@Body() body: { loginId: string; password: string; institution:  string  }) {
    const userId = request.user.sub
    return await this.userService.createConnection(userId,body)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

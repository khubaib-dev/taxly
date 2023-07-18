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

  @Post('check')
  check(@Request() request){
    const req = request.body
    try {
      return bcrypt.compareSync(req.password, '$2y$10$kd.W7zB8FmbkIFfaMfO3UOOmwu8BxW6Slo.7aln8BEbJV0MYnnfwy')
      
    } catch (error) {
      console.log("error "+error)
    }
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

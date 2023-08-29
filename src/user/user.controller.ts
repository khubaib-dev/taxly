import {
  Controller, Get, Post, Body, Patch,
  UseGuards, Param, Delete, Request, Res
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

var bcrypt = require('bcrypt')


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) { }

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
  @Get('checkAuth')
  async checkAuth(@Request() request, @Res() res) {
    const userId = request.user.sub
    await this.userService.getAMemberUser(userId)
    .then(data => {
      return res.status(200).json({
        status: 200,
        ok: true,
        data,
      });
    })
    .catch(error => {
      return res.status(200).json({
        status: 500,
        ok: false,
        message: error,
      });
    });
  }

  @UseGuards(AuthGuard)
  @Get('basiq')
  async findBasiq(@Request() request) {
    const userId = request.user.sub
    return await this.userService.basiqUser(userId)
  }

  @UseGuards(AuthGuard)
  @Get('getUser')
  async getUser(@Request() request) {
    const userId = request.user.sub
    return await this.userService.findOne(userId)
  }

  @UseGuards(AuthGuard)
  @Get('updateCreadits')
  async updateCreadits(@Request() request, @Res() res) {
    const id = request.user.sub
    const user = await this.userRepository.findOne({
      where: {
        id
      },
    });

    user.credits = (user.credits - 1)
    await this.userRepository.save(user)

    return res.status(200).json({
      status: 200,
      ok: true,
    })
}

@UseGuards(AuthGuard)
@Get('basiqAccounts')
async basiqAccounts(@Request() request)
{
  const userId = request.user.sub
  return await this.userService.basiqAccounts(userId)
}

@UseGuards(AuthGuard)
@Get('basiqTransactions')
async basiqTransactions(@Request() request)
{
  const userId = request.user.sub
  return await this.userService.basiqTransactions(userId)
}

@UseGuards(AuthGuard)
@Get('getUserTypes')
async getUserTypes(@Request() request)
{
  const userId = request.user.sub
  return await this.userService.getUserTypes(userId)
}

@UseGuards(AuthGuard)
@Get('getProfessions')
async getProfessions(@Request() request)
{
  const userId = request.user.sub
  return await this.userService.getProfessions(userId)
}

@UseGuards(AuthGuard)
@Get('checkConsent')
async checkConsent(@Request() request)
{
  const userId = request.user.sub
  return await this.userService.checkConsent(userId)
}

@UseGuards(AuthGuard)
@Post('createConnection')
async createConnection(@Request() request, @Body() body: { loginId: string; password: string; institution: string }) {
  const userId = request.user.sub
  return await this.userService.createConnection(userId, body)
}

@UseGuards(AuthGuard)
@Get('getDeduction')
async getDeduction(@Request() request) {
  const userId = request.user.sub
  return await this.userService.getDeduction(userId)
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

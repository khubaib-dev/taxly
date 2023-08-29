import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import { JwtService } from '@nestjs/jwt'
import { Setting } from '../setting/entities/setting.entity'
import { Criterion } from '../criteria/entities/criterion.entity'
import { Occupation } from '../occupation/entities/occupation.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Setting, Criterion, Occupation])],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Setting } from '../setting/entities/setting.entity'
import { User } from '../user/entities/user.entity'


@Module({
  imports: [TypeOrmModule.forFeature([User,Setting])],
  controllers: [SettingController],
  providers: [SettingService, JwtService]
})
export class SettingModule {}

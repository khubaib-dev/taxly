import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ApiService } from '../api/api.service'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'
import { GlobalVariableContainer } from '../../global-variables'
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from '../user/entities/user.entity';
import { Verification } from '../verification/entities/verification.entity'
import { VerificationService } from '../verification/verification.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Verification])
  ],
  controllers: [AuthController],
  providers: [VerificationService, UserService, AuthService, ApiService, ConfigService, GlobalVariableContainer]
})
export class AuthModule {}

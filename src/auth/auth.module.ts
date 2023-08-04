import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ApiService } from '../api/api.service'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'
import { GlobalVariableContainer } from '../../global-variables'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Verification } from '../verification/entities/verification.entity'
import { VerificationService } from '../verification/verification.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Setting } from '../setting/entities/setting.entity'
import { AichatService } from '../aichat/aichat.service'
import { Aichat } from '../aichat/entities/aichat.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Setting,Aichat]),
    TypeOrmModule.forFeature([Verification]),
    PassportModule,
    JwtModule
    // JwtModule.register({
    //   global: true,
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '1h' },
    // }),
  ],
  controllers: [AuthController],
  providers: [VerificationService, UserService, AuthService,
     ApiService, ConfigService, GlobalVariableContainer, JwtService, AichatService],
    exports: [JwtModule],
})
export class AuthModule {}

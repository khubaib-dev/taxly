import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api/api.service';
import { GlobalVariableContainer } from '../global-variables'
// import { MailerModule } from '@nestjs-modules/mailer'
import { VerificationModule } from './verification/verification.module';


@Module({
  
  controllers: [AppController],
  providers: [AppService, ApiService, GlobalVariableContainer],
  imports: [
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp-relay.sendinblue.com',
    //     port: 587,
    //     secure: false, // Set to true if using SSL/TLS
    //     auth: {
    //       user: 'taxpixtralia@gmail.com',
    //       pass: '10KOVHDc5vgdnCA4',
    //     },
    //   },
    // }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'taxly',
      autoLoadEntities: true,
      synchronize: true, // set to false in production
    }),
    UserModule,
    AuthModule,
    VerificationModule,
    ],
})
export class AppModule {}

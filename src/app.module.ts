import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api/api.service';
import { GlobalVariableContainer } from '../global-variables';

@Module({
  
  controllers: [AppController],
  providers: [AppService, ApiService, GlobalVariableContainer],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'crud',
      autoLoadEntities: true,
      synchronize: true, // set to false in production
    }),
    UserModule,
    AuthModule,
    ],
})
export class AppModule {}

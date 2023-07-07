import { Module } from '@nestjs/common';
import { ChartOfAccountService } from './chart-of-account.service';
import { ChartOfAccountController } from './chart-of-account.controller';

@Module({
  controllers: [ChartOfAccountController],
  providers: [ChartOfAccountService]
})
export class ChartOfAccountModule {}

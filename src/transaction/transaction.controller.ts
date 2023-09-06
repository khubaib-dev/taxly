import { Controller, Get, Post, Body, Patch,
  UseGuards, Param, Delete, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Post('createTransactions')
  async createTransactions(@Request() request) {
    const userId = request.user.sub
    return await this.transactionService.createTransactions(userId,request.body)
  }
  
  @UseGuards(AuthGuard)
  @Post('updateTransaction')
  async updateTransaction(@Request() request) {
    const userId = request.user.sub
    return await this.transactionService.updateTransaction(userId,request.body)
  }

}

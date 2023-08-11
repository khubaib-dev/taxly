import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './entities/transaction.entity'
import { ChartOfAccount } from '../chart-of-account/entities/chart-of-account.entity'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(ChartOfAccount)
    private readonly chartOfAccountRepository: Repository<ChartOfAccount>
  ) { }

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findByCat(code) {
    return this.chartOfAccountRepository.findOne({ where: { code } })
  }
  
  findByTransaction(transaction_id) {
    return this.transactionRepository.findOne({ where: { transaction_id } });
  }

  async createTransactions(userId, transactions) {
    var flag = 0;
    for (const transaction of transactions) {
      var category = transaction.subClass.title;
      var code = transaction.subClass.code;
      const checkChart = await this.findByCat(code);
      if (checkChart) {
        flag = 1
      } else {
        flag = 0
      }
      const transactionCheck = await this.findByTransaction(transaction.id)
      if (!transactionCheck) {
        const newTransaction = new Transaction();
        newTransaction.category = category;
        newTransaction.category_id = code;
        newTransaction.amount = transaction.amount;
        newTransaction.class = transaction.class;
        newTransaction.account = transaction.account;
        newTransaction.direction = transaction.direction;
        newTransaction.description = transaction.description;
        newTransaction.postDate = transaction.postDate;
        newTransaction.flag_coa = flag;
        newTransaction.userId = userId;
        newTransaction.transaction_id = transaction.id;
        await this.transactionRepository.save(newTransaction);
      }
    }
    return await this.transactionRepository.find({
      where: {
        userId: userId,
        flag_coa: 0
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

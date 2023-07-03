import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity'

@Injectable()
export class VerificationService {
  
  constructor(
    @InjectRepository(Verification)
    private readonly verifyRepository: Repository<Verification>,
  ) {}
  
  create(code) {
    const verification = new Verification();
    verification.verification_code = code;
    
    return this.verifyRepository.save(verification);
  }

  findAll() {
    return `This action returns all verification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} verification`;
  }

  // update(id: number, updateVerificationDto: UpdateVerificationDto) {
  //   return `This action updates a #${id} verification`;
  // }

  remove(id: number) {
    return `This action removes a #${id} verification`;
  }
}

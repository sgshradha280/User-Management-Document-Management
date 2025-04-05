import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(title: string, content: string, filePath:string): Promise<Document> {
    const doc = this.documentsRepository.create({ title, content, filePath });
    return this.documentsRepository.save(doc);
  }

  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find();
  }

  async upload(file: Express.Multer.File): Promise<Document> {
    const doc = this.documentsRepository.create({
      title: file.originalname,
      filePath: file.path,
    });
    return this.documentsRepository.save(doc);
  }
}
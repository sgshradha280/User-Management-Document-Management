// documents/documents.controller.ts
import { Controller, Get, Post, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { title: string; content: string, filePath:string }) {
    return this.documentsService.create(body.title, body.content, body.filePath);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file:any) {
    return this.documentsService.upload(file);
  }
}
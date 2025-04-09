import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../documents.controller';
import { DocumentsService } from '../documents.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Mock Document data
const mockDocument = {
  id: 1,
  title: 'Test Title',
  content: 'Test Content',
  filePath: '/uploads/test.pdf',
};

// Mock Service
const mockDocumentsService = {
  findAll: jest.fn().mockResolvedValue([mockDocument]),
  create: jest.fn().mockResolvedValue(mockDocument),
  upload: jest.fn().mockResolvedValue(mockDocument),
};

// Bypass Auth Guard for unit testing
class MockJwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return true;
  }
}

describe('DocumentsController', () => {
  let controller: DocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /documents', () => {
    it('should return all documents', async () => {
      const result = await controller.findAll();
      expect(mockDocumentsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockDocument]);
    });
  });

  describe('POST /documents', () => {
    it('should create a new document', async () => {
      const dto = { title: 'Test Title', content: 'Test Content', filePath: '/uploads/test.pdf' };
      const result = await controller.create(dto);
      expect(mockDocumentsService.create).toHaveBeenCalledWith(dto.title, dto.content, dto.filePath);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('POST /documents/upload', () => {
    it('should upload a file and return the document', async () => {
      const mockFile = { originalname: 'file.txt', path: '/uploads/file.txt' };
      const result = await controller.upload(mockFile);
      expect(mockDocumentsService.upload).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockDocument);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../document.entity';
import { Repository } from 'typeorm';

const mockDocument = {
  id: 1,
  title: 'Test Document',
  content: 'Some content',
  filePath: '/uploads/test.pdf',
};

const mockFile = {
  originalname: 'test.pdf',
  path: '/uploads/test.pdf',
} as Express.Multer.File;

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: Repository<Document>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and save a document', async () => {
      mockRepo.create.mockReturnValue(mockDocument);
      mockRepo.save.mockResolvedValue(mockDocument);

      const result = await service.create('Test Document', 'Some content', '/uploads/test.pdf');
      expect(mockRepo.create).toHaveBeenCalledWith({
        title: 'Test Document',
        content: 'Some content',
        filePath: '/uploads/test.pdf',
      });
      expect(mockRepo.save).toHaveBeenCalledWith(mockDocument);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('findAll()', () => {
    it('should return an array of documents', async () => {
      mockRepo.find.mockResolvedValue([mockDocument]);

      const result = await service.findAll();
      expect(mockRepo.find).toHaveBeenCalled();
      expect(result).toEqual([mockDocument]);
    });
  });

  describe('upload()', () => {
    it('should create and save a document from file upload', async () => {
      const uploadedDoc = { title: mockFile.originalname, filePath: mockFile.path };
      mockRepo.create.mockReturnValue(uploadedDoc);
      mockRepo.save.mockResolvedValue(uploadedDoc);

      const result = await service.upload(mockFile);
      expect(mockRepo.create).toHaveBeenCalledWith({
        title: 'test.pdf',
        filePath: '/uploads/test.pdf',
      });
      expect(mockRepo.save).toHaveBeenCalledWith(uploadedDoc);
      expect(result).toEqual(uploadedDoc);
    });
  });
});

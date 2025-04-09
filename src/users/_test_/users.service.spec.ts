import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const userData = { email: 'test@example.com', password: 'hashed' };
      mockUserRepository.create.mockReturnValue(userData);
      mockUserRepository.save.mockResolvedValue({ id: 1, ...userData });

      const result = await service.create(userData.email, userData.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
      expect(result).toEqual({ id: 1, ...userData });
    });
  });

  describe('findOne', () => {
    it('should find user by email', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('test@example.com');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('updateRole', () => {
    it('should update user role and return updated user', async () => {
      const userId = 1;
      const newRole = UserRole.EDITOR;
      const updatedUser = { id: 1, email: 'test@example.com', role: newRole };

      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.updateRole(userId, newRole);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, { role: newRole });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(updatedUser);
    });
  });
});

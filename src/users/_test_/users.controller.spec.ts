import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../user.entity';

const mockUsersService = {
  findAll: jest.fn().mockResolvedValue([{ id: 1, email: 'test@example.com', role: UserRole.ADMIN }]),
  updateRole: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', role: UserRole.EDITOR }),
};


class MockJwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return true;
  }
}


class MockRolesGuard {
  canActivate(context: ExecutionContext) {
    return true;
  }
}

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, email: 'test@example.com', role: UserRole.ADMIN }]);
    });
  });

  describe('POST /users/update-role', () => {
    it('should update user role', async () => {
      const body = { userId: 1, role: UserRole.EDITOR };
      const result = await controller.updateRole(body);
      expect(mockUsersService.updateRole).toHaveBeenCalledWith(1, UserRole.EDITOR);
      expect(result).toEqual({ id: 1, email: 'test@example.com', role: UserRole.EDITOR });
    });
  });
});

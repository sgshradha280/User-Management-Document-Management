import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../local-auth.guard';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

// Mock AuthService
const mockAuthService = {
  register: jest.fn().mockResolvedValue({ message: 'User registered' }),
  login: jest.fn().mockResolvedValue({ access_token: 'jwt-token' }),
};

// Mock Guards that always allow access
class MockLocalAuthGuard {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 1, email: 'test@example.com' }; // mock user
    return true;
  }
}

class MockJwtAuthGuard {
  canActivate() {
    return true;
  }
}

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useClass(MockLocalAuthGuard)
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('should register a user', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const result = await controller.register(dto);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toEqual({ message: 'User registered' });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user and return a token', async () => {
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.login(req);
      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual({ access_token: 'jwt-token' });
    });
  });

  describe('POST /auth/logout', () => {
    it('should return logout message', async () => {
      const result = await controller.logout();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});

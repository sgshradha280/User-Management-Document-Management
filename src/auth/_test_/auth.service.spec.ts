import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin'
      };

      const result = await authService.validateUser('test@example.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent@example.com', 'password123');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const mockUser = {
        email: 'test@example.com',
        id: 1,
        role: 'user',
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue('mock.jwt.token');

      const result = await authService.login(mockUser);
      
      expect(result).toEqual({
        access_token: 'mock.jwt.token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 1,
        role: 'user',
      });
    });
  });


});
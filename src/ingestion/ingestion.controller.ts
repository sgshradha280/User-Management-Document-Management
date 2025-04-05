// ingestion/ingestion.controller.ts
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('ingestion')
export class IngestionController {
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('trigger')
  async triggerIngestion() {
    // Call Python backend here (HTTP request or queue)
    return { message: 'Ingestion triggered' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus() {
    // Return ingestion status
    return { status: 'running' };
  }
}
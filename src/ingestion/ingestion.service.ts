import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionService {
  async triggerIngestion(): Promise<string> {
    // In a real app, this would call your Python backend
    return 'Ingestion process started';
  }

  async getStatus(): Promise<{ status: string }> {
    return { status: 'running' };
  }
}
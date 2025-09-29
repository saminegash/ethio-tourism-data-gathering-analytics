import { randomUUID } from 'crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Record<string, unknown>, _res: unknown, next: () => void) {
    req['requestId'] = req['headers']?.['x-request-id'] ?? randomUUID();
    next();
  }
}

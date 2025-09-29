import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(SupabaseStrategy.name);

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') ?? 'set-a-secret'
    });
  }

  validate(payload: any) {
    if (!payload?.sub) {
      this.logger.warn('JWT payload missing subject');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
  }
}

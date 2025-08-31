// 📌 src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret_default',
    });
  }

  /**
   * ✅ Validación del payload
   * Passport inyecta este objeto en req.user
   */
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}

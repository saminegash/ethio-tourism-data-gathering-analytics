import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SupabaseStrategy } from './strategies/supabase.strategy'
import { ImmigrationIntegration } from '../integrations/immigration-api'
import { FaydaIntegration } from '../integrations/fayda-api'
import { DocumentScannerIntegration } from '../integrations/document-scanner'
import { RbacService } from '../rbac/rbac.service'
import { AuditService } from '../audit/audit.service'
import { OauthService } from '../oauth/oauth.service'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'change-me',
        signOptions: { expiresIn: '15m' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseStrategy,
    ImmigrationIntegration,
    FaydaIntegration,
    DocumentScannerIntegration,
    RbacService,
    AuditService,
    OauthService
  ],
  exports: [AuthService, RbacService]
})
export class AuthModule {}

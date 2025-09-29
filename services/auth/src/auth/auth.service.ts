import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto'
import { VerifyIdentityDto } from './dto/verify-identity.dto'
import { ImmigrationIntegration } from '../integrations/immigration-api'
import { FaydaIntegration } from '../integrations/fayda-api'
import { DocumentScannerIntegration } from '../integrations/document-scanner'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly supabase: SupabaseClient | null;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly immigration: ImmigrationIntegration,
    private readonly fayda: FaydaIntegration,
    private readonly documentScanner: DocumentScannerIntegration
  ) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const serviceRoleKey = this.configService.get<string>(
      'supabase.serviceRoleKey'
    );

    if (!supabaseUrl || !serviceRoleKey) {
      this.logger.warn('Supabase credentials missing, running in mock mode');
      this.supabase = null;
    } else {
      this.supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false }
      });
    }
  }

  async login(payload: LoginDto) {
    if (!this.supabase) {
      return this.issueToken({
        id: 'mock-user',
        email: payload.email,
        role: 'tourist'
      });
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (error) {
      this.logger.error(`Supabase auth failed: ${error.message}`);
      throw error;
    }

    return this.issueToken({
      id: data.user?.id ?? 'unknown',
      email: data.user?.email ?? payload.email,
      role: data.user?.app_metadata?.role ?? 'tourist'
    });
  }

  async verifyIdentity(payload: VerifyIdentityDto) {
    const documentCheck = await this.documentScanner.scanDocument(
      payload.documentNumber
    );

    const immigrationStatus = await this.immigration.fetchTravelerStatus(
      payload.documentNumber
    );

    const faydaRecord = await this.fayda.lookupCitizen(payload.documentNumber);

    return {
      documentCheck,
      immigrationStatus,
      faydaRecord,
      verifiedAt: new Date().toISOString()
    };
  }

  private issueToken(user: { id: string; email: string; role: string }) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'refresh'
      },
      { secret: process.env.JWT_REFRESH_SECRET ?? 'set-a-refresh-secret' }
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 15 * 60
    };
  }
}

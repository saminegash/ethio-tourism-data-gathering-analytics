import { Injectable } from '@nestjs/common';

@Injectable()
export class OauthService {
  async createAuthorizationUrl(provider: 'google' | 'facebook') {
    return {
      provider,
      url: `https://auth.example.com/${provider}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  }
}

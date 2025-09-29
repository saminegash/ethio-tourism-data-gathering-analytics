import { Injectable } from '@nestjs/common';

export type Role = 'admin' | 'operator' | 'tourist' | 'partner' | 'api_client';

@Injectable()
export class RbacService {
  private readonly roleMatrix: Record<Role, string[]> = {
    admin: ['*'],
    operator: ['dashboard:read', 'alerts:manage'],
    tourist: ['itinerary:read'],
    partner: ['poi:manage'],
    api_client: ['data:ingest']
  };

  can(role: Role, permission: string): boolean {
    const grants = this.roleMatrix[role] ?? [];
    return grants.includes('*') || grants.includes(permission);
  }
}

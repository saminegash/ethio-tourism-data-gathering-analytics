export type Resource = 'dashboard' | 'wallet' | 'telemetry' | 'admin';

export const ACCESS_POLICIES: Record<Resource, string[]> = {
  dashboard: ['admin', 'operator'],
  wallet: ['admin', 'operator'],
  telemetry: ['admin', 'operator', 'api_client'],
  admin: ['admin']
};

export function canAccess(role: string, resource: Resource): boolean {
  return ACCESS_POLICIES[resource]?.includes(role) ?? false;
}

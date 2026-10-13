import type { AppRole } from '@/types';

export function isAuthorizedAdminRole(role: AppRole): boolean {
  return ['admin', 'support_agent', 'finance_manager', 'content_editor'].includes(role);
}

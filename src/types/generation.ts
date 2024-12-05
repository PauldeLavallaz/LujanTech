export interface Generation {
  run_id: string;
  user_id: string;
  deployment_id: string;
  live_status: string;
  inputs: Record<string, any>;
  createdAt?: Date;
} 
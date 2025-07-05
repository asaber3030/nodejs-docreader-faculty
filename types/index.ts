export type AppStatus = 'running' | 'maintenance';
export type FindByField = 'email' | 'id' | 'username';

export type TAdmin = {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TQueryParameters = {
  search?: string;
  orderType: 'asc' | 'desc';
  orderBy: string;
};

export type TQueryParametersWithLimit = {
  search?: string;
  orderType: 'asc' | 'desc';
  orderBy: string;
  limit: string;
};

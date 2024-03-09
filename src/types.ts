export interface Transaction {
  valor: number;
  tipo: 'c' | 'd';
  descricao: string;
  realizada_em: string;
}

export interface ClientBalanceInfo {
  total: number;
  data_extrato: string;
  limite: number;
}

export interface AccountExtract {
  saldo: ClientBalanceInfo;
  ultimas_transacoes: Transaction[];
}

export interface GetClientByIdResult {
  id: number;
  total: number;
  limite: number;
}

export interface TransactionQueryResult {
  amount: number;
  type: 'c' | 'd';
  description: string;
  created_at: string;
}

export interface TransactionConcludedResult {
  limite: number;
  saldo: number;
}

export interface MakeTransactionDto {
  id: number;
  amount: number;
  type: 'c' | 'd';
  description: string;
}

export interface MakeTransactionRequestBody {
  valor: number;
  tipo: 'c' | 'd';
  descricao: string;
}

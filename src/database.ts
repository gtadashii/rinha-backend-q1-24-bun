import postgres from 'postgres';
import { ClientDoesNotExistsException, InconsistentTransactionException, InvalidPayloadException } from './exceptions';
import {
  GetClientByIdResult,
  AccountExtract,
  TransactionQueryResult,
  TransactionConcludedResult,
  MakeTransactionDto
} from './types';

const sql = postgres({
  username: 'postgres',
  host: Bun.env['DB_HOSTNAME'] || 'localhost',
  database: 'crebito',
  password: 'postgres',
  port: 5432
});

export const getClientById = async (id: number): Promise<GetClientByIdResult> => {
  const result = await sql`SELECT id, balance, account_limit FROM clients WHERE id = ${id}`;

  if (!result[0]) {
    throw new ClientDoesNotExistsException();
  }

  return {
    id: result[0].id,
    total: result[0].balance,
    limite: result[0].account_limit
  };
};

export const getTransactionsByClientId = async (id: number): Promise<AccountExtract> => {
  const account = await getClientById(id);
  const transactions = await sql<
    TransactionQueryResult[]
  >`SELECT amount, type, description, created_at FROM transactions WHERE client_id = ${id} ORDER BY created_at DESC LIMIT 10`;

  return {
    saldo: {
      total: account.total,
      data_extrato: new Date().toISOString(),
      limite: account.limite
    },
    ultimas_transacoes: transactions.map((transaction) => ({
      valor: transaction.amount,
      tipo: transaction.type,
      descricao: transaction.description,
      realizada_em: transaction.created_at
    }))
  };
};

export const makeTransaction = async (request: MakeTransactionDto): Promise<TransactionConcludedResult> => {
  const { id, amount, type, description } = request;
  const account = await getClientById(id);

  if (!['c', 'd'].includes(type)) {
    throw new InvalidPayloadException('type must be one of: "c" or "d"');
  }

  if (description.length > 10) {
    throw new InvalidPayloadException('description must be at most 10 characters');
  }

  if (amount % 1 !== 0) {
    throw new InvalidPayloadException('amount must be an integer');
  }

  const treatedAmount = type === 'd' ? -amount : amount;

  const updatedAccountData = {
    limite: account.limite,
    saldo: account.total + treatedAmount
  };

  if (updatedAccountData.saldo < -updatedAccountData.limite) {
    throw new InconsistentTransactionException();
  }

  await sql`
    INSERT INTO transactions (client_id, amount, type, description) VALUES (${id}, ${treatedAmount}, ${type}, ${description})
  `;

  await sql`
    UPDATE clients SET balance = ${updatedAccountData.saldo} WHERE id = ${id}
  `;

  return updatedAccountData;
};

// export const getAllClients = async () => {
//   const result = await sql`SELECT * FROM clients`;
//   console.log(result);
//   return result;
// };

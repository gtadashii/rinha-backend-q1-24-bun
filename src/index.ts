import { Elysia } from 'elysia';
import { getAccountExtract, makeTransactionOnAccount } from './controller';

const app = new Elysia();

app
  // .get('/', () => 'Hello, World!')
  // .get('/all', (params) => getAll(params))
  // .get('/clientes/:id', (params) => getClientByIdController(params))
  .get('/clientes/:id/extrato', (params) => getAccountExtract(params))
  .post('/clientes/:id/transacoes', (params) => makeTransactionOnAccount(params));

app.listen(8080);
console.log(`Server is running on port ${app.server?.port}`);

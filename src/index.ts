import { Elysia } from 'elysia';

const app = new Elysia();

app
  .get('/', 'Hello World')
  .post('/clientes/:id/transacoes', 'transacoes route')
  .get('/clientes/:id/extrato', 'extrato route');

app.listen(3000);
console.log(`Server is running on port ${app.server?.port}`);

import { getTransactionsByClientId, makeTransaction } from './database';
import { ClientDoesNotExistsException, InconsistentTransactionException, InvalidPayloadException } from './exceptions';
import { MakeTransactionRequestBody } from './types';

export async function getAccountExtract(context: any) {
  try {
    const { id } = context.params;
    const extract = await getTransactionsByClientId(id);
    return new Response(JSON.stringify(extract), { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof ClientDoesNotExistsException) {
      return new Response('Client does not exists', { status: 404 });
    }
    return new Response('Internal server error', { status: 500 });
  }
}

export async function makeTransactionOnAccount(context: any) {
  try {
    const { id } = context.params;
    const { valor, tipo, descricao } = context.body as MakeTransactionRequestBody;
    const transactionResult = await makeTransaction({
      id,
      amount: valor,
      type: tipo,
      description: descricao
    });
    return new Response(JSON.stringify(transactionResult), { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof ClientDoesNotExistsException) {
      return new Response('Client does not exists', { status: 404 });
    }
    if (error instanceof InconsistentTransactionException || error instanceof InvalidPayloadException) {
      return new Response(error.message, { status: 422 });
    }
    return new Response('Internal server error', { status: 500 });
  }
}

// export async function getAll(context: any) {
//   const result = await getAllClients();
//   return new Response(JSON.stringify(result), { status: 200 });
// }

// export async function getClientByIdController(context: any) {
//   const result = await getClientById(context.params.id);
//   return new Response(JSON.stringify(result), { status: 200 });
// }

export class ClientDoesNotExistsException extends Error {
  constructor() {
    super('Client does not exists');
  }
}

export class InconsistentTransactionException extends Error {
  constructor() {
    super('Inconsistent transaction');
  }
}

export class InvalidPayloadException extends Error {
  constructor(detail: string) {
    super(`Invalid payload: ${detail}`);
  }
}

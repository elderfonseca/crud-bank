import { connectionArgs, fromGlobalId } from 'graphql-relay';
import { GraphQLID } from 'graphql';

import { TransactionConnection, TransactionType } from './TransactionType';
import { TransactionLoader } from './TransactionLoader';

export const transactionField = (key: string) => ({
  [key]: {
    type: TransactionType,
    description: 'Returns a transaction by ID',
    resolve: async (obj: Record<string, unknown>, _, context) => TransactionLoader.load(context, obj.transaction as string),
  },
});

export const transactionConnectionFiled = (key: string) => ({
  [key]: {
    type: TransactionConnection.connectionType,
    description: 'Returns a connection of transactions',
    args: {
      ...connectionArgs,
    },
    resolve: async (_, args, context) => {
      return await TransactionLoader.loadAll(context, args);
    },
  },
});

export const transactionQueryField = {
  transaction: {
    type: TransactionType,
    description: 'Returns a transaction by ID',
    args: {
      id: {
        type: GraphQLID,
        description: 'The global ID of the transaction',
      },
    },
    resolve: (_, args, context) => {
      const { id } = fromGlobalId(args.id);
      return TransactionLoader.load(context, id);
    },
  },
  transactions: {
    type: TransactionConnection.connectionType,
    description: 'Returns a list of all ctransactions',
    args: {
      ...connectionArgs,
    },
    resolve: async (_, args, context) => {
      return await TransactionLoader.loadAll(context, args);
    },
  },
};

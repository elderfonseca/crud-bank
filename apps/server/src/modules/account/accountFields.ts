import { connectionArgs, fromGlobalId } from 'graphql-relay';
import { GraphQLID } from 'graphql';

import { AccountType, AccountConnection } from './AccountType';
import { AccountLoader } from './AccountLoader';

export const accountField = (key: string) => ({
  [key]: {
    type: AccountType,
    description: 'Returns an account by ID',
    resolve: async (obj: Record<string, unknown>, _, context) => AccountLoader.load(context, obj.account as string),
  },
});

export const accountConnectionField = (key: string) => ({
  [key]: {
    type: AccountConnection.connectionType,
    description: 'Returns a connection of accounts',
    args: {
      ...connectionArgs,
    },
    resolve: async (_, args, context) => {
      return await AccountLoader.loadAll(context, args);
    },
  },
});

export const accountQueryField = {
  account: {
    type: AccountType,
    description: 'Returns an account by ID',
    args: {
      id: {
        type: GraphQLID,
        description: 'The globlal ID of the account',
      },
    },
    resolve: (_, args, context) => {
      const { id } = fromGlobalId(args.id);
      return AccountLoader.load(context, id);
    },
  },
  accounts: {
    type: AccountConnection.connectionType,
    description: 'Returns a list of all accounts',
    args: {
      ...connectionArgs,
    },
    resolve: async (_, args, context) => {
      return await AccountLoader.loadAll(context, args);
    },
  },
};

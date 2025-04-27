import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLID } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';

import { registerTypeLoader } from '../node/typeRegister';
import { nodeInterface } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';
import { IAccount } from './AccountModel';

const AccountType = new GraphQLObjectType<IAccount>({
  name: 'Account',
  description: 'Represents a bank account',
  fields: () => ({
    id: globalIdField('Account'),
    _id: {
      type: GraphQLID,
      description: 'MongoDB ObjectID',
      resolve: (account) => account._id.toString(),
    },
    name: {
      type: GraphQLString,
      description: 'Account owner name',
      resolve: (account) => account.name,
    },
    balance: {
      type: GraphQLFloat,
      description: 'Current account balance',
      resolve: (account) => account.balance,
    },
    createdAt: {
      type: GraphQLString,
      description: 'Creation date of the account',
      resolve: (account) => account.createdAt.toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      description: 'Last update date of the account',
      resolve: (account) => account.updatedAt.toISOString(),
    },
  }),
  interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
  name: 'Account',
  nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };

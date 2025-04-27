import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { accountField } from './../account/accountFields';
import { TransactionLoader } from './TransactionLoader';
import { ITransaction } from './TransactionModel';

const TransactionType = new GraphQLObjectType<ITransaction>({
  name: 'Transaction',
  description: 'Represents a transaction between two accounts',
  fields: () => ({
    id: globalIdField('Transaction'),
    _id: {
      type: GraphQLID,
      description: 'MongoDB ObjectID',
      resolve: (transaction) => transaction._id.toString(),
    },
    ...accountField('fromAccount'),
    ...accountField('toAccount'),
    amount: {
      type: GraphQLString,
      description: 'Transaction amount',
      resolve: (transaction) => transaction.amount,
    },
    description: {
      type: GraphQLString,
      description: 'Transaction description',
      resolve: (transaction) => transaction.description,
    },
    createdAt: {
      type: GraphQLString,
      description: 'When the transaction was created',
      resolve: (transaction) => transaction.createdAt.toISOString(),
    },
  }),
  interfaces: () => [nodeInterface],
});

const TransactionConnection = connectionDefinitions({
  name: 'Transaction',
  nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };

import { GraphQLObjectType } from 'graphql';

import { transactionMutations } from '../modules/transaction/mutations/transactionMutations';
import { messageMutations } from '../modules/message/mutations/messageMutations';
import { accountMutations } from '../modules/account/mutations/accountMutations';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...messageMutations,
    ...accountMutations,
    ...transactionMutations,
  }),
});

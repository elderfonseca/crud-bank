import { GraphQLObjectType } from 'graphql';

import { transactionQueryField } from '../modules/transaction/transactionFields';
import { messageConnectionField } from '../modules/message/messageFields';
import { accountQueryField } from '../modules/account/accountFields';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...messageConnectionField('messages'),
    ...accountQueryField,
    ...transactionQueryField,
  }),
});

import { GraphQLString, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { accountField } from '../accountFields';
import { Account } from '../AccountModel';

export type AccountCreateInput = {
  name: string;
  initialBalance?: number;
};

const mutation = mutationWithClientMutationId({
  name: 'AccountCreate',
  description: 'Create a new account',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Account owner name',
    },
    initialBalance: {
      type: GraphQLFloat,
      description: 'Initial account balance',
      defaultValue: 0,
    },
  },
  mutateAndGetPayload: async (args: AccountCreateInput) => {
    const account = await new Account({
      name: args.name,
      balance: args.initialBalance || 0,
    }).save();

    return {
      account: account._id.toString(),
      error: null,
    };
  },
  outputFields: {
    ...accountField('account'),
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export const AccountCreateMutation = {
  ...mutation,
};

import { GraphQLFloat, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { redisPubSub } from './../../pubSub/redisPubSub';
import { transactionField } from '../transactionFields';
import { Account } from '../../account/AccountModel';
import { Transaction } from '../TransactionModel';

export type TranserInput = {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
};

const mutation = mutationWithClientMutationId({
  name: 'Transfer',
  description: 'Transfer money from one account to another',
  inputFields: {
    fromAccount: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The account from which to transfer money',
    },
    toAccount: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The account to which to transfer money',
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The amount to transfer',
    },
    description: {
      type: GraphQLString,
      description: 'Optional description of the transaction',
    },
  },
  mutateAndGetPayload: async (args: TranserInput) => {
    const { fromAccount: fromGlobalID, toAccount: toGlobalId, amount, description } = args;

    // Validate if the amount is positive
    if (amount <= 0) {
      return {
        error: 'Amout must be greater than zero',
      };
    }

    // Extract IDs
    const { id: fromId } = fromGlobalId(fromGlobalID);
    const { id: toId } = fromGlobalId(toGlobalId);

    // Verify if the counts are different
    if (fromId === toId) {
      return {
        error: 'Cannot transfer to the same account',
      };
    }

    try {
      // Verify if the origin account has a sufficient balance
      const fromAccount = await Account.findOne({ _id: fromId });

      if (!fromAccount) {
        return {
          error: 'Source account not found',
        };
      }

      if (fromAccount.balance < amount) {
        return {
          error: 'Insufficient balance',
        };
      }

      // Verify if the destination account exists
      const toAccount = await Account.findOne({ _id: toId });

      if (!toAccount) {
        return {
          error: 'Destination account not found',
        };
      }

      // Update the balance of the accounts
      await Account.updateOne({ _id: fromId }, { $inc: { balance: -amount } });

      await Account.updateOne({ _id: toId }, { $inc: { balance: amount } });

      // Create the register of the transaction
      const transaction = await new Transaction({
        fromAccount: fromId,
        toAccount: toId,
        amount,
        description,
      }).save();

      // Send event to subscriptions
      if (PUB_SUB_EVENTS.TRANSACTION?.CREATED) {
        redisPubSub.publish(PUB_SUB_EVENTS.TRANSACTION.CREATED, {
          transaction: transaction._id.toString(),
        });
      }

      return {
        transaction: transaction._id.toString(),
        error: null,
      };
    } catch (error) {
      return {
        error: `Transaction failed: ${error.message}`,
      };
    }
  },
  outputFields: {
    ...transactionField('transaction'),
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export const TransferMutation = {
  ...mutation,
};

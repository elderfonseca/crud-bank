import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<ITransaction>(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      description: 'The account from which the money was sent',
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      description: 'The account to which the money was sent',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      description: 'The amount trasferred',
    },
    description: {
      type: String,
      description: 'Optinonal description of the transaction',
    },
  },
  {
    collection: 'Transactions',
    timestamps: true,
  },
);

export type ITransaction = {
  fromAccount: mongoose.Types.ObjectId;
  toAccount: mongoose.Types.ObjectId;
  amount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model('Transaction', Schema);

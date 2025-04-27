import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IAccount>(
  {
    name: {
      type: String,
      required: true,
      description: 'The name of the account owner',
      trim: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      description: 'The current balance of the account',
    },
  },
  {
    collection: 'Account',
    timestamps: true,
  },
);

export type IAccount = {
  name: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
} & Document;

export const Account: Model<IAccount> = mongoose.model('Account', Schema);

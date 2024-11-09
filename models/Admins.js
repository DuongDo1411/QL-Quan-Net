// Model for Admins

import mongoose, { model, Schema } from 'mongoose';

const AdminsSchema = new Schema({
  Id: { type: Number, required: true },
  Email: { type: String, required: true },
}, { timestamps: true });

export const Admins = model('Admins', AdminsSchema);


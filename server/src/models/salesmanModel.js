import mongoose from 'mongoose';

const salesmanSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  branch: {
    type: String,
    enum: ["Myra Fashion LLC","Sameera Star Fashion LLC"],
    required: [true, 'Branch is required'],
    default: "Myra Fashion LLC"
  },
  phone: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    enum: ["North", "South", "East", "West"],
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  plainPassword: {
    type: String,
    required: [true, 'Plain password is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Salesman = mongoose.model('Salesman', salesmanSchema);

export default Salesman;


import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
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
  shift: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
    trim: true
  },
  warehouse: {
    type: String,
    enum: ["WH-001 (Main)", "WH-002 (West)"],
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

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;
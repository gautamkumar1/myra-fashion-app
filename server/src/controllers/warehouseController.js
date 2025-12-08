import bcrypt from 'bcrypt';
import Warehouse from '../models/warehouseModel.js';

export const warehouseLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
  
      const warehouse = await Warehouse.findOne({ email: email.toLowerCase() });
  
      if (!warehouse) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, warehouse.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Warehouse login successful',
        warehouse: {
          id: warehouse.id,
          name: warehouse.name,
          email: warehouse.email
        }
      });
    } catch (error) {
      console.error('Warehouse login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
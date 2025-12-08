import bcrypt from 'bcrypt';
import Admin from '../models/adminModel.js';

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    const admin = new Admin({
      email: 'admin@gmail.com',
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

export default seedAdmin;


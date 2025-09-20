import User from './userModel.js';

const setupAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });
    if (!adminExists) {
      console.log('No admin account found. Creating one...');
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'Admin'
      });
      console.log('Admin account created successfully.');
    }
  } catch (error) {
    console.error('Error setting up admin account:', error);
  }
};

export default setupAdmin;
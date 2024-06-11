import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../repositories/userRepository.js';
import generateToken from '../utils/generateToken.js';
import TelegramChat from '../utils/sendTelegramNotification.js';

export const registerUser = async (email, phone, name, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ email, phone, name, password: hashedPassword });

  await TelegramChat.initializeTelegramBot();
  await TelegramChat.sendTelegramNotification(process.env.ADMIN_TELEGRAM_USERNAME, `New user registered:\nName: ${name}\nEmail: ${email}`);

  return newUser;
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  const token = generateToken(user._id, user.role);
  return { user, token };
};

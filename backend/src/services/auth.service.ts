import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js';
import type { AuthUser } from '../types/auth.js';
import { HttpError } from '../utils/http-error.js';

export function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new HttpError(500, 'JWT_SECRET is not defined');
  }

  return jwtSecret;
}

export function toAuthUser(user: { _id: unknown; username: string; email: string; createdAt: Date }): AuthUser {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}

export async function getUserById(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new HttpError(401, 'Invalid or expired token');
  }

  return toAuthUser(user);
}

function createToken(userId: string) {
  return jwt.sign({ sub: userId }, getJwtSecret(), {
    expiresIn: '7d'
  });
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase();
  const existingUser = await User.findOne({
    $or: [{ email }, { username: input.username }]
  });

  if (existingUser) {
    throw new HttpError(409, 'Username or email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    username: input.username,
    email,
    passwordHash
  });

  const authUser = toAuthUser(user);

  return {
    user: authUser,
    token: createToken(authUser.id)
  };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email.toLowerCase() });

  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const authUser = toAuthUser(user);

  return {
    user: authUser,
    token: createToken(authUser.id)
  };
}

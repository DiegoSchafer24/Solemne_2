import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User, type PlayerControls, type UserDocument } from '../models/User.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js';
import type { AuthUser } from '../types/auth.js';
import { HttpError } from '../utils/http-error.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"PixelClash" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Bienvenido a PixelClash - Verifica tu cuenta',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <h1 style="color: #333;">¡Bienvenido a PixelClash!</h1>
        <p>Gracias por registrarte. Solo falta un paso para activar tu cuenta.</p>
        <p>Usa el siguiente código para verificar tu correo electrónico:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px; margin: 20px 0; padding: 10px; border: 1px dashed #ccc; background-color: #fff;">${code}</p>
        <p>Este código expirará en 10 minutos.</p>
        <p style="font-size: 0.9em; color: #777;">Si no solicitaste este registro, puedes ignorar este correo.</p>
      </div>`
  });
}

export function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new HttpError(500, 'JWT_SECRET no definido');
  }

  return jwtSecret;
}

export function toAuthUser(user: { _id: unknown; username: string; email: string; createdAt: Date; onlineControls?: any; countryCode?: string }): AuthUser {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    onlineControls: user.onlineControls,
    countryCode: user.countryCode
  };
}

export async function getUserById(userId: string) {
  const user = await User.findById<UserDocument>(userId);

  if (!user) {
    throw new HttpError(401, 'Token invalido o expirado');
  }

  return toAuthUser(user);
}

function createToken(userId: string) {
  return jwt.sign({ sub: userId }, getJwtSecret(), {
    expiresIn: '7d'
  });
}

async function getCountryCodeFromIp(ip: string | undefined): Promise<string | undefined> {
  // Para pruebas locales, si la IP es localhost, usamos una IP pública de Chile.
  const testIp = process.env.TEST_IP;
  if (!ip || ip.includes('127.0.0.1') || ip === '::1') {
    ip = testIp || undefined;
  }

  try {
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
    const geoData = await geoResponse.json();
    if (geoData.status === 'success' && geoData.countryCode) {
      return geoData.countryCode;
    }
  } catch (geoError) {
    console.error('Could not fetch geolocation data:', geoError);
  }

  return undefined;
}

export async function registerUser(input: RegisterInput, ip: string | undefined) {
  const email = input.email.toLowerCase();
  const existingUser = await User.findOne<UserDocument>({
    $or: [{ email }, { username: input.username }]
  });

  if (existingUser) {
    throw new HttpError(409, 'Nombre de usuario y/o correo electrónico ya en uso');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const newUserPayload: Partial<UserDocument> = {
    username: input.username,
    email,
    passwordHash,
    verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000)
  };

  const countryCode = await getCountryCodeFromIp(ip);
  if (countryCode) {
    newUserPayload.countryCode = countryCode;
  }

  const user = await User.create(newUserPayload);

  try {
    if (!user.verificationCode) {
      throw new Error('Código de verificación no encontrado para el nuevo usuario.');
    }
    await sendVerificationEmail(user.email, user.verificationCode);
  } catch (error) {
    console.error('Error sending verification email:', error);
    await User.deleteOne({ _id: user._id });
    throw new HttpError(500, 'No se pudo enviar el correo electrónico de verificación. Inténtalo de nuevo más tarde.');
  }

  return { message: 'Usuario registrado. Por favor revisa tu correo electrónico para verificar tu cuenta.' };
}

export async function loginUser(input: LoginInput, ip: string | undefined) {
  const login = input.login.toLowerCase();
  const user = await User.findOne<UserDocument>({
    $or: [{ email: login }, { username: login }]
  });

  if (!user) {
    throw new HttpError(401, 'Correo electrónico o contraseña invalidos');
  }

  if (!user.isVerified) {
    throw new HttpError(403, 'Cuenta no verificada. Por favor revisa tu correo electrónico.');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new HttpError(401, 'Correo electrónico o contraseña invalidos');
  }

  if (!user.countryCode) {
    const countryCode = await getCountryCodeFromIp(ip);
    if (countryCode) {
      user.countryCode = countryCode;
      await user.save();
    }
  }

  const authUser = toAuthUser(user);

  return {
    user: authUser,
    token: createToken(authUser.id)
  };
}

export async function verifyUser(email: string, verificationCode: string) {
  const user = await User.findOne<UserDocument>({ email: email.toLowerCase() });

  if (!user) {
    throw new HttpError(400, 'Petición de verificación invalida');
  }

  if (user.isVerified) {
    return { message: 'Account already verified.' };
  }

  if (user.verificationCode !== verificationCode) {
    throw new HttpError(400, 'Codigo de verificación invalido.');
  }

  if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
    throw new HttpError(400, 'Codigo de verificación expirado.');
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return { message: 'Account verified successfully.' };
}

export async function updateOnlineControls(userId: string, controls: PlayerControls) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { onlineControls: controls } },
    { new: true }
  );

  if (!user) {
    throw new HttpError(404, 'Usuario no encontrado');
  }

  return { message: 'Controles actualizados correctamente.' };
}

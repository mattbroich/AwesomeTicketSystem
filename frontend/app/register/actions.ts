'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { PrismaClient } from "@/lib/generated/prisma";
import { signUpSchema } from './validate'
import { createSessionAndCookie } from '../api/auth/actions'
import { v4 as uuidv4 } from 'uuid';

const db = new PrismaClient();

export async function signUp(formData: FormData, referenceId: string) {
  // Perform server-side validation
  const validatedFields = signUpSchema.safeParse({
    id: formData.get('id'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  // Return errors if there are any
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      errors: {
        email: ['User with this email already exists'],
      },
    }
  }

  let reference = {};

  if (referenceId) {
    const existingReference = await db.reference.findUnique({
      where: { uuid: referenceId },
    });
    if (!existingReference) {
      return {
        errors: {
          reference: ['Reference not found'],
        },
      }
    }

    reference = existingReference;
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: {
      email,
      hash: passwordHash,
      isActive: true,
      reference: reference
    },
    include: {
      reference: true
    }
  })

  // Create session, allowing the user to be immediately signed in
  await createSessionAndCookie(uuidv4(), user.id.toString())

  // Redirect the user to the protected route
  redirect('/collections')
}
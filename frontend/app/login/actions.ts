'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@/lib/generated/prisma'
import { signInSchema } from './validate'
import { createSessionAndCookie } from '../api/auth/actions'
import { v4 as uuidv4 } from 'uuid';

const db = new PrismaClient();

export async function signIn(formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  
  // Check if user exists and password matches
  const user = await db.user.findFirst({
    where: { email: email },
  })

  if (!user || !user.hash  || !(await bcrypt.compare(password, user.hash))) {
    return {
      errors: {
        email: ['Invalid email or password'],
      },
    }
  }

  if (!user.id) {
    return {
      errors: {
        email: ['User ID not found'],
      },
    }
  }

  // Create session
  await createSessionAndCookie(uuidv4(), user.id.toString());

  redirect('/collections')
}
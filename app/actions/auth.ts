import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  // ...
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const userCheck = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (userCheck) {
    return {
      errors: {
        email: ["Email already exists."],
      },
    };
  }

  // 3. Insert the user into the database or call an Auth Library's API
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // The user object is already returned by prisma.user.create

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}

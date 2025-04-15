import { AuthFormSchema, FormState } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { createSession } from "@/app/lib/session";
// import { cookies } from "next/headers";
import { deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export async function logout() {
  deleteSession();
  redirect("/login");
}

export async function formAuth(state: FormState, formData?: FormData) {
  // 1. Validate form fields
  const validatedFields = AuthFormSchema.safeParse({
    login: formData?.get("login"),
    name: formData?.get("name"),
    email: formData?.get("email"),
    password: formData?.get("password"),
    confirmpassword: formData?.get("confirmpassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { login, name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (login === "true") {
    if (!userCheck) {
      return {
        errors: { email: ["Email not found."] },
      };
    }

    const isPasswordValid =
      userCheck.password &&
      (await bcrypt.compare(password, userCheck.password));
    if (!isPasswordValid) {
      return {
        errors: { password: ["Invalid password."] },
      };
    }

    // 4. Create user session
    await createSession(userCheck.id);

    // 5. Redirect user
    redirect("/profile");
  }

  if (login === "false") {
    if (userCheck) {
      return {
        errors: { email: ["Email already exists."] },
      };
    }

    // 3. Insert the user into the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    if (!user) {
      return {
        message: "An error occurred while creating your account.",
      };
    }

    // 4. Create user session
    await createSession(user.id);

    // 5. Redirect user
    redirect("/profile");
  }
}

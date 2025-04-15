// import { AuthFormSchema, FormState } from "@/app/lib/definitions";
// import bcrypt from "bcryptjs";
// import prisma from "../lib/prisma";
// import { createSession } from "@/app/lib/session";
// import { cookies } from "next/headers";
import { deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export async function logout() {
  deleteSession();
  redirect("/login");
}

// export async function formAuth(state: FormState, formData?: FormData) {
//   const processedData: Record<string, string> = {};
//   formData?.forEach((value, key) => {
//     processedData[key] = value ? value.toString() : "";
//   });

//   const validatedFields = AuthFormSchema.safeParse({
//     login: processedData["login"],
//     name: processedData["name"],
//     email: processedData["email"],
//     password: processedData["password"],
//     confirmpassword: processedData["confirmpassword"],
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   const { login, name, email, password } = validatedFields.data;

//   if (login === "false") {
//     if (!name || name.length < 2) {
//       return {
//         errors: { name: ["Name must be at least 2 characters long."] },
//       };
//     }

//     const userExists = await prisma.user.findUnique({ where: { email } });
//     if (userExists) {
//       return {
//         errors: { email: ["Email already exists."] },
//       };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await prisma.user.create({
//       data: { name, email, password: hashedPassword },
//     });

//     if (!newUser) {
//       return {
//         errors: { message: "Failed to create account." },
//       };
//     }

//     await createSession(newUser.id);
//     redirect("/dashboard");
//   } else {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return {
//         errors: { email: ["Email not found."] },
//       };
//     }

//     const isPasswordValid =
//       user.password && (await bcrypt.compare(password, user.password));
//     if (!isPasswordValid) {
//       return {
//         errors: { password: ["Invalid password."] },
//       };
//     }

//     await createSession(user.id);
//     redirect("/dashboard");
//   }
// }

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { pages } from "next/dist/build/templates/app-page";
import { signIn } from "next-auth/react";

const client = new PrismaClient();

// Password validation schema
const passwordSchema = z.string().min(6).max(50).refine(
  (val) => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,50}$/.test(val),
  {
      message: "Password must contain at least one uppercase letter, one number, and one special character"
  }
);

// General schema for credentials validation
const schema = z.object({
  email: z.string().email(),
  firstname: z.string().min(3).max(30), 
  password: passwordSchema,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        firstname: { label: "FirstName", type: "text", placeholder: "John Doe" }, 
        email: { label: "Email", type: "text", placeholder: "johndoe@gmail.com" },
        password: { label: "Password", type: "password", required: true },
        otp: { label: "otp", type: "text", placeholder: "Enter the OTP", required: true },
      },
      
      async authorize(credentials: any) {
        // Validate credentials using Zod
        try {
          schema.parse({
            email: credentials.email,
            firstname: credentials.firstname,
            password: credentials.password,
          });
        } catch (e) {
          console.error("Validation error: ", e);
          throw new Error("Invalid credentials");
        }

        // Check if user exists
        const existingUser = await client.user.findFirst({
          where: { email: credentials.email },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              firstname: existingUser.firstname, // Corrected typo here
              email: existingUser.email,
            };
          }
          return null;
        }

        // Create a new user
        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const user = await client.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              firstname: credentials.firstname, // Corrected typo here
            },
          });

          return {
            id: user.id.toString(),
            name: user.firstname, 
            email: user.email,
          };
        } catch (e) {
          console.error("Error creating user:", e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: { token: any; session: any }) {
      session.user.id = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },
  // pages: {
  //   signIn: "/signin"
  // }
};

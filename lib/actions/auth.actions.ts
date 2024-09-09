import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import z from "zod";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const passwordSchema = z.string().min(6).max(50).refine(
  (val) => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,50}$/.test(val),
  {
    message: "Password must contain at least one uppercase letter, one number, and one special character",
  }
);

const schema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  firstname: z.string().min(10).max(30),
  password: passwordSchema,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jhondoe@gmail.com" },
        phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
        password: { label: "Password", type: "password", required: true },
        otp: { label: "otp", type: "text", placeholder: "Enter the opt", required: true },

      },
      
      async authorize(credentials: any) {
        // Validate credentials using Zod
        try {
          schema.parse({
            email: credentials.email,
            phone: credentials.phone,
            firstname: credentials.firstname,
            password: credentials.password,
          });
        } catch (e) {
          // Handle Zod validation error
          console.error("Validation error:", e);
          throw new Error("Invalid credentials");
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await client.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              firstname: existingUser.fristname,
              email: existingUser.email, // Should use email here
            };
          }
          return null; 
        }

        // Create new user
        try {
          const user = await client.user.create({
            data: {
              email: credentials.email, // Add email field
              number: credentials.phone,
              password: hashedPassword,
              fristname: credentials.firstname,
            },
          });

          return {
            id: user.id.toString(),
            name: user.fristname,
            email: user.email,
          };
        } catch (e) {
          console.error(e);
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
  },
};

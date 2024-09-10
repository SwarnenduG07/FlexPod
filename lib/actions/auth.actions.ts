import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import z from "zod";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

// Password validation schema
const passwordSchema = z.string().min(6).max(50).refine(
  (val) => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,50}$/.test(val),
  {
    message: "Password must contain at least one uppercase letter, one number, and one special character",
  }
);

// General schema for credentials validation
const schema = z.object({
  email: z.string().email(),
  number: z.string().min(10).max(15),
  firstname: z.string().min(3).max(30), // Changed minlength to 3 for firstname
  password: passwordSchema,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        firstname: { label: "FirstName", type: "text", placeholder: "John Doe" }, // Corrected placeholder
        email: { label: "Email", type: "text", placeholder: "johndoe@gmail.com" },
        number: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
        password: { label: "Password", type: "password", required: true },
        otp: { label: "otp", type: "text", placeholder: "Enter the OTP", required: true },
      },
      
      async authorize(credentials: any) {
        // Validate credentials using Zod
        try {
          schema.parse({
            email: credentials.email,
            number: credentials.number,
            firstname: credentials.firstname,
            password: credentials.password,
          });
        } catch (e) {
          console.error("Validation error:", e);
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
              number: credentials.number,
              password: hashedPassword,
              firstname: credentials.firstname, // Corrected typo here
            },
          });

          return {
            id: user.id.toString(),
            name: user.firstname, // Corrected typo here
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
      // Ensure the redirect URL is valid, or default to dashboard
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },
};

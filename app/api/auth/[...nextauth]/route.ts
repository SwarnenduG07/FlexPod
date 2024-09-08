import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'email', type: 'text', placeholder: 'email' },
          password: { label: 'password', type: 'password', placeholder: 'password' },
          OTP: { label: 'OTP', type: 'OTP', placeholder: 'Enter your Otp' },
        },
        async authorize(credentials) {
            const hashedPassword = await bcrypt.hash(credentials?.password, 10);
            const existingUser = await db.USer.findFirst({
                
            })
            console.log(credentials);
             
            return {
                id: "user1"
            };
        },
      })
  ],
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
import { authOptions } from "@/lib/actions/auth.actions"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
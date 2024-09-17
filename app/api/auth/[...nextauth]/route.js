import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { saveOrUpdateUser } from "@/lib/userService";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          // Use the utility function to save or update the user
          const dbUser = await saveOrUpdateUser(profile);

          // Add the user ID and username to the user object
          user.id = dbUser._id;
          user.username = profile.login;
        } catch (error) {
          console.error("Error saving user to database:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.username = token.username;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (profile) {
        token.username = profile.login;
      }
      return token;
    },
  },
  pages: {
    signIn: "/access",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

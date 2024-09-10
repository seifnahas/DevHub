// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email" },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Attach the username to the session object
      if (token?.username) {
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Save the username in the token
      if (profile) {
        token.username = profile.login; // GitHub login (username)
      }
      return token;
    },
  },
  pages: {
    signIn: "/access", // Define your custom sign-in page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

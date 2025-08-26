import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByUsername } from "./db";
import { User } from './types';
import { compare } from "bcryptjs";

export const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<User | null> {
                if (!credentials || typeof credentials.username !== 'string' || typeof credentials.password !== 'string') {
                    return null;
                }
                const user = await getUserByUsername(credentials.username);
                if (user && await compare(credentials.password, user.password)) {
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        password: user.password,
                        cardsDetails:user.cardsDetails
                    };
                } else {
                    return null;
                }
            }
        })
    ],
};

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth(options);

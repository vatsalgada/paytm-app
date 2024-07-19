import GoogleProvider from "next-auth/providers/google";

//console.log(process.env.JWT_SECRET);
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || ""
        })
    ],
  }
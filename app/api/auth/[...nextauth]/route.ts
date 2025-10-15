import NextAuth, { Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectionToDB } from "@utils/database";
import User from "@models/user";
interface GoogleProfile extends Profile {
  picture?: string;
}
const handler  = NextAuth({
    
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            })
    ], 
    callbacks:{
        async session({session}){
            const sessionUser = await User.findOne({email:session.user?.email});
             (session.user as any).id = sessionUser?._id.toString(); // _id mongoose ka hota hai to string me convert karna parta hai
            return session;

        },
        async signIn({profile}){
            //serverless function lamda function yeh tabhi open hoga jab call kia jae ga  jae ga server ke pass and db se connect hoke user le ay ga
            const userProfile = profile as GoogleProfile ;
            try {
                await connectionToDB();
                // checkuser already exists
                const userExists = await User.findOne({email:profile?.email});
                // if not then create a new user
                if(!userExists){   
                    const rawName = profile?.name?.replace(/\s+/g, "").toLowerCase() || "user";
                    const usernameN = (rawName.length < 4 ? rawName + "user" : rawName).slice(0, 16) + Math.floor(Math.random() * 1000);
                    await User.create({
                        email:profile?.email,
                        username:usernameN,
                        image:userProfile?.picture,
                    });
                }
                // checkCreate a new user
                return true;
            } catch (error) {
                console.log('Error checking if user exists: ',error);
                return false;
            }
        }
    }
})

export {handler as GET, handler as POST};
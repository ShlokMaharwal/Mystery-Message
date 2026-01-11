import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect():Promise<void>{
    if (connection.isConnected){
        console.log("Already connected to database");
        return
    }

    try{
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const db = await mongoose.connect(mongoUri, {
            retryWrites: true,
            w: "majority"
        })

        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully with URI:", mongoUri.substring(0, 50) + "...");

    }catch(error){
        console.error("DB connection failed", error);
        throw error;
    }
}

export default dbConnect;
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectDb = async () => {
    try{
            mongoose.connection.on('connected', () =>{
            console.log('database connected succesfully')
        });
        await mongoose.connect(process.env.MONGO_DB_URI)
    }
    catch(error){
        console.error('error connecting to mongoDB', error)
        process.exit(1)
    }
 
};

export default connectDb;
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
export const connectMongodb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("mongodb connect success");
  } catch (error) {
    console.log(error);
  }
};

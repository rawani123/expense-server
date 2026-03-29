import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");

    // TTL index — auto-delete expenses older than 60 days
    const Expense = mongoose.model("Expense");
    await Expense.collection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: 5184000 }
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
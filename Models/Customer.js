import mongoose from "mongoose";

// Define Customer schema
const CustomerSchema = mongoose.Schema({
  email: { type: String, required: true},
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
});

// Create model based on the schema
const CustomerModel = mongoose.model("Customer_db", CustomerSchema, "Customer_db");

export default CustomerModel;

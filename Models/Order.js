import mongoose from "mongoose";

// Define Order schema
const OrderSchema = mongoose.Schema({
  req_name: { type: String, required: true},
  rec_name: { type: String, required: true },
  sdate: { type: String, required: true },
  rdate: { type: String, required: true },
  paddress: { type: String, required: true },
  daddress: { type: String, required: true },
  req_phone: { type: Number, required: true },
  rec_phone: { type: Number, required: true },
  fee: { type: String, required: true },
  p_type: { type: String, required: true },
  note: { type: String},
  urgent: { type: String},
  o_status: { type: String},
  o_location: { type: String},
});

// Create model based on the schema
const OrderModel = mongoose.model("Order_db", OrderSchema, "Order_db");

export default OrderModel;
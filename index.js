import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import CustomerModel from "./Models/Customer.js";
import OrderModel from "./Models/Order.js";

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body

// MongoDB connection string
const conStr ="mongodb+srv://Admin:1234@cluster0.uqlhn.mongodb.net/ST_Project?retryWrites=true&w=majority&appName=Cluster0";
// mongoose.connect(conStr);
mongoose
  .connect(conStr, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.post("/insertCustomer", async (req, res) => {
  try {
    const customer = await CustomerModel.findOne({ email: req.body.email });
    if (customer) {
      res.send("User Exists..");
      console.log(req.body);
      console.log(customer);
    } else {
      const hpass = await bcrypt.hash(req.body.password, 10);
      const newcustomer = new CustomerModel({
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        password: hpass,
      });
      await newcustomer.save();
      res.send("Customer Added..");
    }
  } catch (error) {}
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // updated to match frontend names
    const customer = await CustomerModel.findOne({ email: req.body.email });
    if (!customer) {
      return res.status(500).json({ message: "Customer not found." });
    }

    const passMatch = await bcrypt.compare(
      req.body.password,
      customer.password
    );
    if (passMatch) {
      return res.status(200).json({ customer: customer, message: "success" });
    } else {
      return res.status(401).json({ message: "Authorization Failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.post("/logout", (req, res) => {
  try {
    // Send a success message for the logout
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/addOrder", async (req, res) => {
    try{
        const neworder=new OrderModel({
          req_name:req.body.req_name,
          rec_name:req.body.rec_name,
          sdate:req.body.sdate,
          rdate:req.body.rdate,
          paddress:req.body.paddress,
          daddress:req.body.daddress,
          req_phone:req.body.req_phone,
          rec_phone:req.body.rec_phone,
          fee:req.body.fee,
          p_type:req.body.p_type,
          note:req.body.note,
          urgent:req.body.urgent,
          o_status: req.body.o_status,
          o_location: req.body.o_location,
        });
        await neworder.save();
        res.send("Order Added..");   
    }
    catch(error) {}
});

app.put("/updateOrder",async(req,res)=>{
  try{
    const id = req.body.orderID;
    const order = await OrderModel.findOne({_id:id});
    if(order)
    {
      order.sdate=req.body.sdate;
      order.rdate=req.body.rdate;
      order.req_phone=req.body.req_phone;
      order.rec_phone=req.body.rec_phone;
      order.o_status=req.body.o_status;
      order.o_location=req.body.o_location;
      await order.save();
      res.send("Order details Updated..");
    }else{
      req.send("Order not Found...");
    }
  }
  catch(error) {}
});

app.delete("/deleteOrder/:orderID",async(req,res)=>{
  try{
    const id = req.params.orderID;
    const delOrder = await OrderModel.findOneAndDelete({_id:id});
    if(delOrder)
      res.send({message:'Order Deleted..'});
    else
      res.send({message:'Order Not Deleted..'});  
  }
  catch(error)
    {
        return res.status(500).json({message:error});
    }
});

app.get("/orders/:orderID", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderID);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/ordersByPhone/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const orders = await OrderModel.find({ req_phone: phone });
    if (orders && orders.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: "No orders found for this phone number" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Server listening on port 8080
app.listen(8080, () => {
  console.log("Server connected on port 8080...");
});
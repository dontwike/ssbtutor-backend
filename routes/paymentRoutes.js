const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const crypto = require("crypto"); // Ensure this is imported for signature verification
const { Router } = require("express");

dotenv.config();

const app = Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Route to create an order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route to verify payment
app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Construct the signature string
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate the expected signature using the secret key
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY) // Use env variable here
      .update(sign.toString())
      .digest("hex");

    // Compare the generated signature with the received signature
    if (razorpay_signature === expectedSign) {
      // Payment is verified
      res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, error: "Invalid payment signature" });
    }
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { app };

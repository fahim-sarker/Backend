
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    
    
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "paypal", "cod", "bkash", "nagad"],
      default: "cod",
    },

    paymentResult: {
      
      id: { type: String },
      status: { type: String },
      updateTime: { type: String },
      email: { type: String },
    },

    
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    orderStatus: {
      type: String,
      enum: [
        "pending", 
        "processing", 
        "shipped", 
        "delivered", 
        "cancelled", 
        "refunded", 
      ],
      default: "pending",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date, 
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date, 
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    notes: {
      type: String, 
      default: "",
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);


orderSchema.virtual("totalItems").get(function () {
  return this.orderItems.reduce((acc, item) => acc + item.quantity, 0);
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, 
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, 
    },

    role: {
      type: String,
      enum: ["customer", "admin"], 
      default: "customer", 
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "" },
    },

    avatar: {
      type: String,
      default: "default-avatar.jpg",
    },

    isActive: {
      type: Boolean,
      default: true, 
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
      },
    ],

    resetPasswordToken: String, 
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, 
  },
);





userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});




userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};




userSchema.virtual("fullInfo").get(function () {
  return `${this.name} (${this.email})`;
});

const User = mongoose.model("User", userSchema);
module.exports = User;

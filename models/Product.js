
const mongoose = require("mongoose");




const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true, 
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
  },
  { timestamps: true },
);


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
      
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: [true, "Category is required"],
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" }, 
      },
    ],

    
    thumbnail: {
      type: String,
      default: "default-product.jpg",
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    sold: {
      type: Number,
      default: 0, 
    },

    reviews: [reviewSchema], 

    
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false, 
    },

    isActive: {
      type: Boolean,
      default: true, 
    },

    tags: [String], 

    specifications: [
      {
        key: { type: String }, 
        value: { type: String }, 
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);




productSchema.virtual("discountPercent").get(function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});


productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});


productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});



productSchema.index({ name: "text", description: "text" }); 
productSchema.index({ category: 1 }); 
productSchema.index({ price: 1 }); 
productSchema.index({ createdAt: -1 }); 

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

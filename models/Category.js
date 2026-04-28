
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      
    },

    description: {
      type: String,
      default: "",
      maxlength: [200, "Description cannot exceed 200 characters"],
    },

    image: {
      type: String,
      default: "default-category.jpg",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    
    
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);




categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") 
      .replace(/-+/g, "-") 
      .replace(/^-|-$/g, ""); 
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

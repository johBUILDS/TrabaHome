// backend/models/Worker.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const workerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^09\d{9}$/, "Please provide a valid Philippine mobile number"],
    },

    // Optional profile image (separate from verification docs)
    profileImage: {
      type: String,
      default: null,
    },

    specialization: {
      type: String,
      enum: [
        "Carpenter",
        "Mason",
        "Plumber",
        "Electrician",
        "Cleaner",
        "Gardener",
        "General Repair",
      ],
      required: [true, "Specialization is required"],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: Number,
      default: 0,
      min: 0,
      max: 70,
    },

    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      barangay: { type: String, default: "" },
      coordinates: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
    },

    serviceArea: [
      {
        city: { type: String, default: "" },
      },
    ],

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Admin approval (final verification decision)
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Worker completes profile after AI passes
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    paymentInfo: {
      provider: { type: String, default: "" },
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
    },

    // AI-lite status (assistant validation; admin still decides)
    aiStatus: {
      type: String,
      enum: ["pending", "passed", "failed"],
      default: "pending",
    },
    aiIssues: {
      type: [String],
      default: [],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetCode: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    loginOtpCode: {
      type: String,
      select: false,
    },
    loginOtpExpires: {
      type: Date,
      select: false,
    },

    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline",
    },

    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "PHP" },
    },

    totalJobs: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },

    responseTime: {
      type: String,
      default: "24 hours",
    },

    // Verification docs (store URLs/paths)
    documents: {
      governmentId: { type: String, default: "" }, // uploaded valid ID image
      selfieImageUrl: { type: String, default: "" }, // uploaded selfie image
      businessPermit: { type: String, default: "" },
      certifications: { type: [String], default: [] },
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Hash password before saving (only when password is modified)
workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Compare entered password with hashed password
workerSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Worker", workerSchema);

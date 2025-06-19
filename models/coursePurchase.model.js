import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    amount: {
      type: Number,
      required: [true, "User reference is required"],
      min: [0, "amount must be non - negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      upperCase: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed", "refund"],
        message: "Please select a valid status ",
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
    },
    paymentId: {
      type: String,
      required: [true, "Payment ID is required"],
    },
    refundId: {
      type: String,
    },
    refundAmount: {
      type: Number,
      min: [0, "Refund amount must be non-negative"],
    },
    refundReason: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

coursePurchaseSchema.index({user: 1, course: 1})
coursePurchaseSchema.index({status: 1})
coursePurchaseSchema.index({createdAt: -1})

coursePurchaseSchema.virtual('isRefundable').get(function(){
    if (this.status !== 'completed') return false

    const thirtyDayAgo = new Date(Date.now() - 30*24*60*60*1000)
    return this.createdAt > thirtyDayAgo
})

// Refund Process
coursePurchaseSchema.methods.processRefund = async function(reason, amount) {
    this.status = 'refund'
    this.refundReason = reason
    this.refundAmount = amount || this.amount
}

export const CoursePurchase = mongoose.model(
  "CoursePurchase",
  coursePurchaseSchema
);

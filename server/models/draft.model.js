import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema(
  {
    // Use the same schema as Invoice, but make all fields optional
    sellerDetails: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      panNo: String,
      gstRegistrationNo: String,
    },
    placeOfSupply: String,
    billingDetails: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      stateUTCode: String,
    },
    shippingDetails: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      stateUTCode: String,
    },
    placeOfDelivery: String,
    orderDetails: {
      orderNo: String,
      orderDate: Date,
    },
    invoiceDetails: {
      invoiceNo: String,
      invoiceDate: Date,
    },
    reverseCharge: Boolean,
    items: [
      {
        description: String,
        unitPrice: Number,
        quantity: Number,
        discount: Number,
        taxRate: Number,
      },
    ],
    subtotal: Number,
    taxes: Number,
    total: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Draft", DraftSchema);

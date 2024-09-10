import { useState } from "react";
import PropTypes from "prop-types";
import { validateGSTIN, formatCurrency, numberToWords } from "../utils/helpers";
import ItemsList from "./ItemsList";

const InvoiceForm = ({ onInvoiceGenerated, onSaveDraft }) => {
  const [formData, setFormData] = useState({
    sellerDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      panNo: "",
      gstRegistrationNo: "",
    },
    placeOfSupply: "",
    billingDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      stateUTCode: "",
    },
    shippingDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      stateUTCode: "",
    },
    placeOfDelivery: "",
    orderDetails: { orderNo: "", orderDate: "" },
    invoiceDetails: { invoiceNo: "", invoiceDate: "" },
    reverseCharge: false,
    items: [
      { description: "", unitPrice: 0, quantity: 0, discount: 0, taxRate: 18 },
    ],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e, section, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
    if (errors[section] && errors[section][field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [section]: {
          ...prevErrors[section],
          [field]: null,
        },
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          description: "",
          unitPrice: 0,
          quantity: 0,
          discount: 0,
          taxRate: 18,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
    }));
  };

  const calculateItemTotals = (item) => {
    const netAmount = item.unitPrice * item.quantity - item.discount;
    const taxType =
      formData.placeOfSupply === formData.placeOfDelivery
        ? "CGST & SGST"
        : "IGST";
    const taxAmount = netAmount * (item.taxRate / 100);
    const totalAmount = netAmount + taxAmount;

    return {
      netAmount,
      taxType,
      taxAmount:
        taxType === "CGST & SGST"
          ? { CGST: taxAmount / 2, SGST: taxAmount / 2 }
          : { IGST: taxAmount },
      totalAmount,
    };
  };

  const calculateTotals = () => {
    return formData.items.reduce(
      (totals, item) => {
        const { netAmount, taxAmount, totalAmount } = calculateItemTotals(item);
        return {
          subtotal: totals.subtotal + netAmount,
          taxes:
            totals.taxes +
            (typeof taxAmount === "object"
              ? Object.values(taxAmount).reduce((a, b) => a + b, 0)
              : taxAmount),
          total: totals.total + totalAmount,
        };
      },
      { subtotal: 0, taxes: 0, total: 0 }
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate seller details
    if (!formData.sellerDetails.name)
      newErrors.sellerDetails = {
        ...newErrors.sellerDetails,
        name: "Seller name is required",
      };
    // if (!validateGSTIN(formData.sellerDetails.gstRegistrationNo))
    //   newErrors.sellerDetails = {
    //     ...newErrors.sellerDetails,
    //     gstRegistrationNo: "Invalid GSTIN",
    //   };

    // Validate billing details
    if (!formData.billingDetails.name)
      newErrors.billingDetails = {
        ...newErrors.billingDetails,
        name: "Billing name is required",
      };

    // Validate shipping details
    if (!formData.shippingDetails.name)
      newErrors.shippingDetails = {
        ...newErrors.shippingDetails,
        name: "Shipping name is required",
      };

    // Validate items
    if (formData.items.length === 0)
      newErrors.items = "At least one item is required";
    formData.items.forEach((item, index) => {
      if (!item.description)
        newErrors.items = {
          ...newErrors.items,
          [index]: {
            ...newErrors.items?.[index],
            description: "Description is required",
          },
        };
      if (item.unitPrice <= 0)
        newErrors.items = {
          ...newErrors.items,
          [index]: {
            ...newErrors.items?.[index],
            unitPrice: "Unit price must be greater than 0",
          },
        };
      if (item.quantity <= 0)
        newErrors.items = {
          ...newErrors.items,
          [index]: {
            ...newErrors.items?.[index],
            quantity: "Quantity must be greater than 0",
          },
        };
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const totals = calculateTotals();
      const invoiceData = {
        ...formData,
        ...totals,
        amountInWords: numberToWords(totals.total),
      };
      onInvoiceGenerated(invoiceData);
    }
  };

  const handleSaveDraft = () => {
    const totals = calculateTotals();
    const draftData = {
      ...formData,
      ...totals,
      amountInWords: numberToWords(totals.total),
    };
    onSaveDraft(draftData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seller Details */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Seller Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData.sellerDetails).map((field) => (
            <div key={field}>
              <input
                type="text"
                placeholder={
                  field
                    .replace(/([A-Z])/g, " $1")
                    .charAt(0)
                    .toUpperCase() + field.slice(1)
                }
                value={formData.sellerDetails[field]}
                onChange={(e) => handleChange(e, "sellerDetails", field)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.sellerDetails && errors.sellerDetails[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sellerDetails[field]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing Details */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Billing Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData.billingDetails).map((field) => (
            <div key={field}>
              <input
                type="text"
                placeholder={
                  field
                    .replace(/([A-Z])/g, " $1")
                    .charAt(0)
                    .toUpperCase() + field.slice(1)
                }
                value={formData.billingDetails[field]}
                onChange={(e) => handleChange(e, "billingDetails", field)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.billingDetails && errors.billingDetails[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.billingDetails[field]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Details */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData.shippingDetails).map((field) => (
            <div key={field}>
              <input
                type="text"
                placeholder={
                  field
                    .replace(/([A-Z])/g, " $1")
                    .charAt(0)
                    .toUpperCase() + field.slice(1)
                }
                value={formData.shippingDetails[field]}
                onChange={(e) => handleChange(e, "shippingDetails", field)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.shippingDetails && errors.shippingDetails[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingDetails[field]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Place of Supply and Delivery */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Place of Supply"
            value={formData.placeOfSupply}
            onChange={(e) => handleChange(e, "", "placeOfSupply")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Place of Delivery"
            value={formData.placeOfDelivery}
            onChange={(e) => handleChange(e, "", "placeOfDelivery")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Order and Invoice Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Order Number"
            value={formData.orderDetails.orderNo}
            onChange={(e) => handleChange(e, "orderDetails", "orderNo")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="date"
            value={formData.orderDetails.orderDate}
            onChange={(e) => handleChange(e, "orderDetails", "orderDate")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Invoice Number"
            value={formData.invoiceDetails.invoiceNo}
            onChange={(e) => handleChange(e, "invoiceDetails", "invoiceNo")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="date"
            value={formData.invoiceDetails.invoiceDate}
            onChange={(e) => handleChange(e, "invoiceDetails", "invoiceDate")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Items */}
      <ItemsList
        formData={formData}
        handleItemChange={handleItemChange}
        removeItem={removeItem}
        addItem={addItem}
        errors={errors}
      />

      {/* Reverse Charge */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.reverseCharge}
            onChange={(e) =>
              setFormData({ ...formData, reverseCharge: e.target.checked })
            }
            className="mr-2"
          />
          <span>Reverse Charge Applicable</span>
        </label>
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <p>Subtotal: {formatCurrency(calculateTotals().subtotal)}</p>
        <p>Taxes: {formatCurrency(calculateTotals().taxes)}</p>
        <p className="font-bold">
          Total: {formatCurrency(calculateTotals().total)}
        </p>
        <p>Amount in Words: {numberToWords(calculateTotals().total)}</p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Generate Invoice
        </button>
      </div>
    </form>
  );
};

InvoiceForm.propTypes = {
  onInvoiceGenerated: PropTypes.func.isRequired,
  onSaveDraft: PropTypes.func.isRequired,
};

export default InvoiceForm;

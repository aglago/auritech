import { useState } from "react";
import PropTypes from "prop-types";
import { formatCurrency, numberToWords } from "../utils/helpers";

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
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (section) {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [field]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });

    // Error handling
    if (section && field) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [section]: {
          ...prevErrors[section],
          [field]: null,
        },
      }));
    } else if (name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <FormSection
          title="Seller Details"
          data={formData.sellerDetails}
          section="sellerDetails"
          handleChange={handleChange}
          errors={errors.sellerDetails}
        />
        <FormSection
          title="Billing Details"
          data={formData.billingDetails}
          section="billingDetails"
          handleChange={handleChange}
          errors={errors.billingDetails}
        />
        <FormSection
          title="Shipping Details"
          data={formData.shippingDetails}
          section="shippingDetails"
          handleChange={handleChange}
          errors={errors.shippingDetails}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Place of Supply"
          name="placeOfSupply"
          value={formData.placeOfSupply}
          onChange={handleChange}
        />
        <Input
          label="Place of Delivery"
          name="placeOfDelivery"
          value={formData.placeOfDelivery}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Order Number"
          value={formData.orderDetails.orderNo}
          onChange={(e) => handleChange(e, "orderDetails", "orderNo")}
        />
        <Input
          label="Order Date"
          type="date"
          value={formData.orderDetails.orderDate}
          onChange={(e) => handleChange(e, "orderDetails", "orderDate")}
        />
        <Input
          label="Invoice Number"
          value={formData.invoiceDetails.invoiceNo}
          onChange={(e) => handleChange(e, "invoiceDetails", "invoiceNo")}
        />
        <Input
          label="Invoice Date"
          type="date"
          value={formData.invoiceDetails.invoiceDate}
          onChange={(e) => handleChange(e, "invoiceDetails", "invoiceDate")}
        />
      </div>

      <ItemsList
        items={formData.items}
        handleItemChange={handleItemChange}
        removeItem={removeItem}
        addItem={addItem}
        errors={errors.items}
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.reverseCharge}
          onChange={(e) =>
            setFormData({ ...formData, reverseCharge: e.target.checked })
          }
          className="mr-2"
        />
        <label>Reverse Charge Applicable</label>
      </div>

      <TotalSection totals={calculateTotals()} />

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

const FormSection = ({ title, data, section, handleChange, errors }) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">
      {Object.keys(data).map((field) => (
        <Input
          key={field}
          label={
            field
              .replace(/([A-Z])/g, " $1")
              .charAt(0)
              .toUpperCase() + field.slice(1)
          }
          value={data[field]}
          onChange={(e) => handleChange(e, section, field)}
          error={errors && errors[field]}
        />
      ))}
    </div>
  </div>
);

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

const Input = ({ label, name, value, onChange, type = "text", error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
};

const ItemsList = ({
  items,
  handleItemChange,
  removeItem,
  addItem,
  errors,
}) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Items</h2>
    {items.map((item, index) => (
      <div key={index} className="mb-4 p-4 border rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            label="Description"
            value={item.description}
            onChange={(e) =>
              handleItemChange(index, "description", e.target.value)
            }
            error={errors && errors[index] && errors[index].description}
          />
          <Input
            label="Unit Price"
            type="number"
            value={item.unitPrice}
            onChange={(e) =>
              handleItemChange(index, "unitPrice", parseFloat(e.target.value))
            }
            error={errors && errors[index] && errors[index].unitPrice}
          />
          <Input
            label="Quantity"
            type="number"
            value={item.quantity}
            onChange={(e) =>
              handleItemChange(index, "quantity", parseInt(e.target.value))
            }
            error={errors && errors[index] && errors[index].quantity}
          />
          <Input
            label="Discount"
            type="number"
            value={item.discount}
            onChange={(e) =>
              handleItemChange(index, "discount", parseFloat(e.target.value))
            }
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            value={item.taxRate}
            onChange={(e) =>
              handleItemChange(index, "taxRate", parseFloat(e.target.value))
            }
          />
        </div>
        <button
          type="button"
          onClick={() => removeItem(index)}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          Remove Item
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={addItem}
      className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
    >
      Add Item
    </button>
  </div>
);

ItemsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      unitPrice: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      discount: PropTypes.number.isRequired,
      taxRate: PropTypes.number.isRequired,
    })
  ).isRequired,
  handleItemChange: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

const TotalSection = ({ totals }) => (
  <div className="space-y-2">
    <p>Subtotal: {formatCurrency(totals.subtotal)}</p>
    <p>Taxes: {formatCurrency(totals.taxes)}</p>
    <p className="font-bold">Total: {formatCurrency(totals.total)}</p>
    <p>Amount in Words: {numberToWords(totals.total)}</p>
  </div>
);
TotalSection.propTypes = {
  totals: PropTypes.shape({
    subtotal: PropTypes.number.isRequired,
    taxes: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};



export default InvoiceForm;

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { calculateTotal, formatCurrency, formatDate } from "../utils/helpers";

const InvoiceItem = ({ invoice }) => {
  return (
    <Link to={`/view/${invoice._id}`} className="block">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Invoice #{invoice.invoiceDetails.invoiceNo}
          </h2>
          <span className="text-sm font-medium text-gray-600">
            {formatDate(invoice.invoiceDetails.invoiceDate)}
          </span>
        </div>
        <div className="mb-4">
          <p className="text-gray-600">{invoice.billingDetails.name}</p>
          <p className="text-gray-500 text-sm">
            {invoice.billingDetails.city}, {invoice.billingDetails.state}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(calculateTotal(invoice))}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {invoice.items.length}{" "}
            {invoice.items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </Link>
  );
};

InvoiceItem.propTypes = {
  invoice: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    invoiceDetails: PropTypes.shape({
      invoiceNo: PropTypes.string.isRequired,
      invoiceDate: PropTypes.string.isRequired,
    }).isRequired,
    billingDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        unitPrice: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
        taxRate: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default InvoiceItem;

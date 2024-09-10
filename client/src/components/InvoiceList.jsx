import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getInvoices } from "../services/api";
import InvoiceItem from "./InvoiceItem";
import { PlusCircle } from "lucide-react";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices();
        setInvoices(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch invoices. Please try again later.");
        console.log("Failed to fetch invoices: " + err);
        
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col justify-between items-start gap-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <Link
          to="/create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <PlusCircle className="mr-2" size={20} />
          Create New Invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No invoices found
          </h2>
          <p className="text-gray-600 mb-8">
            Get started by creating your first invoice!
          </p>
          <Link
            to="/create"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center text-lg transition duration-300"
          >
            <PlusCircle className="mr-2" size={24} />
            Create Your First Invoice
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invoices.map((invoice) => (
            <InvoiceItem key={invoice._id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import InvoiceForm from "../components/InvoiceForm";
import { createInvoice, saveDraft } from "../services/api";

const CreateInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInvoiceGenerated = async (invoiceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createInvoice(invoiceData);
      console.log("Invoice created:", response.data);
      navigate(`/view/${response.data._id}`);
    } catch (err) {
      setError("Failed to create invoice. Please try again.");
      console.error("Error creating invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (draftData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await saveDraft(draftData);
      console.log("Draft saved:", response.data);
      navigate("/drafts");
    } catch (err) {
      setError("Failed to save draft. Please try again.");
      console.error("Error saving draft:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-500 text-white py-4 px-6">
              <h2 className="text-2xl font-semibold">Invoice Details</h2>
              <p className="text-blue-100">
                Fill in the information below to create your invoice
              </p>
            </div>
            <div className="p-6">
              <InvoiceForm
                onInvoiceGenerated={handleInvoiceGenerated}
                onSaveDraft={handleSaveDraft}
              />
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInvoice;

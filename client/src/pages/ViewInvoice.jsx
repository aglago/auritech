import { useParams } from "react-router-dom";
import InvoiceDetail from "../components/InvoiceDetail";

const ViewInvoice = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <InvoiceDetail id={id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewInvoice;

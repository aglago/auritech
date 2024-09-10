import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getInvoice } from "../services/api";
import {
  calculateTaxAmount,
  calculateTaxType,
  calculateTotal,
  numberToWords,
} from "../utils/helpers";

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await getInvoice(id);
        setInvoice(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch invoice. Please try again later.");
        console.log("Failed to fetch invoice. Please try: " + err.message);
        
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const invoiceElement = document.getElementById("invoice-detail");
    invoiceElement.style.border = "none";

    const options = {
      margin: 0.5,
      filename: `invoice_${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(invoiceElement).save();
  };

  const totalAmount = invoice?.items ? calculateTotal(invoice) : 0;
  const amountInWords = totalAmount ? numberToWords(totalAmount) : "";

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!invoice)
    return <div className="text-center mt-8">Invoice not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-2 text-[7px] sm:text-[9px] md:text-xs lg:text-sm bg-white">
      <div id="invoice-detail" className="border border-gray-300 font-sans">
        <div className="flex justify-between items-start p-2">
          <img
            src="https://media.licdn.com/dms/image/v2/D4E0BAQEZVXv82bMiPg/company-logo_200_200/company-logo_200_200/0/1699514766383/aurika_labels_flexible_packaging_manufacturer_logo?e=2147483647&v=beta&t=krgdr8_bE477VWJTMBuaGzob5nb6ndvdPfXB2aZqk1I"
            alt="company logo"
            className="w-10 sm:w-12 md:w-16"
          />
          <div className="text-right">
            <h2 className="font-bold text-[8px] sm:text-[10px] md:text-xs">
              Tax Invoice/Bill of Supply/Cash Memo
            </h2>
            <p className="text-[6px] sm:text-[8px] md:text-[10px]">
              (Original for Recipient)
            </p>
          </div>
        </div>

        <div className="flex justify-between p-2 text-[6px] sm:text-[8px] md:text-[10px]">
          <div>
            <h2 className="font-bold">Sold By :</h2>
            <p>{invoice.sellerDetails?.name}</p>
            <p>{invoice.sellerDetails?.address}</p>
            <p>
              {invoice.sellerDetails?.city}, {invoice.sellerDetails?.state},{" "}
              {invoice.sellerDetails?.pincode}
            </p>
            <p>PAN No: {invoice.sellerDetails?.panNo}</p>
            <p>
              GST Registration No: {invoice.sellerDetails?.gstRegistrationNo}
            </p>
          </div>
          <div className="text-right">
            <h2 className="font-bold">Billing Address :</h2>
            <p>{invoice.billingDetails?.name}</p>
            <p>{invoice.billingDetails?.address}</p>
            <p>
              {invoice.billingDetails?.city}, {invoice.billingDetails?.state},{" "}
              {invoice.billingDetails?.pincode}
            </p>
            <p>State/UT Code: {invoice.billingDetails?.stateUTCode}</p>
          </div>
        </div>

        <div className="text-right p-2 text-[6px] sm:text-[8px] md:text-[10px]">
          <h2 className="font-bold">Shipping Address :</h2>
          <p>{invoice.shippingDetails?.name}</p>
          <p>{invoice.shippingDetails?.address}</p>
          <p>
            {invoice.shippingDetails?.city}, {invoice.shippingDetails?.state},{" "}
            {invoice.shippingDetails?.pincode}
          </p>
          <p>State/UT Code: {invoice.shippingDetails?.stateUTCode}</p>
        </div>

        <div className="flex justify-between p-2 text-[6px] sm:text-[8px] md:text-[10px]">
          <div>
            <p>
              <span className="font-bold">Order Number:</span>{" "}
              {invoice.orderDetails?.orderNo}
            </p>
            <p>
              <span className="font-bold">Order Date:</span>{" "}
              {invoice.orderDetails?.orderDate &&
                new Date(invoice.orderDetails.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-bold">Place of Supply:</span>{" "}
              {invoice.placeOfSupply}
            </p>
            <p>
              <span className="font-bold">Place of Delivery:</span>{" "}
              {invoice.placeOfDelivery}
            </p>
            <p>
              <span className="font-bold">Invoice Number:</span>{" "}
              {invoice.invoiceDetails?.invoiceNo}
            </p>
            <p>
              <span className="font-bold">Invoice Date:</span>{" "}
              {invoice.invoiceDetails?.invoiceDate &&
                new Date(
                  invoice.invoiceDetails.invoiceDate
                ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full border-collapse text-[6px] sm:text-[8px] md:text-[10px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 font-semibold text-left">
                  Sl. No
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-left">
                  Description
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-right">
                  Unit Price
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-right">
                  Qty
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-right">
                  Net Amount
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-right">
                  Tax Rate
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-right">
                  Tax Type
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-right">
                  Tax Amount
                </th>
                <th className="border border-gray-300 p-1 font-semibold text-right">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => {
                const netAmount =
                  item.unitPrice * item.quantity - (item.discount || 0);
                const taxType = calculateTaxType(
                  invoice.placeOfSupply,
                  invoice.placeOfDelivery
                );
                const taxAmount = calculateTaxAmount(
                  netAmount,
                  item.taxRate,
                  taxType
                );
                const totalAmount =
                  netAmount +
                  Object.values(taxAmount).reduce((a, b) => a + b, 0);

                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="border border-gray-300 p-1" rowSpan="2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 p-1">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        ₹{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        ₹{netAmount.toFixed(2)}
                      </td>
                      <td
                        className="border border-gray-300 p-1 text-right"
                        rowSpan="2"
                      >
                        {item.taxRate}%
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        {taxType === "IGST" ? "IGST" : "CGST"}
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        ₹
                        {taxType === "IGST"
                          ? taxAmount.IGST?.toFixed(2)
                          : taxAmount.CGST?.toFixed(2)}
                      </td>
                      <td
                        className="border border-gray-300 p-1 text-right"
                        rowSpan="2"
                      >
                        ₹{totalAmount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-1">Discount</td>
                      <td className="border border-gray-300 p-1 text-right">
                        ₹{item.discount?.toFixed(2) || 0}
                      </td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1 text-right">
                        ₹30.96
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        {taxType === "IGST" ? "---" : "SGST"}
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        ₹{taxAmount.SGST?.toFixed(2) || "0"}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td
                  colSpan="8"
                  className="border border-gray-300 p-1 text-left"
                >
                  TOTAL:
                </td>
                <td className="border border-gray-300 p-1 text-right">
                  ₹{totalAmount}
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="border border-gray-300 p-1">
                  <div className="flex flex-col">
                    <p className="font-bold">Amount in Words:</p>
                    <p className="font-bold">{amountInWords}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="border border-gray-300 p-1">
                  <div className="flex justify-end p-2">
                    <div className="text-right flex flex-col justify-end items-end">
                      <p className="font-bold">
                        For {invoice.sellerDetails?.name}:
                      </p>
                      <div className="w-16 sm:w-20 md:w-24 h-4 sm:h-6 md:h-8 border-l-4 border border-gray-400"></div>
                      <p>Authorized Signatory</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="9" className="p-1">
                  <p>
                    Whether tax is payable under reverse charge:{" "}
                    {invoice.reverseCharge ? "Yes" : "No"}
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg flex items-center text-xs sm:text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail;

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import InvoiceForm from "./InvoiceForm";

const InvoiceDetail = ({ invoices, markAsPaid, deleteInvoice, updateInvoice }) => {
  // STATE: Controls whether the modal is visible
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // 1. Grab the ID from the URL
  const { id } = useParams();
  const navigate = useNavigate();
  // 2. Find the exact invoice from our state array
  const invoice = invoices.find((inv) => inv.id === id);

  // New function: Actually does the deleting after user confirms
  const confirmDelete = () => {
    deleteInvoice(invoice.id);
    navigate("/");
  };

  if (!invoice) {
    return (
      <div className="max-w-3xl mx-auto text-center py-24">
        <h2 className="text-2xl font-bold dark:text-white">
          Invoice not found
        </h2>
        <Link to="/" className="text-blue-600 font-bold mt-4 inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  // HELPER: Formats "YYYY-MM-DD" to "DD Mon YYYY" (e.g., "12 May 2024")
  const formatDate = (dateString) => {
    if (!dateString || dateString === "No Date") return "N/A";
    
    // Split the string into an array: ["2024", "05", "12"]
    const [year, month, day] = dateString.split("-");
    
    // A quick dictionary for our month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Convert month string "05" to number 5, subtract 1 for array index, get "May"
    const monthName = months[parseInt(month, 10) - 1];
    
    // Return the beautifully formatted string. We parse the day to remove leading zeros (e.g., "05" becomes "5").
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  };

  return (
    <div className="max-w-3xl mx-auto pt-28 md:pt-0">
      <Link
        to="/"
        className="flex items-center gap-4 text-gray-900 dark:text-white font-bold hover:text-gray-500 transition-colors mb-8 w-max"
      >
        <svg
          width="7"
          height="10"
          viewBox="0 0 7 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2" fill="none" />
        </svg>{" "}
        Go back
      </Link>

      {/* THE ACTION BAR */}
      <div className="bg-white dark:bg-[#1E2139] p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Section */}
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Status
          </span>
          <div
            className={`w-28 py-2 rounded-md font-bold flex items-center justify-center gap-2 capitalize ${
              invoice.status === "paid"
                ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                : invoice.status === "pending"
                  ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-current"></div>
            {invoice.status}
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex items-center gap-2 w-full md:w-auto bg-white dark:bg-[#1E2139] fixed md:static bottom-0 left-0 p-4 md:p-0 justify-center shadow-[0_-10px_10px_-10px_rgba(0,0,0,0.1)] md:shadow-none">
          <button
            onClick={() => setIsEditFormOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-[#252945] dark:hover:bg-white dark:hover:text-black dark:text-white text-gray-700 font-bold py-3 px-6 rounded-full transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#EC5757] hover:bg-[#FF9797] text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Delete
          </button>

          {/* Only show Mark as Paid if it's NOT already paid */}
          {invoice.status !== "paid" && (
            <button
              onClick={() => markAsPaid(invoice.id)}
              className="bg-[#7C5DFA] hover:bg-[#9277FF] text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>
      {/* --- THE INVOICE RECEIPT BODY --- */}
      <div className="bg-white dark:bg-[#1E2139] p-6 md:p-12 rounded-xl shadow-sm mt-6 mb-16">
        {/* Top Header: ID & Sender Address */}
        <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-10">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-xl">
              <span className="text-[#888EB0]">#</span>
              {invoice.id}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 capitalize">
              {invoice.projectDescription || "No description"}
            </p>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col md:text-right">
            <span>{invoice.senderStreet}</span>
            <span>{invoice.senderCity}</span>
            <span>{invoice.senderPostCode}</span>
            <span>{invoice.senderCountry}</span>
          </div>
        </div>

        {/* Middle Section: Dates, Bill To, Sent To */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* Dates */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                Invoice Date
              </p>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                {formatDate(invoice.invoiceDate)}
              </h4>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                Payment Due
              </p>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                {formatDate(invoice.dueDate)}
              </h4>
            </div>
          </div>

          {/* Bill To */}
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Bill To
            </p>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              {invoice.clientName}
            </h4>
            <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col">
              <span>{invoice.clientStreet}</span>
              <span>{invoice.clientCity}</span>
              <span>{invoice.clientPostCode}</span>
              <span>{invoice.clientCountry}</span>
            </div>
          </div>

          {/* Sent To */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Sent to
            </p>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg break-all">
              {invoice.clientEmail}
            </h4>
          </div>
        </div>

        {/* Bottom Section: Item Table Container */}
        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-6 md:p-8">
          {/* Table Header (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-[1fr_80px_100px_100px] gap-4 mb-6 text-gray-500 dark:text-gray-400 text-sm">
            <span>Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          {/* The Dynamic Item Rows */}
          <div className="flex flex-col gap-6">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center md:grid md:grid-cols-[1fr_80px_100px_100px] md:gap-4"
                >
                  <div className="flex flex-col md:block">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                    {/* Mobile-only Price x Qty display */}
                    <span className="md:hidden text-gray-500 dark:text-gray-400 font-bold mt-1">
                      {item.quantity} x £{item.price}
                    </span>
                  </div>
                  <span className="hidden md:block text-gray-500 dark:text-gray-400 font-bold text-center">
                    {item.quantity}
                  </span>
                  <span className="hidden md:block text-gray-500 dark:text-gray-400 font-bold text-right">
                    £{item.price}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-right">
                    £{item.total.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No items added to this invoice.
              </p>
            )}
          </div>
        </div>

        {/* Grand Total Footer */}
        <div className="bg-[#373B53] dark:bg-[#0C0E16] text-white p-6 md:p-8 rounded-b-lg flex justify-between items-center">
          <span className="text-sm">Amount Due</span>
          <span className="text-2xl font-bold">
            £{(invoice.total || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* RENDER THE MODAL AT THE BOTTOM */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        invoiceId={invoice.id}
      />

      {/* THE EDIT FORM */}
      <InvoiceForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        invoiceData={invoice} // <-- Pass the current invoice data in!
        updateInvoice={updateInvoice} // <-- Pass the mutator!
      />
    </div>
  );
};;

export default InvoiceDetail;

import { useState } from "react";
import { Link } from "react-router-dom";
import emptyIllustrationPath from "../assets/Email campaign_Flatline 2.svg";

// HELPER FUNCTION: This returns the correct colors based on the status
const getStatusColors = (status) => {
  if (status === "paid")
    return "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400";
  if (status === "pending")
    return "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
  return "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"; // Draft
};

const Invoice = ({ invoices, openForm }) => {
  // 1. New State for the filter dropdown
  const [statusFilters, setStatusFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. The Derived Array (This updates automatically whenever filterStatus or invoices change!)
  const filteredInvoices = invoices.filter((invoice) => {
    // THE MAGIC LINE: If the array is empty, return true for everything!
    if (statusFilters.length === 0) {
      return true;
    }

    // Otherwise, check if the invoice's status is in our array
    return statusFilters.includes(invoice.status.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-12 px-6 md:pt-16 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            <span className="hidden md:inline">There are </span>
            {invoices.length} total
            <span className="hidden md:inline"> invoices</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* The Filter Dropdown */}
          {/* THE CUSTOM FILTER DROPDOWN */}
          <div className="relative flex items-center">
            {/* The Trigger Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 text-gray-900 dark:text-white font-bold tracking-wide"
            >
              <span className="hidden md:inline">Filter by status</span>
              <span className="md:hidden">Filter</span>
              {/* The little arrow that flips when open! */}
              <svg
                className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
                width="11"
                height="7"
                viewBox="0 0 11 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.25L5.45116 5.25L9.90233 1.25"
                  stroke="#7C5DFA"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </button>

            {/* The Floating Checkbox Menu */}
            {isFilterOpen && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 md:-translate-x-1/4 w-48 bg-white dark:bg-[#252945] rounded-xl shadow-xl p-6 flex flex-col gap-4 z-50">
                {["draft", "pending", "paid"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-4 cursor-pointer group"
                  >
                    {/* The Custom Checkbox Box */}
                    <div className="relative flex items-center justify-center w-4 h-4 rounded-sm bg-[#DFE3FA] dark:bg-[#1E2139] border border-transparent group-hover:border-[#7C5DFA] transition-colors">
                      <input
                        type="checkbox"
                        className="peer opacity-0 absolute w-full h-full cursor-pointer"
                        checked={statusFilters.includes(status)}
                        onChange={() => {
                          if (statusFilters.includes(status)) {
                            // If it's already checked, remove it from the array
                            setStatusFilters(
                              statusFilters.filter((s) => s !== status),
                            );
                          } else {
                            // If it's not checked, add it to the array
                            setStatusFilters([...statusFilters, status]);
                          }
                        }}
                      />

                      {/* The Purple Background & White Checkmark (Only visible when peer is checked!) */}
                      <div className="hidden peer-checked:flex absolute inset-0 bg-[#7C5DFA] rounded-sm items-center justify-center">
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.5 4.5L3.5 6.5L8.5 1.5"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>

                    <span className="text-gray-900 dark:text-white font-bold capitalize text-sm tracking-wide">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* The "New Invoice" Button */}
          <button
            onClick={openForm}
            className="bg-[#7C5DFA] hover:bg-[#9277FF] text-white flex items-center gap-2 p-2 pr-4 md:pr-5 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
          >
            {/* Removed the pb-1, and swapped the text for a perfectly centered SVG */}
            <span className="bg-white text-[#7C5DFA] w-8 h-8 rounded-full flex items-center justify-center">
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.31311 10.0234V6.31311H10.0234V4.68689H6.31311V0.976562H4.68689V4.68689H0.976562V6.31311H4.68689V10.0234H6.31311Z" />
              </svg>
            </span>
            <span className="hidden md:inline">New Invoice</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>

      {/* INVOICE LIST */}
      <div className="flex flex-col gap-4">
        {filteredInvoices.map((invoice) => (
          <Link
            to={`/invoice/${invoice.id}`}
            key={invoice.id}
            // Rebuilt container flex properties
            className="bg-white dark:bg-[#1E2139] p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:border-[#7C5DFA] border border-transparent transition-all"
          >
            {/* MOBILE: Top Row | DESKTOP: Left Side (ID, Date, Name) */}
            <div className="flex justify-between items-center md:justify-start md:gap-10 md:w-1/2">
              <span className="font-bold text-gray-900 dark:text-white">
                <span className="text-gray-400">#</span>
                {invoice.id}
              </span>

              {/* This name only shows on mobile (top right) */}
              <span className="text-gray-500 dark:text-white text-sm md:hidden">
                {invoice.clientName}
              </span>

              {/* Date & Name form a perfect inline row on Desktop */}
              <span className="hidden md:block text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                Due {invoice.dueDate}
              </span>
              <span className="hidden md:block text-gray-500 dark:text-white text-sm">
                {invoice.clientName}
              </span>
            </div>

            {/* MOBILE: Bottom Row | DESKTOP: Right Side (Amount, Status, Arrow) */}
            <div className="flex justify-between items-center md:justify-end md:gap-10 md:w-1/2">
              {/* Stacked on mobile, inline on desktop */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-10">
                <span className="text-gray-500 dark:text-gray-400 text-sm md:hidden mb-1">
                  Due {invoice.dueDate}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  ${invoice.total.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`w-28 py-2 rounded-md font-bold flex items-center justify-center gap-2 capitalize ${getStatusColors(invoice.status)}`}
                >
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  {invoice.status}
                </div>

                {/* 3. THE ARROW IS BACK! (Hidden on mobile, visible on desktop) */}
                <svg
                  className="hidden md:block"
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L1 9"
                    stroke="#7C5DFA"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
            <img
              src={emptyIllustrationPath}
              alt="No invoices"
              className="w-48 md:w-60 mb-8"
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">
              There is nothing here
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[220px] mx-auto leading-relaxed">
              Create an invoice by clicking the{" "}
              <span className="font-bold dark:text-gray-300">New Invoice</span>{" "}
              button and get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;

import { useState, useEffect } from "react";
import Invoice from "./components/Invoice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm";
import AppLogo from "./assets/logo.svg";
import ImageIcon from "./assets/Oval.png";

// --- DUMMY DATA ---
// This acts as our temporary database
const initialInvoices = [
  {
    id: "RT3080",
    clientName: "Jensen Huang",
    total: 1800,
    status: "paid",
    dueDate: "15 May 2026",
  },
  {
    id: "XM9141",
    clientName: "Alexandr Wang",
    total: 4500,
    status: "pending",
    dueDate: "30 Apr 2026",
  },
  {
    id: "RG0314",
    clientName: "Sam Altman",
    total: 9500,
    status: "draft",
    dueDate: "01 Jun 2026",
  },
];

const App = () => {
  // 1. STATE INITIALIZATION: Check LocalStorage first!
  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = localStorage.getItem("invoices");
    // If we find saved invoices, parse them from text back into a JavaScript array
    if (savedInvoices) {
      return JSON.parse(savedInvoices);
    }
    // If nothing is saved yet, start with our dummy data
    return initialInvoices;
  });

  // 2. THE SAVE EFFECT: Whenever the 'invoices' array changes, save it!
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  // --- Theme State & Effect (Unchanged) ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Function to add a brand new invoice to the list
  const addInvoice = (newInvoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  // Function to update an existing invoice
  const updateInvoice = (updatedInvoice) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice,
      ),
    );
  };

  const markAsPaid = (id) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "paid" } : invoice,
      ),
    );
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen transition-colors duration-300">
        {/* SIDEBAR */}
        <aside className="fixed z-60 top-0 left-0 w-full h-20 md:w-25.75 md:h-screen bg-[#373B53] flex md:flex-col justify-between items-center md:rounded-r-3xl transition-all duration-300">
          <div className="shrink-0">
            <img
              className="w-20 h-20 md:w-[103px] md:h-[103px] object-cover"
              alt="Invoice App Logo"
              src={AppLogo}
            />
          </div>
          <div className="flex md:flex-col items-center h-full md:h-auto md:w-full">
            <button
              onClick={toggleTheme}
              // Added the animation classes back in here!
              className="px-6 md:px-0 md:py-6 md:w-full flex justify-center text-[#858BB2] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5" // Standardized size so it doesn't jump
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.91783 0C2.20609 0 0 2.20652 0 4.91826C0 7.63 2.20609 9.83652 4.91783 9.83652C7.62913 9.83652 9.83565 7.63043 9.83565 4.91826C9.83565 2.20609 7.62913 0 4.91783 0Z"
                    fill="currentColor" /* <-- THE MAGIC WORD */
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5" // Standardized size so it doesn't jump
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.5016 11.3423C19.2971 11.2912 19.0927 11.3423 18.9137 11.4701C18.2492 12.0324 17.4824 12.4924 16.639 12.7991C15.8466 13.1059 14.9776 13.2592 14.0575 13.2592C11.9872 13.2592 10.0958 12.4158 8.74121 11.0611C7.38658 9.70649 6.54313 7.81512 6.54313 5.74483C6.54313 4.87582 6.69649 4.03237 6.95208 3.26559C7.23323 2.4477 7.64217 1.70649 8.17891 1.06751C8.40895 0.786362 8.35783 0.377416 8.07668 0.147384C7.89776 0.0195887 7.69329 -0.0315295 7.48882 0.0195887C5.31629 0.607448 3.42492 1.91096 2.07029 3.64898C0.766773 5.36144 0 7.48285 0 9.78317C0 12.5691 1.1246 15.0995 2.96486 16.9397C4.80511 18.78 7.3099 19.9046 10.1214 19.9046C12.4728 19.9046 14.6454 19.0867 16.3834 17.732C18.147 16.3519 19.4249 14.3838 19.9617 12.1346C20.0639 11.7768 19.8594 11.419 19.5016 11.3423Z"
                    fill="currentColor" /* <-- THE MAGIC WORD */
                  />
                </svg>
              )}
            </button>

            {/* h-full and w-[1px] makes it vertical on mobile. md:h-[1px] and md:w-full makes it horizontal on desktop. */}
            <div className="w-[1px] md:w-full md:h-[1px] bg-[#494E6E] self-stretch"></div>

            {/* 3. The User Avatar */}
            <div className="px-6 md:px-0 md:py-6">
              <img
                src={ImageIcon}
                alt="User Profile"
                className="px-2 md:px-0 md:py-2 md:w-full flex justify-center"
              />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-[#F8F8FB] dark:bg-[#141625] p-6 md:p-12 lg:p-24 transition-colors duration-300">
          {/* 2. Setup our Routing Logic inside the main container */}
          <Routes>
            {/* The Home Page */}
            <Route
              path="/"
              element={
                <Invoice
                  invoices={invoices}
                  openForm={() => setIsFormOpen(true)}
                />
              }
            />

            {/* Update your Route for the detail page to pass these new
            functions */}
            <Route
              path="/invoice/:id"
              element={
                <InvoiceDetail
                  invoices={invoices}
                  markAsPaid={markAsPaid}
                  deleteInvoice={deleteInvoice}
                  updateInvoice={updateInvoice}
                />
              }
            />
          </Routes>
          <InvoiceForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            addInvoice={addInvoice}
          />
        </main>
      </div>
    </Router>
  );
};

export default App;

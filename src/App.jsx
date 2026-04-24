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
    id: "XM9141",
    createdAt: "2026-04-21",
    dueDate: "2026-05-21",
    description: "Graphic Design",
    paymentTerms: 30,
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Banner Design",
        quantity: 1,
        price: 156.0,
        total: 156.0,
      },
      {
        name: "Email Design",
        quantity: 2,
        price: 200.0,
        total: 400.0,
      },
    ],
    total: 556.0,
  },
  {
    id: "RG0314",
    createdAt: "2026-04-24",
    dueDate: "2026-05-01",
    description: "Website Redesign",
    paymentTerms: 7,
    clientName: "John Morrison",
    clientEmail: "jm@myco.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "79 Dover Road",
      city: "Westhall",
      postCode: "IP19 3PF",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Website Redesign",
        quantity: 1,
        price: 14002.33,
        total: 14002.33,
      },
    ],
    total: 14002.33,
  },
  {
    id: "RT3080",
    createdAt: "2026-05-04",
    dueDate: "2026-05-05",
    description: "Logo Re-branding",
    paymentTerms: 1,
    clientName: "Alysa Werner",
    clientEmail: "alysa@email.co.uk",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "63 Warwick Road",
      city: "Carlisle",
      postCode: "CA20 2TG",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Logo Sketches",
        quantity: 1,
        price: 102.04,
        total: 102.04,
      },
    ],
    total: 102.04,
  },
  {
    id: "FV2353",
    createdAt: "2026-05-05",
    dueDate: "2026-05-19",
    description: "Logo Concept",
    paymentTerms: 14,
    clientName: "Anita Robertson",
    clientEmail: "anita.r@studio.com",
    status: "draft",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Brand Guidelines",
        quantity: 1,
        price: 1800.9,
        total: 1800.9,
      },
    ],
    total: 1800.9,
  },
  {
    id: "TY9141",
    createdAt: "2026-05-11",
    dueDate: "2026-06-10",
    description: "SEO Optimization",
    paymentTerms: 30,
    clientName: "Thomas Wayne",
    clientEmail: "thomas@dc.com",
    status: "pending",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "3964  Queens Lane",
      city: "Gotham",
      postCode: "60457",
      country: "United States",
    },
    items: [
      {
        name: "SEO Audit",
        quantity: 1,
        price: 500.0,
        total: 500.0,
      },
      {
        name: "Keyword Research",
        quantity: 1,
        price: 350.0,
        total: 350.0,
      },
    ],
    total: 850.0,
  },
  {
    id: "JV0821",
    createdAt: "2026-05-15",
    dueDate: "2026-05-22",
    description: "UI/UX Prototyping",
    paymentTerms: 7,
    clientName: "Mellisa Jones",
    clientEmail: "mjones@design.com",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "46 Abbey Row",
      city: "Cambridge",
      postCode: "CB2 1AB",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Figma Prototypes",
        quantity: 3,
        price: 400.0,
        total: 1200.0,
      },
    ],
    total: 1200.0,
  },
  {
    id: "AA1449",
    createdAt: "2026-05-20",
    dueDate: "2026-06-03",
    description: "Backend Server Setup",
    paymentTerms: 14,
    clientName: "CloudSync Inc.",
    clientEmail: "billing@cloudsync.io",
    status: "draft",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "112 Silicon Avenue",
      city: "San Francisco",
      postCode: "94105",
      country: "United States",
    },
    items: [
      {
        name: "AWS Architecture",
        quantity: 1,
        price: 2500.0,
        total: 2500.0,
      },
      {
        name: "Database Migration",
        quantity: 1,
        price: 1200.5,
        total: 1200.5,
      },
    ],
    total: 3700.5,
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

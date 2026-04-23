import { useState } from "react";
import FormInput from "./FormInput";

const InvoiceForm = ({ isOpen, onClose, addInvoice, updateInvoice, invoiceData }) => {
  // Initialize state using a callback function so we can safely check for missing arrays
  const [formData, setFormData] = useState(() => {
    // IF EDIT MODE: Use existing data, but GUARANTEE 'items' is at least an empty array
    if (invoiceData) {
      return {
        ...invoiceData,
        items: invoiceData.items || [], // <-- This saves the app from crashing!
      };
    }

    // IF CREATE MODE: Use the blank template
    return {
      senderStreet: "",
      senderCity: "",
      senderPostCode: "",
      senderCountry: "",
      clientName: "",
      clientEmail: "",
      clientStreet: "",
      clientCity: "",
      clientPostCode: "",
      clientCountry: "",
      invoiceDate: "",
      paymentTerms: "30",
      projectDescription: "",
      items: [],
    };
  });
  const [errors, setErrors] = useState({});

  // 2. THE BOUNCER: Checks if the required fields are filled
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // A list of all the fields we care about
    const requiredFields = [
      "senderStreet",
      "clientName",
      "clientEmail",
      "clientStreet",
      "clientCity",
      "clientPostCode",
      "clientCountry",
      "invoiceDate",
    ];

    // Loop through them. If it's empty, flag it as an error!
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = true;
        isValid = false;
      }
    });

    // We also want to make sure they added at least one item
    if (formData.items.length === 0) {
      newErrors.items = true;
      isValid = false;
    }

    setErrors(newErrors);
    // ADD THIS LINE:
    console.log("🕵️ THE BOUNCER SAYS THESE ARE MISSING:", newErrors);
    return isValid;
  };;

  // HELPER: Generates a random ID like "RT3080"
  const generateID = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for (let i = 0; i < 2; i++)
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 4; i++) id += Math.floor(Math.random() * 10);
    return id;
  };
  
  // HELPER: Calculates Due Date based on Invoice Date + Payment Terms
  const calculateDueDate = (startDate, terms) => {
    if (!startDate) return "No Date";
    
    // Convert the string to a real Date object
    const date = new Date(startDate);
    
    // Add the payment terms (in days) to the current date
    date.setDate(date.getDate() + parseInt(terms));
    
    // Reformat back to YYYY-MM-DD
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  };

  // THE SUBMIT FUNCTION
  const handleSubmit = (status) => {
    console.log("1. Button clicked! Status is:", status);

    // We only strictly validate if they are NOT saving as a draft
    if (status !== "draft") {
      console.log("2. Running the bouncer...");
      const isFormValid = validateForm();

      if (!isFormValid) {
        console.log(
          "🛑 VALIDATION FAILED! The bouncer stopped it. Check your errors state.",
        );
        return;
      }
      console.log("✅ Validation passed!");
    }

    const grandTotal = formData.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    // NEW: Calculate the exact due date right before we save!
    const exactDueDate = calculateDueDate(
      formData.invoiceDate,
      formData.paymentTerms,
    );

    if (invoiceData) {
      console.log("3. Updating existing invoice:", invoiceData.id);
      const updatedInvoice = {
        ...formData,
        status: status,
        total: grandTotal,
        dueDate: exactDueDate,
        id: invoiceData.id,
      };
      updateInvoice(updatedInvoice);
    } else {
      console.log("3. Creating brand new invoice...");
      const newInvoice = {
        ...formData,
        id: generateID(),
        status: status,
        total: grandTotal,
        dueDate: exactDueDate,
      };
      addInvoice(newInvoice);
    }

    console.log("4. Closing the form...");
    onClose();
  };;

  // 2. ONE function to handle every single input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // If they start typing, remove the error for this field
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    }
  };

  // 1. ADD ITEM: Copies the old array and tacks a blank object onto the end
  const handleAddItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { name: "", quantity: "", price: "", total: 0 },
      ],
    }));
  };

  // 2. DELETE ITEM: Filters out the item at the specific index
  const handleDeleteItem = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, index) => index !== indexToRemove),
    }));
  };

  // 3. EDIT ITEM: Finds the specific row, updates the field, and auto-calculates the total
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      // Create a deep copy of the items array
      const newItems = [...prevData.items];

      // Update the specific field (name, quantity, or price)
      newItems[index][name] = value;

      // Auto-calculate the total if they change quantity or price
      if (name === "quantity" || name === "price") {
        const qty = parseFloat(newItems[index].quantity) || 0;
        const prc = parseFloat(newItems[index].price) || 0;
        newItems[index].total = qty * prc;
      }

      return { ...prevData, items: newItems };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Form Drawer */}
      <div className="relative w-full md:w-179 bg-white dark:bg-[#141625] h-full flex flex-col md:pl-28 rounded-r-2xl shadow-2xl transition-transform">
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-14 custom-scrollbar">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">
            {invoiceData ? (
              <>
                Edit <span className="text-[#888EB0]">#</span>
                {invoiceData.id}
              </>
            ) : (
              "New Invoice"
            )}
          </h2>

          <form className="flex flex-col gap-10">
            {/* --- BILL FROM SECTION --- */}
            <section>
              <h3 className="text-[#7C5DFA] font-bold mb-6 text-sm">
                Bill from
              </h3>
              <div className="flex flex-col gap-6">
                <FormInput
                  label="Street Address"
                  name="senderStreet"
                  value={formData.senderStreet}
                  onChange={handleChange}
                  error={errors.senderStreet}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <FormInput
                    label="City"
                    name="senderCity"
                    value={formData.senderCity}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="Post Code"
                    name="senderPostCode"
                    value={formData.senderPostCode}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="Country"
                    name="senderCountry"
                    value={formData.senderCountry}
                    onChange={handleChange}
                    wrapperClass="col-span-2 md:col-span-1"
                  />
                </div>
              </div>
            </section>

            {/* --- BILL TO SECTION --- */}
            <section>
              <h3 className="text-[#7C5DFA] font-bold mb-6 text-sm">Bill to</h3>
              <div className="flex flex-col gap-6">
                <FormInput
                  label="Client's Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  error={errors.clientName}
                />

                <FormInput
                  label="Client's Email"
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  error={errors.clientEmail}
                  placeholder="e.g. email@example.com"
                />

                <FormInput
                  label="Street Address"
                  name="clientStreet"
                  value={formData.clientStreet}
                  onChange={handleChange}
                  error={errors.clientStreet}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <FormInput
                    label="City"
                    name="clientCity"
                    value={formData.clientCity}
                    onChange={handleChange}
                    error={errors.clientCity}
                  />
                  <FormInput
                    label="Post Code"
                    name="clientPostCode"
                    value={formData.clientPostCode}
                    onChange={handleChange}
                    error={errors.clientPostCode}
                  />
                  <FormInput
                    label="Country"
                    name="clientCountry"
                    value={formData.clientCountry}
                    onChange={handleChange}
                    error={errors.clientCountry}
                    wrapperClass="col-span-2 md:col-span-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormInput
                  label="Invoice Date"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  error={errors.invoiceDate}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Payment Terms
                  </label>
                  <select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-[#1E2139] border border-gray-300 dark:border-[#252945] rounded-md p-4 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="1">Net 1 Day</option>
                    <option value="7">Net 7 Days</option>
                    <option value="14">Net 14 Days</option>
                    <option value="30">Net 30 Days</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Project Description
                </label>
                <input
                  type="text"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  placeholder="e.g. Graphic Design Service"
                  className="w-full bg-white dark:bg-[#1E2139] border border-gray-300 dark:border-[#252945] rounded-md p-4 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {/* --- ITEM LIST SECTION --- */}
              <section className="mt-8">
                <h3 className="text-[#777F98] text-lg font-bold mb-4">
                  Item List
                </h3>

                {/* Table Headers (Hidden on Mobile) */}
                <div className="hidden md:grid grid-cols-[1fr_80px_100px_100px_16px] gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <label>Item Name</label>
                  <label>Qty.</label>
                  <label>Price</label>
                  <label>Total</label>
                  <label></label> {/* Empty space for delete icon */}
                </div>

                {/* The Dynamic Rows */}
                <div className="flex flex-col gap-12 md:gap-4 mb-6">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[64px_1fr_1fr_16px] md:grid-cols-[1fr_80px_100px_100px_16px] gap-4 items-center"
                    >
                      {/* Item Name (Spans full width on mobile) */}
                      <div className="col-span-4 md:col-span-1 flex flex-col gap-2">
                        <label className="md:hidden text-sm text-gray-500">
                          Item Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white dark:bg-[#1E2139] border border-gray-300 dark:border-[#252945] rounded-md p-4 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="md:hidden text-sm text-gray-500">
                          Qty.
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white dark:bg-[#1E2139] border border-gray-300 dark:border-[#252945] rounded-md p-4 text-center text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="md:hidden text-sm text-gray-500">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white dark:bg-[#1E2139] border border-gray-300 dark:border-[#252945] rounded-md p-4 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Auto-calculated Total */}
                      <div className="flex flex-col gap-2">
                        <label className="md:hidden text-sm text-gray-500">
                          Total
                        </label>
                        <div className="p-4 text-gray-500 dark:text-gray-400 font-bold bg-transparent">
                          {item.total.toFixed(2)}
                        </div>
                      </div>

                      {/* Delete Icon */}
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        className="mt-6 md:mt-0 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          width="13"
                          height="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                            fill="currentColor"
                            fillRule="nonzero"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Item Button */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full bg-gray-100 dark:bg-[#252945] hover:bg-gray-200 dark:hover:bg-[#1E2139] text-gray-700 dark:text-gray-300 font-bold py-4 rounded-full transition-colors"
                >
                  + Add New Item
                </button>
              </section>
            </section>
          </form>
        </div>

        {/* --- ACTION BUTTONS (Pinned to bottom) --- */}
        <div className="bg-white dark:bg-[#141625] p-6 flex items-center justify-between shadow-[0_-10px_10px_-10px_rgba(0,0,0,0.1)] dark:shadow-none z-10 rounded-br-2xl border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-[#252945] dark:hover:bg-white dark:hover:text-black dark:text-white text-gray-700 font-bold py-3 px-6 rounded-full transition-colors"
          >
            Discard
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit("draft")}
              className="bg-[#373B53] hover:bg-[#1E2139] text-gray-300 font-bold py-3 px-6 rounded-full transition-colors hidden md:block"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit("pending")}
              className="bg-[#7C5DFA] hover:bg-[#9277FF] text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              Save & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};;

export default InvoiceForm;

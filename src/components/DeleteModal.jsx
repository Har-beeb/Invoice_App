import { useEffect, useRef } from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm, invoiceId }) => {
  const modalRef = useRef(null);

  // ACCESSIBILITY LOGIC: Esc to close & Focus Trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // 1. Close on Escape
      if (e.key === "Escape") {
        onClose();
      }

      // 2. Trap Focus on Tab
      if (e.key === "Tab") {
        // Find all elements inside the modal that can be tabbed to (our two buttons)
        const focusableElements = modalRef.current.querySelectorAll("button");
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If holding Shift + Tab (going backwards)
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault(); // Stop default browser behavior
          }
        } else {
          // Regular Tab (going forwards)
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Attach the event listener to the whole document
    document.addEventListener("keydown", handleKeyDown);

    // Auto-focus the "Cancel" button when the modal first opens for keyboard users
    const cancelButton = modalRef.current?.querySelector("#cancel-btn");
    if (cancelButton) cancelButton.focus();

    // Cleanup function: Remove listener when modal closes
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // If the modal isn't open, don't render anything!
  if (!isOpen) return null;

  return (
    // The dark overlay background
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 transition-opacity">
      {/* The actual modal box */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white dark:bg-[#1E2139] p-8 rounded-xl shadow-xl max-w-md w-full"
      >
        <h2
          id="modal-title"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Confirm Deletion
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          Are you sure you want to delete invoice{" "}
          <span className="font-bold text-gray-700 dark:text-gray-300">
            #{invoiceId}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            id="cancel-btn"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-[#252945] dark:hover:bg-white dark:hover:text-black dark:text-white text-gray-700 font-bold py-3 px-6 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

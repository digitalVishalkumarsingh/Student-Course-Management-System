import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}) => {
  if (!isOpen) {
    return null;
  }

  const sizeClass = {
    small: "modal-small",
    medium: "modal-medium",
    large: "modal-large",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${sizeClass[size] || "modal-medium"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

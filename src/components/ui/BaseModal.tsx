// BaseModal - Universal modal component
// Based on existing ConfirmModal design with custom content support

import React from "react";
import styles from "./ConfirmModal.module.css"; // Reuse existing modal styles

interface BaseModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  maxWidth = "400px",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={styles.modal} style={{ maxWidth }}>
        {title && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BaseModal;

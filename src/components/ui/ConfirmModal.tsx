import React from "react";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  copyButtonText?: string;
  onCopy?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Tak",
  cancelText = "Anuluj",
  onConfirm,
  onCancel,
  copyButtonText,
  onCopy,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={styles.modal}>
        {title && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <button 
              className={styles.closeButton}
              onClick={onCancel}
              aria-label="Zamknij"
            >
              ×
            </button>
          </div>
        )}
        
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={copyButtonText && onCopy ? styles.threeButtonActions : styles.actions}>
          {copyButtonText && onCopy ? (
            // Three-button layout: one wide button on top, two buttons below
            <>
              <button
                className={`${styles.button} ${styles.confirmButton} ${styles.wideButton}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
              <div className={styles.bottomButtonRow}>
                <button
                  className={`${styles.button} ${styles.cancelButton}`}
                  onClick={onCancel}
                  autoFocus
                >
                  {cancelText}
                </button>
                <button
                  className={`${styles.button} ${styles.copyButton}`}
                  onClick={onCopy}
                >
                  {copyButtonText}
                </button>
              </div>
            </>
          ) : (
            // Two-button layout: standard horizontal
            <>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={onCancel}
                autoFocus
              >
                {cancelText}
              </button>
              <button
                className={`${styles.button} ${styles.confirmButton}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
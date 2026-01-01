import React from "react";
import type { ReactNode } from "react";
import styles from "@ui/ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  copyButtonText?: string;
  onCopy?: () => void;
  notes?: string;
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
  notes,
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
      className="overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal">
        {title && (
          <div className="header">
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

        <div className="content">
          {notes && (
            <div className={styles.notesOnly}>
              {notes.split("\n").map((line, i) => (
                <p key={`note-${i}`} className={styles.notesText}>
                  <em>{line}</em>
                </p>
              ))}
            </div>
          )}
          {typeof message === "string" ? (
            message.split("\n").map((line, index) => (
              <p
                key={index}
                className={`${styles.message} ${
                  line.includes("✅")
                    ? styles.successMessage
                    : line.includes("❌")
                  ? styles.errorMessage
                  : ""
              }`}
            >
              {line}
            </p>
            ))
          ) : (
            message
          )}
        </div>

        <div className={styles.threeButtonHorizontal}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
            autoFocus
          >
            {cancelText}
          </button>
          {copyButtonText && onCopy && (
            <button
              className={`${styles.button} ${styles.confirmButton} ${styles.widerButton}`}
              onClick={onCopy}
            >
              {copyButtonText}
            </button>
          )}
          <button
            className={`${styles.button} ${styles.copyButton}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

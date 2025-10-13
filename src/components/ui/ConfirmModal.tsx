import React from "react";
import BaseModal from "./BaseModal";
import baseStyles from "./BaseModal.module.css";
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
  return (
    <BaseModal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className={baseStyles.content}>
        <p className={styles.message}>{message}</p>
      </div>

      <div
        className={
          copyButtonText && onCopy
            ? styles.threeButtonActions
            : baseStyles.actions
        }
      >
        {copyButtonText && onCopy ? (
          // Three-button layout: one wide button on top, two buttons below
          <>
            <button
              className={`${baseStyles.button} ${baseStyles.confirmButton} ${styles.wideButton}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <div className={styles.bottomButtonRow}>
              <button
                className={`${baseStyles.button} ${baseStyles.cancelButton}`}
                onClick={onCancel}
                autoFocus
              >
                {cancelText}
              </button>
              <button
                className={`${baseStyles.button} ${baseStyles.copyButton}`}
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
              className={`${baseStyles.button} ${baseStyles.cancelButton}`}
              onClick={onCancel}
              autoFocus
            >
              {cancelText}
            </button>
            <button
              className={`${baseStyles.button} ${baseStyles.confirmButton}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;

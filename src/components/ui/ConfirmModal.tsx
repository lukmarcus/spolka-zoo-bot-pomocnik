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

      <div className={baseStyles.actions}>
        <button
          className={`${baseStyles.button} ${baseStyles.cancelButton}`}
          onClick={onCancel}
          autoFocus
        >
          {cancelText}
        </button>
        {copyButtonText && onCopy && (
          <button
            className={`${baseStyles.button} ${baseStyles.copyButton}`}
            onClick={onCopy}
          >
            {copyButtonText}
          </button>
        )}
        <button
          className={`${baseStyles.button} ${baseStyles.confirmButton}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;

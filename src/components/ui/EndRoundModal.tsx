import React, { useState } from "react";
import styles from "@ui/EndRoundModal.module.css";
import confirmStyles from "@ui/ConfirmModal.module.css";

interface EndRoundModalProps {
  isOpen: boolean;
  botCount: number;
  onConfirm: (selectedBot: number) => void;
  onCancel: () => void;
}

const EndRoundModal: React.FC<EndRoundModalProps> = ({
  isOpen,
  botCount,
  onConfirm,
  onCancel,
}) => {
  const [selectedBot, setSelectedBot] = useState<number | null>(null);

  if (!isOpen) {
    // Reset state when modal closes
    if (selectedBot !== null) {
      setSelectedBot(null);
    }
    return null;
  }

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

  const handleConfirm = () => {
    if (botCount === 1) {
      onConfirm(1);
    } else if (selectedBot !== null) {
      onConfirm(selectedBot);
    }
  };

  // For single bot - simple confirmation
  if (botCount === 1) {
    return (
      <div
        className="overlay"
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="modal">
          <div className="header">
            <h3 className={confirmStyles.title}>KONIEC RUNDY</h3>
            <button
              className={confirmStyles.closeButton}
              onClick={onCancel}
              aria-label="Zamknij"
            >
              ×
            </button>
          </div>

          <div className="content">
            <p className={confirmStyles.message}>
              Czy na pewno chcesz zakończyć rundę?
            </p>
            <p className={confirmStyles.message}>
              Talia zostanie przetasowana.
            </p>
          </div>

          <div className={confirmStyles.threeButtonHorizontal}>
            <button
              className={`${confirmStyles.button} ${confirmStyles.cancelButton}`}
              onClick={onCancel}
            >
              Anuluj
            </button>
            <button
              className={`${confirmStyles.button} ${confirmStyles.confirmButton}`}
              onClick={handleConfirm}
            >
              Zakończ rundę
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For multiple bots - bot selection
  return (
    <div
      className="overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal">
        <div className="header">
          <h3 className={confirmStyles.title}>KONIEC RUNDY</h3>
          <button
            className={confirmStyles.closeButton}
            onClick={onCancel}
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>

        <div className="content">
          <p className={confirmStyles.message}>Który bot zaczyna nową rundę?</p>
          <p className={confirmStyles.message}>
            Wszystkie talie zostaną przetasowane.
          </p>
        </div>

        <div className={styles.botSelection}>
          {Array.from({ length: botCount }, (_, i) => i + 1).map((botNum) => (
            <button
              key={botNum}
              className={`${styles.botButton} ${
                botNum === selectedBot ? styles.selectedBot : ""
              }`}
              onClick={() => setSelectedBot(botNum)}
            >
              Bot {botNum}
            </button>
          ))}
        </div>

        <div className={confirmStyles.threeButtonHorizontal}>
          <button
            className={`${confirmStyles.button} ${confirmStyles.cancelButton}`}
            onClick={onCancel}
          >
            Anuluj
          </button>
          <button
            className={`${confirmStyles.button} ${confirmStyles.confirmButton}`}
            onClick={handleConfirm}
            disabled={selectedBot === null}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndRoundModal;

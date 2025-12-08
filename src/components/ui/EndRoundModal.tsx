import React from "react";
import styles from "@ui/EndRoundModal.module.css";
import confirmStyles from "@ui/ConfirmModal.module.css";

interface EndRoundModalProps {
  isOpen: boolean;
  botCount: number;
  currentBot: number;
  onConfirm: (selectedBot: number) => void;
  onCancel: () => void;
}

const EndRoundModal: React.FC<EndRoundModalProps> = ({
  isOpen,
  botCount,
  currentBot,
  onConfirm,
  onCancel,
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

  const handleBotSelect = (botNumber: number) => {
    onConfirm(botNumber);
  };

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
        </div>

        <div className={styles.botSelection}>
          {Array.from({ length: botCount }, (_, i) => i + 1).map((botNum) => (
            <button
              key={botNum}
              className={`${styles.botButton} ${
                botNum === currentBot ? styles.currentBot : ""
              }`}
              onClick={() => handleBotSelect(botNum)}
            >
              Bot {botNum}
            </button>
          ))}
        </div>

        <div className={styles.threeButtonHorizontal}>
          <button className="btn-secondary" onClick={onCancel}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndRoundModal;

import React from "react";

interface BottomControlsProps {
  onBackClick: () => void;
  backLabel?: string;
  showCopyButton?: boolean;
  onCopyClick?: () => void;
  copyButtonDisabled?: boolean;
  copyButtonLabel?: string;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  onBackClick,
  backLabel = "← Wróć do menu",
  showCopyButton = false,
  onCopyClick,
  copyButtonDisabled = false,
  copyButtonLabel = "Kopiuj stan gry",
}) => {
  return (
    <div className="bottom-controls">
      {showCopyButton && onCopyClick && (
        <button
          className="btn-tertiary"
          onClick={onCopyClick}
          disabled={copyButtonDisabled}
          aria-label="Skopiuj aktualny stan gry do schowka"
        >
          {copyButtonLabel}
        </button>
      )}
      <button className="btn-secondary" onClick={onBackClick}>
        {backLabel}
      </button>
    </div>
  );
};

export default BottomControls;

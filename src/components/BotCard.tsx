import React from "react";
import type { BotCard as BotCardType } from "../types";
import styles from "./BotCard.module.css";

interface BotCardProps {
  card: BotCardType;
  className?: string;
}

const BotCard: React.FC<BotCardProps> = ({ card, className }) => {
  // Determine effect labels based on number of effects
  const getEffectLabel = (index: number, totalEffects: number) => {
    if (totalEffects === 1) {
      return "Efekt";
    } else {
      if (index === 0) return "Pierwszy efekt";
      if (index === 1) return "Drugi efekt";
      return `Efekt ${index + 1}`; // fallback for more than 2 effects
    }
  };

  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.cardBody}>
        <div className={styles.effects}>
          {card.effects.map((effect, index) => (
            <div key={index} className={styles.effectSection}>
              <h4 className={styles.effectTitle}>
                {getEffectLabel(index, card.effects.length)}
              </h4>
              <p
                className={styles.effect}
                dangerouslySetInnerHTML={{ __html: effect }}
              />
            </div>
          ))}
        </div>

        {card.ability && (
          <div className={styles.ability}>
            <h4 className={styles.sectionTitle}>Zdolność dodatkowa</h4>
            <p
              className={styles.abilityText}
              dangerouslySetInnerHTML={{ __html: card.ability }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BotCard;

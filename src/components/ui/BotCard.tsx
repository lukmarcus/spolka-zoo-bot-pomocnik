import React from "react";
import type { BotCard as BotCardType } from "@lib/types";
import styles from "./BotCard.module.css";

interface BotCardProps {
  card: BotCardType;
  className?: string;
}

const BotCard: React.FC<BotCardProps> = ({ card, className }) => {
  // Determine effect labels based on number of effects
  const getEffectLabel = (index: number, totalEffects: number) => {
    if (totalEffects === 1) {
      return "EFEKT";
    } else {
      if (index === 0) return "PIERWSZY EFEKT";
      if (index === 1) return "DRUGI EFEKT";
      return `EFEKT ${index + 1}`; // fallback for more than 2 effects
    }
  };

  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.cardBody}>
        <div className={styles.sections}>
          {card.effects.map((effect, index) => (
            <div key={index} className={styles.section}>
              <h3 className={styles.sectionTitle}>
                {getEffectLabel(index, card.effects.length)}
              </h3>
              <p
                className={styles.sectionText}
                dangerouslySetInnerHTML={{ __html: effect }}
              />
            </div>
          ))}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>ZDOLNOSĆ DODATKOWA</h3>
            <p
              className={styles.sectionText}
              dangerouslySetInnerHTML={{ __html: card.ability as string }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;

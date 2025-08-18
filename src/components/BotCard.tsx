import React from "react";
import type { BotCard as BotCardType } from "../types";
import styles from "./BotCard.module.css";

interface BotCardProps {
  card: BotCardType;
  className?: string;
}

const BotCard: React.FC<BotCardProps> = ({ card, className }) => {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardName}>{card.name}</h3>
        <span className={styles.cardId}>#{card.id}</span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.effects}>
          <h4 className={styles.sectionTitle}>Efekty:</h4>
          <ul className={styles.effectsList}>
            {card.effects.map((effect, index) => (
              <li key={index} className={styles.effect}>
                {effect}
              </li>
            ))}
          </ul>
        </div>

        {card.ability && (
          <div className={styles.ability}>
            <h4 className={styles.sectionTitle}>Specjalna umiejętność:</h4>
            <p className={styles.abilityText}>{card.ability}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotCard;

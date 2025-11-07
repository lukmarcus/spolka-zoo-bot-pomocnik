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

  // build sections array (effects + ability) so we can render without an extra wrapper
  const sections = card.effects.map((effect, index) => ({
    key: `effect-${index}`,
    title: getEffectLabel(index, card.effects.length),
    html: effect,
  }));

  sections.push({
    key: `ability`,
    title: "ZDOLNOSĆ DODATKOWA",
    html: card.ability as string,
  });

  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.cardBody}>
        {sections.length > 1 ? (
          <div className={styles.sections}>
            {sections.map((s) => (
              <div key={s.key} className={styles.section}>
                <h3 className={styles.sectionTitle}>{s.title}</h3>
                <p
                  className={styles.sectionText}
                  dangerouslySetInnerHTML={{ __html: s.html }}
                />
              </div>
            ))}
          </div>
        ) : (
          // single section - render directly to avoid unnecessary wrapper
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{sections[0].title}</h3>
            <p
              className={styles.sectionText}
              dangerouslySetInnerHTML={{ __html: sections[0].html }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BotCard;

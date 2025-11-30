import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./Rules.module.css";

const Rules: React.FC = React.memo(() => {
  const navigate = useNavigate();

  const handleNavigateHome = useCallback(() => navigate("/"), [navigate]);

  return (
    <Layout
      backgroundType="home"
      title="ZASADY GRY"
      subtitle="Zasady specjalne dla botów"
    >
      <div className="card">
        <section className={styles.section}>
          <h2>BOT JAKO GRACZ</h2>
          <ul>
            <li>Ma własne pieniądze, owoce i udziały.</li>
            <li>Bierze udział w podziale Owoców.</li>
            <li>Może być pierwszym graczem i może wygrać grę.</li>
            <li>Reaguje na większość efektów w grze jak normalny gracz.</li>
          </ul>

          <h2>TALIA I TURA BOTA</h2>
          <ul>
            <li>Bot korzysta z talii 13 kart zamiast żetonów akcji.</li>
            <li>
              Odkrywa kartę i wykonuje wszystkie możliwe efekty z tej karty.
            </li>
            <li>
              Jeśli karta nie pozwala na wykonanie żadnego efektu, dobiera
              kolejną.
            </li>
            <li>Talia jest tasowana dopiero po jej całkowitym wyczerpaniu.</li>
          </ul>

          <h2>WYBORY BOTA (OWOCE I UDZIAŁY)</h2>
          <ul>
            <li>
              Bot zawsze wybiera pierwszą możliwą Spółkę od lewej strony
              planszy.
            </li>
            <li>
              Jeśli dany wybór jest niemożliwy, przechodzi do kolejnej Spółki po
              lewej→prawej.
            </li>
          </ul>

          <h2>POMOCNICY</h2>
          <ul>
            <li>
              Bot może zatrudniać Pomocników, jeśli pozwala na to karta i ma
              wymagane owoce.
            </li>
            <li>
              Zatrudnia pierwszego dostępnego Pomocnika od lewej strony rynku.
            </li>
            <li>
              Nie używa zdolności Pomocników, ale punkty z ich kart liczy na
              koniec gry.
            </li>
          </ul>

          <h2>MODUŁY DODATKOWE</h2>
          <ul>
            <li>Bot nie korzysta z Intryg ani Ukrytych Celów.</li>
            <li>
              Za każdy nieużywany moduł dostaje +20 monet (łącznie do +40).
            </li>
          </ul>

          <h2>ORGANIZACJA I OBSŁUGA BOTÓW</h2>
          <ul>
            <li>Każdy Bot ma własną pulę zasobów oznaczoną żetonami Bota.</li>
            <li>Tury Botów wykonuje gracz siedzący obok.</li>
            <li>Kilku Botów może działać jeden po drugim.</li>
            <li>
              W razie wątpliwości decyzje Bota zawsze wykonuje się według
              kolejności Spółek od lewej do prawej.
            </li>
          </ul>
        </section>
      </div>

      <div className="bottom-controls">
        <button className="btn-secondary" onClick={handleNavigateHome}>
          ← Wróć do menu
        </button>
      </div>
    </Layout>
  );
});

Rules.displayName = "Rules";

export default Rules;

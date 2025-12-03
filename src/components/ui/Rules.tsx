import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import styles from "@ui/Rules.module.css";

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
            <li>
              Działa jak normalny gracz: ma własne pieniądze, owoce i udziały.
            </li>
            <li>Bierze udział w podziale Owoców między Udziałowców.</li>
            <li>Może być pierwszym graczem i może wygrać grę.</li>
            <li>Większość efektów gry działa na niego normalnie.</li>
          </ul>

          <h2>TALIA I TURA BOTA</h2>
          <ul>
            <li>Bot korzysta z talii 13 kart zamiast żetonów akcji.</li>
            <li>
              Bot odkrywa kartę i wykonuje wszystkie możliwe efekty z tej karty.
            </li>
            <li>
              Jeśli karta nie pozwala na wykonanie żadnego efektu, Bot dobiera
              kolejną.
            </li>
            <li>Talia jest tasowana dopiero po jej całkowitym wyczerpaniu.</li>
          </ul>

          <h2>WYBORY BOTA (OWOCE I UDZIAŁY)</h2>
          <ul>
            <li>
              Bot zawsze wybiera pierwszą możliwą Spółkę od lewej do prawej.
            </li>
            <li>Dotyczy to zarówno wyboru Owocu, jak i zakupu Udziału.</li>
            <li>
              Kupując lub sprzedając zasoby, Bot normalnie zmienia ceny na
              torach cen.
            </li>
          </ul>

          <h2>POMOCNICY</h2>
          <ul>
            <li>
              Bot może zatrudnić Pomocnika, jeśli pozwala na to karta i posiada
              wymagane owoce.
            </li>
            <li>
              Zawsze wybiera pierwszego Pomocnika dostępnego od lewej strony
              rynku.
            </li>
            <li>
              Nie używa ich zdolności, a zdolności innych graczy nie dotyczą go,
              jeśli wymagają wyboru/decydowania.
            </li>
            <li>Punkty Chwały z Pomocników liczą się do wyniku końcowego.</li>
          </ul>

          <h2>MODUŁY DODATKOWE</h2>
          <ul>
            <li>Bot nie korzysta z Intryg ani Ukrytych Celów.</li>
            <li>
              Za każdy używany moduł Bot otrzymuje +20 monet (łącznie do +40).
            </li>
          </ul>

          <h2>ORGANIZACJA I OBSŁUGA BOTÓW</h2>
          <ul>
            <li>Każdy Bot ma własną pulę zasobów oznaczoną żetonami Bota.</li>
            <li>Ruchy Bota wykonuje gracz siedzący obok.</li>
            <li>Kilku Botów może działać jeden po drugim.</li>
          </ul>
        </section>
      </div>

      <BottomControls onBackClick={handleNavigateHome} />
    </Layout>
  );
});

Rules.displayName = "Rules";

export default Rules;

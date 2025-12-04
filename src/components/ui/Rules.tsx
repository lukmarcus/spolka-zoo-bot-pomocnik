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
          <h2>OGÓLNE ZASADY BOTA</h2>
          <ul>
            <li>Na potrzeby różnych efektów Bota uważa się za gracza.</li>
            <li>
              Boty obowiązują w większości takie same zasady co gracze (w tym
              dotyczące startowych pieniędzy, Owoców i żetonów Udziałów).
            </li>
            <li>
              Z żetonów Udziałów należy stworzyć osobną pulę dla każdego Bota.
            </li>
            <li>Bot może zostać Pierwszym Graczem.</li>
            <li>Bot może stać się Udziałowcem (także Większościowym).</li>
            <li>Bot bierze udział w podziale Owoców ze Spółek.</li>
            <li>
              Efekty kart Wpływu i Pomocników odnoszące się do graczy działają
              również na Boty.
            </li>
            <li>Bot może zostać zwycięzcą gry.</li>
          </ul>

          <h2>PRZYGOTOWANIE GRY</h2>
          <ul>
            <li>Łączna liczba graczy i Botów nie może przekroczyć pięciu.</li>
            <li>
              W przygotowaniu do rozgrywki należy uwzględnić Boty jako graczy.
            </li>
            <li>Każdy Bot rozpatruje swoją turę oddzielnie.</li>
            <li>Bot może rozgrywać turę bezpośrednio po turze innego Bota.</li>
          </ul>

          <h2>OBSŁUGA BOTA</h2>
          <ul>
            <li>
              Obsługą Bota zajmuje się zawsze jeden z sąsiadujących z nim
              graczy.
            </li>
            <li>
              Kupno lub sprzedaż dokonana przez Bota wpływa na ceny tak samo jak
              u graczy (przesuwa znacznik ceny).
            </li>
            <li>
              Wszystkie sporne sytuacje rozstrzyga się według kolejności plansz
              Spółek (od lewej do prawej).
            </li>
          </ul>

          <h2>BOT W TRAKCIE GRY</h2>
          <ul>
            <li>
              Boty nie używają żetonów Akcji — zastępuje je talia Bota (13
              kart).
            </li>
            <li>
              Gdy przychodzi tura Bota, gracz obsługujący odkrywa wierzchnią
              kartę talii.
            </li>
            <li>Karty Bota mogą mieć jeden lub dwa efekty.</li>
            <li>
              Jeśli możliwe jest wykonanie obu efektów z karty — należy je
              wykonać.
            </li>
            <li>
              Jeśli nie da się wykonać przynajmniej jednego efektu — karta jest
              odrzucana i dobierana jest kolejna.
            </li>
            <li>
              Dobieranie powtarza się aż do skutku (min. 1 efekt musi zostać
              wykonany).
            </li>
            <li>
              Jeśli talia się wyczerpie — przetasowuje się stos odrzuconych i
              tworzy nową talię.
            </li>
            <li>
              Talia jest tasowana wyłącznie wtedy, gdy została wyczerpana lub
              zakończyła się bieżąca runda.
            </li>
          </ul>

          <h2>POMOCNICY</h2>
          <ul>
            <li>
              Bot może zatrudniać Pomocników, lecz nigdy nie używa ich
              zdolności.
            </li>
            <li>Punkty Chwały z ich kart liczą się dla niego na koniec gry.</li>
            <li>
              Może zatrudnić Pomocnika tylko, jeśli efekt karty Bota na to
              pozwala i dysponuje odpowiednimi Owocami.
            </li>
            <li>Bot płaci koszt Owocami ze swojej puli.</li>
            <li>
              Przy zatrudnianiu zawsze sprawdza karty rynku od lewej (najbliżej
              stosu Pomocników).
            </li>
            <li>
              Jeśli stać go na pierwszego w kolejności — zatrudnia go; jeśli nie
              stać go na żadnego — nie zatrudnia nikogo.
            </li>
            <li>Po zakupie Pomocnika rynek należy uzupełnić.</li>
          </ul>

          <h2>WYBORY BOTA</h2>
          <ul>
            <li>
              Zawsze, gdy Bot dobiera/odrzuca/kupuje/sprzedaje Udział lub Owoc,
              wybór dokonywany jest według kolejności plansz Spółek — od lewej
              do prawej.
            </li>
            <li>
              Zasada ta dotyczy wszystkich wyborów związanych z zasobami Bota.
            </li>
            <li>
              Jest to również podstawowa reguła rozstrzygania niejasności.
            </li>
          </ul>

          <h2>MODUŁY DODATKOWE</h2>
          <ul>
            <li>Moduły można wykorzystywać w grze z udziałem Botów.</li>
            <li>
              Jeśli zasady modułów odnoszą się do „graczy”, obejmuje to również
              Boty.
            </li>
            <li>Wyjątek: Boty nie otrzymują kart Ukrytych Celów ani Intryg.</li>
            <li>
              Zamiast tego każdy Bot otrzymuje: +20 monet za brak jednego
              modułu, +40 monet jeśli nie używa się obu.
            </li>
          </ul>
        </section>
      </div>

      <BottomControls onBackClick={handleNavigateHome} />
    </Layout>
  );
});

Rules.displayName = "Rules";

export default Rules;

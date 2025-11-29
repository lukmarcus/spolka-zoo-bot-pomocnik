import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

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
        <section className="section">
          <h2>PODSTAWOWE ZASADY</h2>
          <p>Tutaj będą zasady gry z botami...</p>
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

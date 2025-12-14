import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@ui/Layout";

const AdvancedGame: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Layout
      backgroundType="game"
      title="TRYB ZAAWANSOWANY"
      subtitle="W budowie 🚧"
    >
      <div className="card">
        <section className="section">
          <h2>WKRÓTCE</h2>
          <p style={{ textAlign: "center", margin: "1rem 0" }}>
            Tryb zaawansowany z rundami, graczami i punktacją jest w budowie.
          </p>
          <button className="btn-secondary" onClick={handleBack}>
            Powrót do menu
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default AdvancedGame;

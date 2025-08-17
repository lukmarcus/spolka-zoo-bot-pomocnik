import React from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Spółka ZOO" }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {title !== "Spółka ZOO" && (
          <p className={styles.subtitle}>Bot Pomocnik</p>
        )}
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>v0.0.1 • Pomocnik do gry planszowej</p>
      </footer>
    </div>
  );
};

export default Layout;

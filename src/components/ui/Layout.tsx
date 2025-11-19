import React, { useEffect } from "react";
import styles from "./Layout.module.css";
import packageJson from "../../../package.json";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backgroundType?: "home" | "game" | "default";
  logo?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "SPÓŁKA ZOO",
  subtitle,
  backgroundType = "default",
  logo,
}) => {
  useEffect(() => {
    const body = document.body;

    body.classList.remove("bg-home", "bg-game");

    switch (backgroundType) {
      case "home":
        body.classList.add("bg-home");
        break;
      case "game":
        body.classList.add("bg-game");
        break;
      default:
        break;
    }

    return () => {
      body.classList.remove("bg-home", "bg-game");
    };
  }, [backgroundType]);

  return (
    <div className={styles.layout}>
      {(title || logo) && (
        <header className={styles.header}>
          {logo && <div className={styles.logoSection}>{logo}</div>}
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        v{packageJson.version} • Marek Szumny • Spółka ZOO • Bot Pomocnik
      </footer>
    </div>
  );
};

export default Layout;

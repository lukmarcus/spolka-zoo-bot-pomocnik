import React, { useEffect } from "react";
import styles from "./Layout.module.css";
import packageJson from "../../../package.json";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backgroundType?: "home" | "game" | "default";
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "SPÓŁKA ZOO",
  subtitle,
  backgroundType = "default",
}) => {
  useEffect(() => {
    // Apply background class to body for full-screen coverage
    const body = document.body;

    // Remove any existing background classes
    body.classList.remove("bg-home", "bg-game");

    // Add the appropriate background class
    switch (backgroundType) {
      case "home":
        body.classList.add("bg-home");
        break;
      case "game":
        body.classList.add("bg-game");
        break;
      default:
        // Use default gradient background (no additional class needed)
        break;
    }

    // Cleanup function to remove background classes when component unmounts
    return () => {
      body.classList.remove("bg-home", "bg-game");
    };
  }, [backgroundType]);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          v{packageJson.version} • Spółka ZOO • Bot Pomocnik
        </p>
      </footer>
    </div>
  );
};

export default Layout;

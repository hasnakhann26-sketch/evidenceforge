import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  rightContent?: ReactNode;
}

export function Header({ rightContent }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="EvidenceForge home">
          <span className={styles.logoIcon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </span>
          <span className={styles.logoText}>EvidenceForge</span>
        </Link>
        {rightContent && <div className={styles.right}>{rightContent}</div>}
      </div>
    </header>
  );
}

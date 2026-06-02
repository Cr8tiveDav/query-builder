import { useEffect } from "react";

interface ShortcutOptions {
  onRunQuery?: () => void;
  onSavePreset?: () => void;
  onResetQuery?: () => void;
  onCloseModals?: () => void;
}

/**
 * Custom React Hook mapping visual builder workspace actions to global keyboard hotkeys.
 */
export const useKeyboardShortcuts = ({
  onRunQuery,
  onSavePreset,
  onResetQuery,
  onCloseModals,
}: ShortcutOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // 1. Execute Query: Cmd/Ctrl + Enter
      if (isCmdOrCtrl && e.key === "Enter") {
        if (onRunQuery) {
          e.preventDefault();
          onRunQuery();
        }
      }

      // 2. Save Preset: Cmd/Ctrl + S
      if (isCmdOrCtrl && e.key.toLowerCase() === "s") {
        if (onSavePreset) {
          e.preventDefault();
          onSavePreset();
        }
      }

      // 3. Reset Editor: Ctrl + Alt + R
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "r") {
        if (onResetQuery) {
          e.preventDefault();
          onResetQuery();
        }
      }

      // 4. Escape: Close Modals
      if (e.key === "Escape") {
        if (onCloseModals) {
          e.preventDefault();
          onCloseModals();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRunQuery, onSavePreset, onResetQuery, onCloseModals]);
};

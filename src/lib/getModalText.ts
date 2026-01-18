import modalTexts from "./modalTexts.json";

type Notes = string[];

export function getModalText(
  screen: string,
  key: string
): { message: string; notes?: Notes } {
  const modalRoot = modalTexts as unknown;
  if (typeof modalRoot !== "object" || modalRoot === null) {
    return { message: `[BŁĄD: modalTexts nie jest obiektem]`, notes: [] };
  }

  const screenObj = (modalRoot as Record<string, unknown>)[screen];
  if (typeof screenObj !== "object" || screenObj === null) {
    return { message: `[BŁĄD: brakuje sekcji '${screen}']`, notes: [] };
  }

  const parts = key.split(".");

  // Walk the path while keeping track of parent nodes for inheritance
  let node: unknown = screenObj;
  const visited: unknown[] = [node];
  for (const p of parts) {
    if (typeof node !== "object" || node === null) {
      node = undefined;
      break;
    }
    node = (node as Record<string, unknown>)[p];
    visited.push(node);
  }

  // If the node is a primitive string, treat it as the message
  if (typeof node === "string") {
    return { message: node, notes: undefined };
  }

  // Collect message: prefer the most-specific (child) message, otherwise climb parents
  let message: string | undefined;
  for (let i = visited.length - 1; i >= 0; i--) {
    const v = visited[i];
    if (typeof v === "object" && v !== null && typeof (v as Record<string, unknown>)['message'] === 'string') {
      message = (v as Record<string, unknown>)['message'] as string;
      break;
    }
  }

  // Collect notes: merge arrays from parent -> child (parent first)
  const notesCollected: string[] = [];
  for (let i = 0; i < visited.length; i++) {
    const v = visited[i];
    if (typeof v === "object" && v !== null) {
      const n = (v as Record<string, unknown>)['notes'];
      if (Array.isArray(n)) {
        notesCollected.push(...(n as string[]));
      }
    }
  }

  return {
    message: message ?? `[BŁĄD: brakuje wartości dla '${screen}.${key}']`,
    notes: notesCollected.length ? notesCollected : undefined,
  };
}

export default getModalText;

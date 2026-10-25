import type { SpellCastEvent } from "./types";
//Gestion des événements
export function handleSpellCast(event: SpellCastEvent): string {
  return `Wizard ${event.wizardId} cast ${event.spellName}`;
}

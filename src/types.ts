export const HOUSES = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"] as const;
export type House = (typeof HOUSES)[number];

export interface Wizard {
  id: number;
  name: string;
  house: House;
  level: number;
  active: boolean;
  [key: string]: string | number | boolean;
}

export type SpellCategory = "attack" | "defense" | "healing";
export interface Spell {
  id: number;
  name: string;
  category: SpellCategory;
  power: number;
}

export type AcademyEvent =
  | { type: "spell-cast"; wizardId: number; spellName: string }
  | { type: "level-up"; wizardId: number; newLevel: number }
  | { type: "wizard-expelled"; wizardId: number };

export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;
export type SpellOutput<T extends SpellCategory> =
  T extends "attack" ? number :
  T extends "defense" ? boolean :
  T extends "healing" ? string : never;
export type ArrayElement<T> = T extends (infer Item)[] ? Item : never;

// Wizard has an index signature; Pick restores the required fields after Omit.
export type NewWizard = Omit<Wizard, "id"> & Pick<Wizard, "name" | "house" | "level" | "active">;
export type WizardSummary = Pick<Wizard, "id" | "name" | "house">;
export type WizardUpdate = Partial<Omit<Wizard, "id">>;
export type AttackSpell = Spell & { category: "attack" };
export type NonHealingCategory = Exclude<SpellCategory, "healing">;
export type HousePoints = Record<House, number>;

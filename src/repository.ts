import type { Wizard, Spell, NewWizard, House } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export interface ReadRepository<T extends { id: number }> {
  findById(id: number): T | undefined;
  getAll(): T[];
}
export interface WriteRepository<T extends { id: number }> {
  add(item: T): void;
  update(id: number, changes: Partial<Omit<T, "id">>): boolean;
}

// Stockage et recherche
export class Repository<T extends { id: number }> implements ReadRepository<T>, WriteRepository<T> {
  private readonly items = new Map<number, T>();

  @Log
  add(item: T): void {
    if (this.items.has(item.id)) throw new Error(`Duplicate id: ${item.id}`);
    this.items.set(item.id, { ...item });
  }

  @MeasureTime
  findById(id: number): T | undefined {
    const item = this.items.get(id);
    return item ? { ...item } : undefined;
  }

  getAll(): T[] { return [...this.items.values()].map(item => ({ ...item })); }

  update(id: number, changes: Partial<Omit<T, "id">>): boolean {
    const item = this.items.get(id);
    if (!item) return false;
    if ("id" in changes) throw new Error("Cannot change an entity id");
    this.items.set(id, { ...item, ...changes });
    return true;
  }
}

export interface WizardReader extends ReadRepository<Wizard> {
  findByHouse(house: House): Wizard[];
}
export interface SpellReader extends ReadRepository<Spell> {}

export class WizardRepository extends Repository<Wizard> implements WizardReader {
  addWizard(data: NewWizard): Wizard {
    const nextId = this.getAll().reduce((max, wizard) => Math.max(max, wizard.id), 0) + 1;
    const wizard: Wizard = { ...data, id: nextId };
    this.add(wizard);
    return { ...wizard };
  }

  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> implements SpellReader {
  @ValidateSpellPower
  override add(spell: Spell): void { super.add(spell); }
}

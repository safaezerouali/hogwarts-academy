import type { AcademyEvent, House, SpellCastEvent, WizardSummary, WizardUpdate } from "./types";
import type { WizardReader, SpellReader, WriteRepository } from "./repository";
import type { Wizard } from "./types";
import { Log } from "./decorators";

// Logique métier
export class AcademyService {
  constructor(
    private readonly wizards: WizardReader & Pick<WriteRepository<Wizard>, "update">,
    private readonly spells: SpellReader
  ) {}

  @Log
  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);
    const spell = this.spells.findById(spellId);
    if (!wizard || !spell) throw new Error("Wizard or spell not found");
    return `${wizard.name} casts ${spell.name}!`;
  }

  findByHouse(house: House): WizardSummary[] {
    return this.wizards.findByHouse(house).map(({ id, name, house }) => ({ id, name, house }));
  }

  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }

  getSpellEvents(events: readonly AcademyEvent[]): SpellCastEvent[] {
    return events.filter((event): event is SpellCastEvent => event.type === "spell-cast");
  }
}

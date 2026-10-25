import { AcademyService } from "./academy-service";
import { WizardRepository, SpellRepository } from "./repository";
import { SpellCalculator } from "./spell-calculator";
import { handleSpellCast } from "./event-handler";
import { isWizard } from "./guards";
import type { AcademyEvent, HousePoints } from "./types";

const wizards = new WizardRepository();
const spells = new SpellRepository();
const academy = new AcademyService(wizards, spells);

wizards.add({ id: 1, name: "Harry Potter", house: "Gryffindor", level: 5, active: true, patronus: "Stag" });
wizards.add({ id: 2, name: "Hermione Granger", house: "Gryffindor", level: 8, active: true });
wizards.add({ id: 3, name: "Draco Malfoy", house: "Slytherin", level: 6, active: true });
spells.add({ id: 101, name: "Expelliarmus", category: "attack", power: 80 });
spells.add({ id: 102, name: "Protego", category: "defense", power: 60 });

console.log("\n--- Cast a spell ---");
console.log(academy.castSpell(1, 101));
console.log("\n--- Find wizards by house ---");
console.log(academy.findByHouse("Gryffindor"));
console.log("\n--- Update a wizard ---");
academy.updateWizard(1, { level: 6 });
console.log(wizards.findById(1));
console.log("\n--- Type guard ---");
const unknownWizard: unknown = wizards.findById(1);
if (isWizard(unknownWizard)) console.log(`${unknownWizard.name} belongs to ${unknownWizard.house}`);
console.log("\n--- Record utility type ---");
const points: HousePoints = { Gryffindor: 100, Slytherin: 80, Ravenclaw: 90, Hufflepuff: 70 };
console.log(points);
console.log("\n--- Extract spell-cast events ---");
const events: AcademyEvent[] = [
  { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
  { type: "level-up", wizardId: 2, newLevel: 9 },
  { type: "wizard-expelled", wizardId: 3 }
];
console.log(academy.getSpellEvents(events));

console.log("\n--- Exercice 1 : NewWizard ---");
console.log(wizards.addWizard({ name: "Luna Lovegood", house: "Ravenclaw", level: 4, active: true }));
console.log("\n--- Exercice 2 : findByHouse ---");
console.log(wizards.findByHouse("Gryffindor"));
console.log("\n--- Exercice 3 : Extract ---");
console.log(handleSpellCast({ type: "spell-cast", wizardId: 1, spellName: "Expelliarmus" }));
console.log("\n--- Exercice 4 : ValidateSpellPower ---");
spells.add({ id: 104, name: "Lumos", category: "defense", power: 50 });
try { spells.add({ id: 105, name: "Invalid Spell", category: "attack", power: -10 }); }
catch (error) { console.log("Sort rejeté :", error instanceof Error ? error.message : error); }
console.log("\n--- Exercice 5 : Cache ---");
const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(5, 2));
console.log("\n--- Exercice 6 : Type Guards ---");
console.log(isWizard({ id: 1, name: "Harry Potter", house: "Gryffindor", level: 5, active: true }));
console.log(isWizard({ id: 2, name: "Viktor", house: "Durmstrang", level: 5, active: true }));

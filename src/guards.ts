import { HOUSES, type House, type Wizard } from "./types";

export function isHouse(value: unknown): value is House {
  return typeof value === "string" && HOUSES.some(house => house === value);
}
//Validation des données
export function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "number" && Number.isInteger(candidate.id) &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" && Number.isFinite(candidate.level) &&
    typeof candidate.active === "boolean";
}

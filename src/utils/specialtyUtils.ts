// utils/specialtyUtils.ts
import {
  specialties as allSpecialties,
  Specialty,
} from "@/constants/specialties";

const PRIORITY_ORDER = [
  "General Practice",
  "Pediatrics",
  "Cardiology",
  "Pulmonologist",
  "Nephrologist",
  "Gastro-enterologist",
];

export const getPrioritizedSpecialties = (): Specialty[] => {
  const prioritized: Specialty[] = [];
  const remaining: Specialty[] = [];

  allSpecialties.forEach((specialty) => {
    const priorityIndex = PRIORITY_ORDER.indexOf(specialty.name);
    if (priorityIndex !== -1) {
      prioritized[priorityIndex] = specialty;
    } else {
      remaining.push(specialty);
    }
  });

  return [...prioritized.filter(Boolean), ...remaining];
};

export const getDisplayedSpecialties = (
  specialties: Specialty[],
  showAll: boolean,
  limit: number = 6
): Specialty[] => {
  return showAll ? specialties : specialties.slice(0, limit);
};

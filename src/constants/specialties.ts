export interface Specialty {
  id: string;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
  created_at: string;
  icon: string | null;
  color: string | null;
}

// Static list of specialties
export const specialties: Specialty[] = [
  {
    id: "7ebf058d-8ca5-4701-b18a-835128f0de19",
    name: "General Practice",
    description: "Primary healthcare and general medical services",
    category: "Primary Care",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: "/assets/body-icons/healthicons--stethoscope.svg",
    color: "bg-cyan-50",
  },
  {
    id: "3e4fd438-5fba-4fe2-badc-196adf868a27",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
    category: "Pediatrics",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: "/assets/body-icons/healthicons--child-program.svg",
    color: "bg-sky-50",
  },
  {
    id: "661b90b9-50c2-483b-941c-8a0e3dfbaa10",
    name: "Cardiology",
    description: "Heart and cardiovascular system disorders",
    category: "Cardiology",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: "/assets/body-icons/healthicons--heart-organ.svg",
    color: "bg-rose-50",
  },
  {
    id: "137e8069-b74a-433e-8a59-949c8ffbb351",
    name: "Pulmonologist",
    description: "Lung and respiratory system care",
    category: "Pulmonology",
    is_active: true,
    created_at: "2025-07-10 08:10:04.029757+00",
    icon: "/assets/body-icons/healthicons--lungs-24px.svg",
    color: "bg-teal-50",
  },
  {
    id: "69de6f1f-dbda-41ef-86f0-7d60f6b6e7af",
    name: "Nephrologist",
    description: "Kidney health and treatment",
    category: "Nephrology",
    is_active: true,
    created_at: "2025-07-10 08:10:04.029757+00",
    icon: "/assets/body-icons/healthicons--kidneys-24px.svg",
    color: "bg-violet-50",
  },
  {
    id: "bc766450-9010-41c6-8fda-20e221991b09",
    name: "Gastro-enterologist",
    description: "Digestive system health",
    category: "Gastroenterology",
    is_active: true,
    created_at: "2025-07-10 08:10:04.029757+00",
    icon: "/assets/body-icons/healthicons--stomach.svg",
    color: "bg-lime-50",
  },

  // Other specialties
  {
    id: "38369fb7-cc4b-4325-ad16-4101d1843759",
    name: "Internal Medicine",
    description: "Diagnosis and treatment of adult diseases",
    category: "Internal Medicine",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: null,
    color: null,
  },
  {
    id: "495dc094-0ee5-4adc-b847-3001f37f7e4d",
    name: "Dermatology",
    description: "Skin, hair, and nail disorders",
    category: "Dermatology",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: null,
    color: null,
  },
  {
    id: "b7843f71-abfe-4986-aa1d-781877d8b198",
    name: "Orthopedics",
    description: "Musculoskeletal system disorders",
    category: "Orthopedics",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: null,
    color: null,
  },
  {
    id: "c519d8b5-721d-4d7f-b17e-24c2801ba6e3",
    name: "Gynecology",
    description: "Female reproductive system health",
    category: "Gynecology",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: null,
    color: null,
  },
  {
    id: "d06c9704-e8db-4917-832c-11f6b2c864fd",
    name: "Psychiatry",
    description: "Mental health and psychiatric disorders",
    category: "Psychiatry",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: null,
    color: null,
  },
  {
    id: "f0b4c404-9c18-4877-b237-94309180bf26",
    name: "Radiology",
    description: "Medical imaging and diagnostic procedures",
    category: "Radiology",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: null,
    color: null,
  },
  {
    id: "ba0c0f46-19da-4252-adcc-47a96a4b07b3",
    name: "Surgery",
    description: "Surgical procedures and operative medicine",
    category: "Surgery",
    is_active: true,
    created_at: "2025-07-10 07:37:56.367004+00",
    icon: null,
    color: null,
  },
];

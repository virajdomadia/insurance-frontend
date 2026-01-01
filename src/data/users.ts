export type DemoUser = {
  id: string;
  name: string;
  role: "citizen" | "ngo" | "admin";
  phone: string;
  otp: string;
};

export const demoUsers: DemoUser[] = [
  {
    id: "cit-001",
    name: "Ramesh Kumar",
    role: "citizen",
    phone: "9000000001",
    otp: "111111",
  },
  {
    id: "cit-002",
    name: "Sita Devi",
    role: "citizen",
    phone: "9000000002",
    otp: "222222",
  },
  {
    id: "ngo-001",
    name: "Seva Foundation",
    role: "ngo",
    phone: "9000000010",
    otp: "101010",
  },
  {
    id: "ngo-002",
    name: "Arogya Mitra Trust",
    role: "ngo",
    phone: "9000000011",
    otp: "111000",
  },
  {
    id: "adm-001",
    name: "CSR Admin",
    role: "admin",
    phone: "9000000099",
    otp: "999999",
  },
];

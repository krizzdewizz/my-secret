export type Secret = {
  name: string;
  user: string;
  password: string;
  info0: string;
  info1: string;
  tags?: string[];
  new?: boolean; // to help ui. not persisted
};

export type MySecret = {
  secrets: Secret[];
};

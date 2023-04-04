export type Secret = {
  name: string;
  user: string;
  password: string;
  info0: string;
  info1: string;
};

export type MySecret = {
  secrets: Secret[];
};

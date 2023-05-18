let pw: string;

export const setPassword: (password: string) => string = (
  password: string
): string => (pw = password);

export const getPassword: () => string = (): string => pw;

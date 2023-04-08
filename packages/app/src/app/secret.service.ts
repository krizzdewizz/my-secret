import { Injectable } from "@angular/core";
import {
  decrypt,
  encrypt,
  error,
  MySecret,
  ok,
  Result,
  Secret
} from "@my-secret/my-secret";

const STORAGE_KEY = "my-secret";

export type InitialNew = { type: "new" };
export type InitialImportedData = { type: "importedData"; secret: MySecret };
export type InitialEncryptedData = {
  type: "encryptedData";
  encryptedData: string;
};

export type AppStateInitial = {
  state: "initial";
  initial?: InitialNew | InitialImportedData | InitialEncryptedData;
};

export type AppStateOpen = {
  state: "open";
  secret: MySecret;
};

export type AppStateSecretsPresent = {
  state: "secretsPresent";
  data: string;
};

export type AppState = AppStateInitial | AppStateSecretsPresent | AppStateOpen;

const INITIAL_STATE: AppState = {
  state: "initial"
};

export type UploadAction = "upload" | "import";

const generatePassword = () =>
  encrypt(
    String(Date.now() + Math.random()),
    String(Math.random())
  ).value.slice(0, 20);

const newSecret = (): Secret => {
  return {
    name: "secret name",
    user: "user",
    password: generatePassword(),
    info0: "",
    info1: "",
    new: true
  };
};

const DEFAULT: MySecret = {
  secrets: [newSecret()]
};

@Injectable({
  providedIn: "root"
})
export class SecretService {
  state: AppState = INITIAL_STATE;

  createNew(): Result<void> {
    if (this.state.state !== "initial") {
      return error("invalid state. expected 'initial'");
    }

    this.state = {
      state: "initial",
      initial: { type: "new" }
    };

    return ok(undefined);
  }

  upload(data: string, { action }: { action: UploadAction }): Result<void> {
    if (this.state.state !== "initial") {
      return error("invalid state. expected 'initial'");
    }
    return action === "import" ? this.importData(data) : this.uploadData(data);
  }

  open(password: string): Result<MySecret> {
    const ms = localStorage.getItem(STORAGE_KEY);
    if (!ms) {
      return error("secret data not found");
    }
    const decryptRes = decrypt(password, ms);
    if (decryptRes.outcome === "error") {
      return decryptRes.error;
    }
    return ok(JSON.parse(decryptRes.value));
  }

  init(): void {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      this.state = { state: "secretsPresent", data };
    } else {
      this.state = INITIAL_STATE;
    }
  }

  create(password: string): Result<void> {
    if (this.state.state !== "initial") {
      return error("invalid state. expected 'initial'");
    }

    const { initial } = this.state;
    if (!initial) {
      return error("invalid state. expected 'initial' property");
    }

    const { type } = initial;

    if (type === "encryptedData") {
      const decryptRes = decrypt(password, initial.encryptedData);
      if (decryptRes.outcome === "error") {
        return decryptRes.error;
      }

      localStorage.setItem(STORAGE_KEY, initial.encryptedData);
      this.state = {
        state: "open",
        secret: JSON.parse(decryptRes.value)
      };
    } else {
      const secret = initial.type === "new" ? DEFAULT : initial.secret;

      const encryptedRes = encrypt(password, JSON.stringify(secret));
      if (encryptedRes.outcome === "error") {
        return encryptedRes.error;
      }

      localStorage.setItem(STORAGE_KEY, encryptedRes.value);
      this.state = {
        state: "open",
        secret
      };
    }

    return ok(undefined);
  }

  unlock(password: string): Result<void> {
    if (this.state.state !== "secretsPresent") {
      return error("invalid state. expected 'secretsPresent'");
    }

    const decryptRes = decrypt(password, this.state.data);
    if (decryptRes.outcome === "error") {
      return error("access denied");
    }

    this.state = {
      state: "open",
      secret: JSON.parse(decryptRes.value)
    };

    return ok(undefined);
  }

  exportSecrets(): Result<void> {
    if (this.state.state !== "open") {
      return error("invalid state. expected 'open'");
    }

    const data = JSON.stringify(this.state.secret, undefined, 2);
    this.doDownload(data, "my-secrets.json");
    return ok(undefined);
  }

  downloadSecrets(): Result<void> {
    const secrets = localStorage.getItem(STORAGE_KEY);
    if (!secrets) {
      return error("invalid state. No secrets found in local storage");
    }
    this.doDownload(secrets, "my-secrets");
    return ok(undefined);
  }

  saveSecrets(password: string, secret: MySecret): Result<void> {
    if (this.state.state !== "open") {
      return error("invalid state. expected 'open'");
    }

    const encryptedRes = encrypt(password, JSON.stringify(secret));
    if (encryptedRes.outcome === "error") {
      return encryptedRes.error;
    }

    localStorage.setItem(STORAGE_KEY, encryptedRes.value);

    return ok(undefined);
  }

  addSecret(): Result<void> {
    if (this.state.state !== "open") {
      return error("invalid state. expected 'open'");
    }

    this.state.secret.secrets = [newSecret(), ...this.state.secret.secrets];

    return ok(undefined);
  }

  deleteSecret(secret: Secret): Result<void> {
    if (this.state.state !== "open") {
      return error("invalid state. expected 'open'");
    }

    this.state.secret.secrets = this.state.secret.secrets.filter(
      s => s !== secret
    );

    return ok(undefined);
  }

  reset(): Result<void> {
    localStorage.removeItem(STORAGE_KEY);
    this.state = INITIAL_STATE;

    return ok(undefined);
  }

  private uploadData(encryptedData: string): Result<void> {
    this.state = {
      state: "initial",
      initial: { type: "encryptedData", encryptedData }
    };
    return ok(undefined);
  }

  private importData(data: string): Result<void> {
    try {
      const secret: MySecret = JSON.parse(data); // JSON validation
      if (!secret.secrets) {
        return error("invalid my-secret data");
      }

      this.state = {
        state: "initial",
        initial: { type: "importedData", secret }
      };
      return ok(undefined);
    } catch (err: unknown) {
      const e = err as { message: string };
      return error(`error while saving data: ${e.message || err}`);
    }
  }

  private doDownload(data: string, file: string) {
    const downloadUrl = URL.createObjectURL(new Blob([data]));

    const el = document.createElement("a");
    el.setAttribute("href", downloadUrl);
    el.setAttribute("download", file);
    el.click();
    URL.revokeObjectURL(downloadUrl);
  }
}

import { Injectable } from "@angular/core";
import {
  decrypt,
  encrypt,
  error,
  MySecret,
  ok,
  Result,
} from "@my-secret/my-secret";

const STORAGE_KEY = "my-secret";

const DEFAULT: MySecret = { secrets: [] };

export type InitialNew = { type: "new" };
export type InitialUploadedData = { type: "uploadedData"; secret: MySecret };

export type AppStateInitial = {
  state: "initial";
  initial?: InitialNew | InitialUploadedData;
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
  state: "initial",
};

@Injectable({
  providedIn: "root",
})
export class SecretService {
  state: AppState = INITIAL_STATE;

  createNew(): Result<void> {
    if (this.state.state !== "initial") {
      return error("invalid state. expected 'initial'");
    }

    this.state = {
      state: "initial",
      initial: { type: "new" },
    };

    return ok(undefined);
  }

  uploadedData(data: string): Result<void> {
    if (this.state.state !== "initial") {
      return error("invalid state. expected 'initial'");
    }

    try {
      const secret: MySecret = JSON.parse(data); // JSON validation
      if (!secret.secrets) {
        return error("invalid my-secret data");
      }

      this.state = {
        state: "initial",
        initial: { type: "uploadedData", secret },
      };
      return ok(undefined);
    } catch (err: any) {
      return error(`error while saving data: ${err.message}`);
    }
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

    return ok(undefined);
  }

  unlock(password: string): Result<void> {
    if (this.state.state !== "secretsPresent") {
      return error("invalid state. expected 'secretsPresent'");
    }

    const decryptRes = decrypt(password, this.state.data)
    if (decryptRes.outcome === 'error') {
      return error('access denied');
    }

    this.state = {
      state: 'open',
      secret: JSON.parse(decryptRes.value)
    }

    return ok(undefined);
  }
}

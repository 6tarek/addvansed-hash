# **addvansed-hash** v2.0.0 – Extended Edition

**Release Date:** 2025-03-03  
**Author:** [Your Name or Team]

## **Overview**

This major release brings **robust RSA key handling**, **enhanced SHA-256** signing/verification, and a **revamped Password module** supporting both synchronous and asynchronous operations. We have also standardized error messages, enriched TypeScript definitions, and introduced additional security best practices.  

If you’re upgrading from a previous version, check out the **Migration Notes** for essential changes.

---

## **Table of Contents**

1. [Highlights](#highlights)  
   1.1 [RSA Key Enhancements](#rsa-key-enhancements)  
   1.2 [SHA-256 Overhaul](#sha-256-overhaul)  
   1.3 [Password Module Revamp](#password-module-revamp)  
   1.4 [Refined Error Handling](#refined-error-handling)  
   1.5 [TypeScript Improvements](#typescript-improvements)  
2. [Breaking Changes](#breaking-changes)  
3. [Migration Notes](#migration-notes)  
4. [Example Usage](#example-usage)  
   4.1 [Password Hashing](#password-hashing)  
   4.2 [RSA Encryption (Async)](#rsa-encryption-async)  
   4.3 [SHA-256 Sign & Verify](#sha-256-sign--verify)  
5. [Contribute & Support](#contribute--support)  
6. [License](#license)

---

## **Highlights** <a id="highlights"></a>

### 1.1 **RSA Key Enhancements** <a id="rsa-key-enhancements"></a>
- **Async RSA Key Generation**  
  - `JWT.RSASync.GenrateKeys()` now relies on the **non-blocking** `generateKeyPair` under the hood.  
  - This improvement prevents event-loop blocking during 2048-bit RSA key creation in production apps.  

- **Consistent PEM/DER Format**  
  - No more `toString("hex")` for private keys. The library stores RSA keys in standard **PEM** format.  
  - Fixes `DECODER routines::unsupported` errors when encrypting or decrypting with Node.js.  

- **Unified RSA Encryption API**  
  - `publicEncrypt` is used by default. If it fails, we gracefully fallback to `privateEncrypt` only for specialized use cases.  
  - Clear error messages for invalid or unsupported keys.

### 1.2 **SHA-256 Overhaul** <a id="sha-256-overhaul"></a>
- **Sign / Verify with Extended Options**  
  - `JWT.SHA256.Sign` and `JWT.SHA256.Verify` can now handle typical JWT-like fields: `iat`, `exp`, `nbf`, `iss`, `sub`, `aud`, `jti`.  
  - Built-in checks for `exp` (expiration) and `nbf` (not before) automatically throw an error or return `Error` if the token is expired or inactive.  

- **Async Wrapper**  
  - `JWT.SHA256Sync` (previously `SHA256Sync`) returns **Promises** instead of direct values, letting you integrate with async/await more easily.  

- **Improved Defaults**  
  - Default `encoding` is `"hex"`, but you can switch to `"base64"`, `"base64url"`, or `"latin1"` to meet your project’s requirements.  

### 1.3 **Password Module Revamp** <a id="password-module-revamp"></a>
- **Synchronous (`Hash.Password`)**  
  - **Hash**: One-step password hashing that combines `bcrypt` with optional encryption logic.  
  - **Match**: Verifies a hashed password. Returns a boolean or an `Error` if something goes wrong.  

- **Asynchronous (`Hash.PasswordSync`)**  
  - **Hash**: Returns a `Promise<string | void>`, ideal for non-blocking environments.  
  - **Match**: Returns a `Promise<boolean | Error>` for streamlined error handling.  

- **Clearer Error Handling**  
  - Distinguishes between invalid keys, short passwords, and mismatch scenarios.  
  - Synchronous usage remains backward-compatible, though async is recommended for production-scale apps.

### 1.4 **Refined Error Handling** <a id="refined-error-handling"></a>
- **Unified Error Format**  
  - All library functions now either throw or return a consistent `Error` object with standardized messages.  
  - `erroHandel` has been renamed to `errorHandle` for clarity.  

- **Enhanced Logging**  
  - If you catch an error, you’ll see a uniform structure, making it simpler to log or display in UIs.  
  - Optional custom error classes (e.g., `TokenExpiredError`) can be integrated in future expansions.

### 1.5 **TypeScript Improvements** <a id="typescript-improvements"></a>
- **Class Fields**  
  - Public/Private static fields are declared using official TypeScript syntax, ensuring better IDE intellisense.  
- **Interfaces**  
  - `Sha256SignOptions` & `Sha256DecryptOptions` extended for additional JWT-like fields (`iss`, `aud`, `sub`, `nbf`).  
- **Manual Testing & Jest**  
  - Provided `manual-test.ts` for quick local checks without a full test framework.  
  - Updated `jest.config` for `ts-jest` usage, so you can run advanced test suites if needed.

---

## **Breaking Changes** <a id="breaking-changes"></a>

1. **Private Key Format**  
   - Private keys are now **PEM**-based, not hex. If your application stored hex-encoded keys, you must convert them back to PEM.

2. **`erroHandel` → `errorHandle`**  
   - All references to the old `erroHandel` function have been replaced. Update your calls accordingly if you used that function name.

3. **New Default Encodings**  
   - We strongly recommend using `"hex"` or `"base64"`. If you previously forced `"binary"`, confirm your tokens or hashed values still parse correctly.

4. **Signature Checking**  
   - `JWT.SHA256.Verify` re-computes the signature using the token’s last segment for `encoding`. Ensure your tokens or code references the correct encoding in the final step.

---

## **Migration Notes** <a id="migration-notes"></a>

1. **PEM Keys**  
   - Remove `.toString("hex")` calls. Store your private/public keys as standard PEM strings (with `-----BEGIN RSA PRIVATE KEY-----` blocks).

2. **Async Patterns**  
   - Switch from synchronous to asynchronous functions (e.g., `Hash.PasswordSync`) if you want non-blocking password hashing in high-traffic apps.

3. **Error Handling**  
   - Replace any usage of `erroHandel` with `errorHandle`.  
   - Check for new error messages and codes (e.g., “Token expired”, “Token not active yet”).

4. **Testing**  
   - Run `manual-test.ts` to ensure your environment is set up to handle class fields, TypeScript, and Node.js crypto.  
   - If you use Jest, confirm that `preset: 'ts-jest'` or Babel is configured properly.

---

## **Example Usage** <a id="example-usage"></a>

### 4.1 **Password Hashing** <a id="password-hashing"></a>

```ts
import { Hash } from "addvansed-hash";

// Synchronous approach
const hashed = Hash.Password.Hash("myPassword", "myKey");
if (typeof hashed === "string") {
  const match = Hash.Password.Match(hashed, "myPassword", "myKey");
  console.log("Password match result:", match);
}

// Async approach
(async () => {
  const hashedAsync = await Hash.PasswordSync.Hash("myPassword", "myKey");
  if (typeof hashedAsync === "string") {
    const matchAsync = await Hash.PasswordSync.Match(hashedAsync, "myPassword", "myKey");
    console.log("Password match async result:", matchAsync);
  }
})();
```

### 4.2 **RSA Encryption (Async)** <a id="rsa-encryption-async"></a>

```ts
import { JWT } from "addvansed-hash";

(async () => {
  const keys = await JWT.RSASync.GenrateKeys();
  if (keys) {
    const ciphertext = await JWT.RSASync.Encrypt("Hello RSA!", keys.publicKey);
    console.log("Encrypted text:", ciphertext);

    const plaintext = await JWT.RSASync.Decrypt(ciphertext, keys.privateKey);
    console.log("Decrypted text:", plaintext);
  }
})();
```

### 4.3 **SHA-256 Sign & Verify** <a id="sha-256-sign--verify"></a>

```ts
import { JWT } from "addvansed-hash";

const secret = "mySecretKey";
const token = JWT.SHA256.Sign({ userId: 123 }, secret, { expiresIn: 3600, iat: true });
console.log("Generated token:", token);

if (typeof token === "string") {
  const verification = JWT.SHA256.Verify(token, secret, {});
  if (verification instanceof Error) {
    console.error("Token verification failed:", verification.message);
  } else {
    console.log("Verified payload:", verification);
  }
}
```

---

## **Contribute & Support** <a id="contribute--support"></a>

- **Issues / Feature Requests**: File them in [GitHub Issues](#).  
- **Discussions / Q&A**: Post your questions or ideas on [GitHub Discussions](#).  
- **Pull Requests**: Always welcome—just follow our [CONTRIBUTING.md](#) guidelines.  
- **Security Reports**: If you find a vulnerability, please contact us privately before disclosing publicly.

---

## **License** <a id="license"></a>

Distributed under the **MIT License**—you are free to use, modify, and distribute. See the [LICENSE](#) file for details.

---

**Enjoy the “addvansed” level of security and performance!**  
We look forward to your feedback and contributions to keep **addvansed-hash** moving forward.
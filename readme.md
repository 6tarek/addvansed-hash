# **addvansed-hash** 🔐

🚀 **Secure & Lightweight Hashing, Encryption, and Authentication Utility**

## **Overview**

`addvansed-hash` is a modern security library that provides advanced **password hashing, encryption, JWT authentication, and unique identifier generation** using **bcrypt, RSA, and UUIDs**. Built with **TypeScript** and optimized for security, this package ensures **fast and safe data protection**.

---

## **Features**

✅ **Secure Password Hashing** – Uses **bcrypt** to hash and verify passwords.\
✅ **Robust Encryption & Decryption** – Implements **RSA encryption** for data security.\
✅ **JWT Authentication** – Generate and validate **JSON Web Tokens** easily.\
✅ **Key Pair Generation** – Generate **public & private keys** for encryption.\
✅ **Unique Identifier Generation** – Uses **UUIDs** for unique ID creation.\
✅ **Salting Function** – Generate cryptographic salts for additional security.\
✅ **Developer-Friendly API** – Easy-to-use, clean, and efficient.

---

## **Installation**

📦 Install via **npm** or **yarn**:

```sh
npm install addvansed-hash
# or
yarn add addvansed-hash
```

---

## **Usage**

### **1️⃣ Password Hashing & Verification**

Securely hash and verify passwords using **bcrypt**.

```ts
import { hash } from "addvansed-hash";

const password = "MySecurePassword";
const secretKey = "mySecretKey";

const hashedPassword = hash.makePassword(password, secretKey);
console.log(hashedPassword); // Encrypted hash

const isValid = hash.matchPassword(hashedPassword, password, secretKey);
console.log(isValid); // true
```

### **2️⃣ Secure Encryption & Decryption**

Encrypt and decrypt sensitive data using **RSA encryption**.

```ts
const encryptedData = hash.Encrypt("Sensitive Data", secretKey);
console.log(encryptedData);

const decryptedData = hash.Decrypt(encryptedData, secretKey);
console.log(decryptedData); // "Sensitive Data"
```

### **3️⃣ JWT Authentication**

Sign and verify **JSON Web Tokens (JWTs)**.

```ts
const token = hash.sign({ userId: 123 }, "jwtSecret");
console.log(token); // JWT token

const verified = hash.JWTDecrypt(token, "jwtSecret");
console.log(verified); // { userId: 123, iat: ... }
```

### **4️⃣ Generate Unique Identifiers & Salts**

Create **UUIDs** and **cryptographic salts**.

```ts
console.log(hash.ID()); // Generates a unique UUID
console.log(hash.salt()); // Generates a cryptographic salt
```

### **5️⃣ Generate Public & Private Keys**

Use **RSA key pairs** for encryption.

```ts
const keys = hash.GenrateKeys;
console.log(keys.privateKey); // Private key
console.log(keys.publicKey); // Public key
```

---

## **Why Use **``**?**

✨ **Fast & Lightweight** – Minimal performance overhead.\
🔒 **Security First** – Uses industry-standard encryption & hashing.\
🛠️ **Developer-Friendly** – Simple API with powerful features.

---

## **License**

📜 MIT License – Free to use and modify.

## **Contribute & Support**

💡 Found an issue or have an idea? Open an issue or contribute on GitHub! 🚀


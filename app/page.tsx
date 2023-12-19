"use client";
import { useState } from "react";
import { generateKeyPair, encryptWithPublicKey, decryptWithPrivateKey } from "../utils/rsa";

function findRelativePrimes(n: number): number[] {
  const relativePrimes = [];
  for (let i = 2; i < n; i++) {
    if (gcd(i, n) === 1) {
      relativePrimes.push(i);
    }
  }
  return relativePrimes;
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

export default function Home() {
  const [p, setP] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [selectedE, setSelectedE] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");
  const [encryptionSteps, setEncryptionSteps] = useState<string>("");
  const [decryptionSteps, setDecryptionSteps] = useState<string>("");

  const handleGenerateKeys = () => {
    const parsedP = parseInt(p, 10);
    const parsedQ = parseInt(q, 10);
    let parsedE: number | undefined = undefined;

    if (selectedE.trim() !== "") {
      parsedE = parseInt(selectedE, 10);
    }

    if (!isNaN(parsedP) && !isNaN(parsedQ) && parsedP > 1 && parsedQ > 1) {
      const { publicKey, privateKey } = generateKeyPair(parsedP, parsedQ, parsedE);
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
    } else {
      alert("Please enter valid prime numbers for p and q.");
    }
  };
  const handleEncrypt = () => {
    const decimalValue = parseInt(inputText, 10);

    if (!isNaN(decimalValue)) {
      const encrypted = encryptWithPublicKey(decimalValue, publicKey);
      setEncryptedText(encrypted.toString());
      const publicKeyParts = publicKey.replace(/\(|\)/g, "").split(",");
      const eIndex = 0;
      const modulusIndex = 1;

      let e = parseInt(publicKeyParts[eIndex].trim());
      let steps = `C = ${inputText}^${e} mod N\n`;

      let base = parseInt(inputText);
      let modulus = parseInt(publicKeyParts[modulusIndex].trim());

      let result = 1;
      let currentStep = `${base}^${e} mod ${modulus}`;
      steps += `${currentStep} = `;

      while (e > 0) {
        if (e % 2 === 1) {
          result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        e = Math.floor(e / 2);

        if (e > 0) {
          currentStep = `${base}^${e} mod ${modulus}`;
          steps += `(${currentStep}) * `;
        } else {
          steps += `(${currentStep})`;
        }
      }

      steps += ` = ${result}`;

      setEncryptionSteps(steps);
      setDecryptedText("");
    } else {
      alert("Please enter a valid decimal number.");
    }
  };

  const handleDecrypt = () => {
    const encryptedValue = parseInt(encryptedText, 10);

    if (!isNaN(encryptedValue)) {
      const decrypted = decryptWithPrivateKey(encryptedValue, privateKey);
      let steps = `C = ${encryptedValue}\n`;
      steps += `P = ${encryptedValue}^d mod N\n`;
      steps += `= ${encryptedValue}^${privateKey.split(",")[0]} mod ${privateKey.split(",")[1]}\n`;
      steps += `= ${decrypted}`;

      setDecryptionSteps(steps);
      setDecryptedText(decrypted.toString());
    } else {
      alert("Please enter a valid encrypted decimal number.");
    }
  };
  const relativePrimesPQ = findRelativePrimes((parseInt(p) - 1) * (parseInt(q) - 1));
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Need some RSA honey?</h1>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">P:</label>
            <input type="text" placeholder="Enter prime number P" className="w-full p-2 rounded border text-black focus:outline-none focus:ring focus:border-blue-500" value={p} onChange={(e) => setP(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Q:</label>
            <input type="text" placeholder="Enter prime number Q" className="w-full p-2 rounded border text-black focus:outline-none focus:ring focus:border-blue-500" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">e:</label>
            <select className="w-full p-2 rounded border text-black appearance-none" value={selectedE} onChange={(e) => setSelectedE(e.target.value)} style={{ zIndex: 10 }}>
              <option value="">Select e (default = underlimit cooprime)</option>
              {relativePrimesPQ.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleGenerateKeys}
          >
            Generate Keys
          </button>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Public Key:</label>
            <textarea className="w-full bg-gray-100 p-2 rounded border text-black" value={publicKey} readOnly></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Private Key (d):</label>
            <textarea className="w-full bg-gray-100 p-2 rounded border text-black" value={privateKey} readOnly></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Enter Number to Encrypt:</label>
            <input type="text" placeholder="Number to encrypt" className="w-full p-2 rounded border text-black focus:outline-none focus:ring focus:border-blue-500" value={inputText} onChange={(e) => setInputText(e.target.value)} />
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-4 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-green-300"
            onClick={handleEncrypt}
          >
            Encrypt
          </button>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Encrypted:</label>
            <textarea placeholder="Give me some encrypted RSA please :(" className="w-full p-2 rounded border text-black" value={encryptedText} onChange={(e) => setEncryptedText(e.target.value)}></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Encryption Steps:</label>
            <textarea className="w-full bg-gray-100 p-2 rounded border text-black" value={encryptionSteps} readOnly></textarea>
          </div>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded mb-4 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-yellow-300"
            onClick={handleDecrypt}
          >
            Decrypt
          </button>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Decrypted:</label>
            <textarea className="w-full bg-gray-100 p-2 rounded border text-black" value={decryptedText} readOnly></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Decryption Steps:</label>
            <textarea className="w-full bg-gray-100 p-2 rounded border text-black" value={decryptionSteps} readOnly></textarea>
          </div>
        </div>
      </div>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} By zakydfls - jocelynflores. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

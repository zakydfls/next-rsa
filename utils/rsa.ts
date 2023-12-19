import crypto from "crypto";

export function generateKeyPair(p: number, q: number, e?: number): { publicKey: string; privateKey: string } {
  const N = p * q;
  const phi = (p - 1) * (q - 1);

  let calculatedE = e;
  if (!calculatedE) {
    calculatedE = calculateRelativePrime(p, q);
  }

  const d = calculateD(calculatedE, phi);

  const publicKey = `(${calculatedE},${N})`;
  const privateKey = `(${d},${N})`;

  return { publicKey, privateKey };
}

// function calculateRelativePrime(p: number, q: number): number {
//   const phi = (p - 1) * (q - 1);
//   for (let possibleE = 2; possibleE < phi; possibleE++) {
//     if (gcd(possibleE, phi) === 1) {
//       return possibleE;
//     }
//   }
//   return 17;
// }
function calculateRelativePrime(p: number, q: number): number {
  const phi = (p - 1) * (q - 1);
  const relativePrimes = findRelativePrimes(phi);
  return relativePrimes[0]; // Mengembalikan bilangan relatif prima pertama
}

function calculateD(e: number, phi: number): number {
  let d = 0;
  while ((d * e) % phi !== 1) {
    d++;
  }
  return d;
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

export function encryptWithPublicKey(decimalValue: number, publicKey: string): number {
  const [e, N] = publicKey.replace(/\(|\)/g, "").split(",").map(Number);
  const encrypted = modPow(decimalValue, e, N);
  return encrypted;
}

function modPow(base: number, exponent: number, modulus: number): number {
  if (exponent === 0) return 1;

  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
}
export function findRelativePrimes(n: number): number[] {
  const relativePrimes = [];
  for (let i = 2; i < n; i++) {
    if (gcd(i, n) === 1) {
      relativePrimes.push(i);
    }
  }
  return relativePrimes;
}
export function decryptWithPrivateKey(encryptedValue: number, privateKey: string): number {
  const [d, N] = privateKey.replace(/\(|\)/g, "").split(",").map(Number);
  return modPow(encryptedValue, d, N);
}

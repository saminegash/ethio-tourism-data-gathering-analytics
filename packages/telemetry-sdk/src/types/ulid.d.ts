declare module 'ulid' {
  export function ulid(seedTime?: number): string;
  export function monotonicFactory(seedTime?: number): () => string;
  export function decodeTime(id: string): number;
  export function encodeTime(now: number, len?: number): string;
  export function encodeRandom(len?: number, rng?: () => number): string;
}

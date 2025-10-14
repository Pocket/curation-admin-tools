import process from 'process';

const globalWithProcess = globalThis as typeof globalThis & {
  process?: typeof process;
};

globalWithProcess.process = process;

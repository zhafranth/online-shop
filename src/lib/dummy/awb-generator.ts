export function generateDummyAwb(): string {
  const ts = Date.now().toString().slice(-10);
  const rnd = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `DUM${ts}${rnd}`;
}

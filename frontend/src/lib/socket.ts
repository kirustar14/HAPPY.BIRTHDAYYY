export const connectWS = (pin: string) =>
  new WebSocket(
    `${import.meta.env.VITE_API_URL ?? ""}/ws/${pin}`
  );

export function connectWS(pin: string) {
  return new WebSocket(`wss://happy-birthdayyy-backend.onrender.com/ws/${pin}`);
}
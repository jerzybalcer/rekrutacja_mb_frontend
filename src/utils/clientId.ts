export function getClientId(): string {
  let clientId = document.cookie
    .split("; ")
    .find(row => row.startsWith("clientId="))
    ?.split("=")[1];

  if (!clientId) {
    clientId = crypto.randomUUID();
    document.cookie = `clientId=${clientId}; path=/; max-age=31536000`;
  }

  return clientId;
}
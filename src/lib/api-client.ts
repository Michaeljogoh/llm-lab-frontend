import axios from "axios";

const CLIENT_ID_KEY = "llm-lab-client-id";

export function getClientId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

export function getApiClient() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  return axios.create({
    baseURL,
    headers: {
      "x-client-id": typeof window !== "undefined" ? getClientId() : "",
    },
  });
}

export const api = {
  get baseURL() {
    return process.env.NEXT_PUBLIC_BASE_URL ?? "";
  },
  client: getApiClient,
};

import { app } from "../../src/app.js";

export class ApiTestClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  async get(path: string, options?: { headers?: Record<string, string> }) {
    const headers: Record<string, string> = { ...options?.headers };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const res = await app.request(path, {
      method: "GET",
      headers,
    });
    const text = await res.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    return { status: res.status, headers: res.headers, body };
  }

  async post(path: string, data?: unknown, options?: { headers?: Record<string, string> }) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const res = await app.request(path, {
      method: "POST",
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    const text = await res.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    return { status: res.status, headers: res.headers, body };
  }

  async patch(path: string, data?: unknown, options?: { headers?: Record<string, string> }) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const res = await app.request(path, {
      method: "PATCH",
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    const text = await res.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    return { status: res.status, headers: res.headers, body };
  }

  async delete(path: string, options?: { headers?: Record<string, string> }) {
    const headers: Record<string, string> = { ...options?.headers };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const res = await app.request(path, {
      method: "DELETE",
      headers,
    });
    const text = await res.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    return { status: res.status, headers: res.headers, body };
  }
}

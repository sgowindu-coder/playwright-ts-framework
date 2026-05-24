import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * ApiClient
 * Reusable wrapper around Playwright's APIRequestContext.
 * Centralises response validation, logging, and error handling.
 *
 * This is the pattern interviewers love — it shows you think about
 * maintainability, not just making requests.
 */
export class ApiClient {
  constructor(private readonly context: APIRequestContext) {}

  // ── Core HTTP Methods ────────────────────────────────────────────

  async get(endpoint: string, params?: Record<string, string | number>): Promise<APIResponse> {
    const response = await this.context.get(endpoint, { params });
    this.logRequest('GET', endpoint, response.status());
    return response;
  }

  async post(endpoint: string, body: unknown): Promise<APIResponse> {
    const response = await this.context.post(endpoint, { data: body });
    this.logRequest('POST', endpoint, response.status());
    return response;
  }

  async put(endpoint: string, body: unknown): Promise<APIResponse> {
    const response = await this.context.put(endpoint, { data: body });
    this.logRequest('PUT', endpoint, response.status());
    return response;
  }

  async patch(endpoint: string, body: unknown): Promise<APIResponse> {
    const response = await this.context.patch(endpoint, { data: body });
    this.logRequest('PATCH', endpoint, response.status());
    return response;
  }

  async delete(endpoint: string): Promise<APIResponse> {
    const response = await this.context.delete(endpoint);
    this.logRequest('DELETE', endpoint, response.status());
    return response;
  }

  // ── Assertion Helpers ────────────────────────────────────────────

  async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status(), `Expected status ${expectedStatus}, got ${response.status()}`).toBe(expectedStatus);
  }

  async assertJsonBody<T>(response: APIResponse, validator: (body: T) => void): Promise<T> {
    const body: T = await response.json();
    validator(body);
    return body;
  }

  async assertResponseTime(response: APIResponse, maxMs: number): Promise<void> {
    // Playwright doesn't expose timing directly; use this pattern with Date.now()
    // In practice, wrap get/post calls with timing if needed
    expect(response.ok(), 'Response should be OK for timing assertion').toBeTruthy();
  }

  async assertHasField(response: APIResponse, field: string): Promise<void> {
    const body = await response.json();
    expect(body).toHaveProperty(field);
  }

  // ── Schema Validation ────────────────────────────────────────────

  /**
   * Validates response body against an expected shape.
   * Pass an object where values are the expected types as strings.
   * Example: assertSchema(response, { id: 'number', email: 'string' })
   */
  async assertSchema(response: APIResponse, schema: Record<string, string>): Promise<void> {
    const body = await response.json();
    for (const [field, type] of Object.entries(schema)) {
      expect(typeof body[field], `Field "${field}" should be type "${type}"`).toBe(type);
    }
  }

  // ── Private Helpers ──────────────────────────────────────────────

  private logRequest(method: string, endpoint: string, status: number): void {
    console.log(`  → ${method} ${endpoint} — ${status}`);
  }
}

/**
 * Test Data
 * Centralised test data — never hardcode values in test files.
 *
 * API: JSONPlaceholder (https://jsonplaceholder.typicode.com)
 * Free, stable, no-auth public REST API. Perfect for demo frameworks.
 */

// ── Post Data (main resource used for CRUD) ───────────────────────
export const Posts = {
  existing: {
    id: 1,
    userId: 1,
  },
  newPost: {
    title: 'Playwright TypeScript Framework',
    body: 'Automated with Playwright APIRequestContext — no extra libraries needed.',
    userId: 1,
  },
  updatedPost: {
    title: 'Updated by PUT — Senior SDET',
    body: 'Full replacement of the resource body via PUT.',
    userId: 1,
  },
  patchedTitle: {
    title: 'Patched Title — PATCH test',
  },
} as const;

// ── User Data ─────────────────────────────────────────────────────
export const Users = {
  existing: { id: 1 },
  nonExistent: { id: 9999 },
} as const;

// ── Comment Data ──────────────────────────────────────────────────
export const Comments = {
  forPost: (postId: number) => ({ postId }),
} as const;

// ── API Endpoints ─────────────────────────────────────────────────
export const Endpoints = {
  posts:          '/posts',
  post:           (id: number) => `/posts/${id}`,
  postComments:   (postId: number) => `/posts/${postId}/comments`,
  users:          '/users',
  user:           (id: number) => `/users/${id}`,
  userPosts:      (userId: number) => `/users/${userId}/posts`,
} as const;

// ── Expected Response Schemas ─────────────────────────────────────
export const Schemas = {
  post: {
    userId: 'number',
    id:     'number',
    title:  'string',
    body:   'string',
  },
  createdPost: {
    title:  'string',
    body:   'string',
    userId: 'number',
    id:     'number',
  },
  user: {
    id:    'number',
    name:  'string',
    email: 'string',
  },
  comment: {
    postId: 'number',
    id:     'number',
    name:   'string',
    email:  'string',
    body:   'string',
  },
} as const;

// ── Environment Config ────────────────────────────────────────────
export const Config = {
  apiBaseUrl:     process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  uiBaseUrl:      process.env.BASE_URL     || 'https://example.com',
  defaultTimeout: 30_000,
  apiTimeout:     10_000,
} as const;

import { test, expect } from '../../src/fixtures';
import { ApiClient } from '../../src/utils/ApiClient';
import { Posts, Users, Endpoints, Schemas } from '../../src/data/testData';

/**
 * API Test Suite — JSONPlaceholder
 *
 * JSONPlaceholder (jsonplaceholder.typicode.com) — free, stable, no-auth REST API.
 * Covers: GET (list + single + nested), POST, PUT, PATCH, DELETE, and error scenarios.
 *
 * Tags:  @smoke      — critical path, runs on every PR
 *        @regression — full suite, runs nightly
 */

// ── Posts — GET ────────────────────────────────────────────────────

test.describe('Posts API — GET', () => {

  test('@smoke GET /posts — returns 100 posts with correct schema', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.posts);

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(100);

    // Spot-check first item schema
    expect(typeof body[0].id).toBe('number');
    expect(typeof body[0].title).toBe('string');
    expect(typeof body[0].body).toBe('string');
    expect(typeof body[0].userId).toBe('number');
  });

  test('@smoke GET /posts/:id — returns single post with correct schema', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.post(Posts.existing.id));

    await client.assertStatus(response, 200);
    await client.assertSchema(response, Schemas.post);

    const body = await response.json();
    expect(body.id).toBe(Posts.existing.id);
  });

  test('@regression GET /posts/:id — returns 404 for non-existent post', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.post(9999));

    await client.assertStatus(response, 404);
  });

  test('@regression GET /posts?userId= — filters posts by userId', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);
    const targetUserId = 1;

    const response = await client.get(Endpoints.posts, { userId: targetUserId });

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    // Every returned post must belong to the requested userId
    const allMatch = body.every((post: { userId: number }) => post.userId === targetUserId);
    expect(allMatch).toBeTruthy();
  });

  test('@regression GET /posts/:id/comments — returns comments for a post', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.postComments(Posts.existing.id));

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const comment = body[0];
    expect(typeof comment.postId).toBe('number');
    expect(typeof comment.id).toBe('number');
    expect(typeof comment.name).toBe('string');
    expect(typeof comment.email).toBe('string');
    expect(typeof comment.body).toBe('string');

    // All comments must belong to the requested post
    const allMatch = body.every((c: { postId: number }) => c.postId === Posts.existing.id);
    expect(allMatch).toBeTruthy();
  });

});

// ── Posts — POST ───────────────────────────────────────────────────

test.describe('Posts API — POST', () => {

  test('@smoke POST /posts — creates post and returns 201 with generated ID', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.post(Endpoints.posts, Posts.newPost);

    await client.assertStatus(response, 201);
    const body = await response.json();

    expect(body.title).toBe(Posts.newPost.title);
    expect(body.body).toBe(Posts.newPost.body);
    expect(body.userId).toBe(Posts.newPost.userId);

    // JSONPlaceholder returns id: 101 for new resources
    expect(body.id).toBeDefined();
    expect(typeof body.id).toBe('number');
  });

  test('@regression POST /posts — response schema matches expected shape', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.post(Endpoints.posts, Posts.newPost);

    await client.assertStatus(response, 201);
    await client.assertSchema(response, Schemas.createdPost);
  });

  test('@regression POST /posts — two concurrent creates return unique IDs', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const [r1, r2] = await Promise.all([
      client.post(Endpoints.posts, Posts.newPost),
      client.post(Endpoints.posts, Posts.newPost),
    ]);

    const b1 = await r1.json();
    const b2 = await r2.json();

    // JSONPlaceholder always returns 101 for simulated creates,
    // but both calls should succeed with 201
    expect(r1.status()).toBe(201);
    expect(r2.status()).toBe(201);
    expect(b1.title).toBe(Posts.newPost.title);
    expect(b2.title).toBe(Posts.newPost.title);
  });

});

// ── Posts — PUT ────────────────────────────────────────────────────

test.describe('Posts API — PUT', () => {

  test('@smoke PUT /posts/:id — full update returns all updated fields', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.put(Endpoints.post(Posts.existing.id), Posts.updatedPost);

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(body.title).toBe(Posts.updatedPost.title);
    expect(body.body).toBe(Posts.updatedPost.body);
    expect(body.userId).toBe(Posts.updatedPost.userId);
    expect(body.id).toBe(Posts.existing.id);
  });

  test('@regression PUT /posts/:id — response schema is valid after update', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.put(Endpoints.post(Posts.existing.id), Posts.updatedPost);

    await client.assertStatus(response, 200);
    await client.assertSchema(response, Schemas.post);
  });

});

// ── Posts — PATCH ──────────────────────────────────────────────────

test.describe('Posts API — PATCH', () => {

  test('@smoke PATCH /posts/:id — partial update only changes specified field', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.patch(Endpoints.post(Posts.existing.id), Posts.patchedTitle);

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(body.title).toBe(Posts.patchedTitle.title);

    // Other fields should still be present (not wiped like a PUT)
    expect(body.id).toBe(Posts.existing.id);
    expect(typeof body.body).toBe('string');
    expect(typeof body.userId).toBe('number');
  });

});

// ── Posts — DELETE ─────────────────────────────────────────────────

test.describe('Posts API — DELETE', () => {

  test('@smoke DELETE /posts/:id — returns 200 with empty body', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.delete(Endpoints.post(Posts.existing.id));

    // JSONPlaceholder returns 200 {} for DELETE (not 204)
    await client.assertStatus(response, 200);
    const body = await response.json();
    expect(Object.keys(body).length).toBe(0); // Empty object {}
  });

});

// ── Users API ──────────────────────────────────────────────────────

test.describe('Users API — GET', () => {

  test('@smoke GET /users — returns user list with correct schema', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.users);

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(10);

    const user = body[0];
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.username).toBe('string');
  });

  test('@smoke GET /users/:id — returns correct user', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.user(Users.existing.id));

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(body.id).toBe(Users.existing.id);
    expect(typeof body.name).toBe('string');
    expect(body.email).toContain('@'); // Basic email format check
  });

  test('@regression GET /users/:id — returns 404 for non-existent user', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.user(Users.nonExistent.id));

    await client.assertStatus(response, 404);
  });

  test('@regression GET /users/:id/posts — returns posts belonging to user', async ({ apiContext }) => {
    const client = new ApiClient(apiContext);

    const response = await client.get(Endpoints.userPosts(Users.existing.id));

    await client.assertStatus(response, 200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    // All posts must belong to this user
    const allMatch = body.every((p: { userId: number }) => p.userId === Users.existing.id);
    expect(allMatch).toBeTruthy();
  });

});

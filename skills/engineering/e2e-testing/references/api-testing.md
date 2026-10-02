# HTTP acceptance with Supertest

Read this for HTTP cases. Supertest is a client/assertion library, not the test runner. Reuse Jest, Vitest, Mocha or the existing runner. With no runner, a small Node test runner setup is sufficient; follow the project's language and module system.

## Reach the real boundary

- For a Node app, pass its real app callback or HTTP server to `request()`. Supertest can bind an unlistening server to an ephemeral port. For another backend or a deployed test instance, pass its base URL from the environment.
- Bootstrap production-equivalent routes, validation, authentication, middleware, prefixes and error handling. In NestJS, mirror global pipes and filters rather than testing a bare module that bypasses them.
- Use isolated real test storage and internal collaborators for backend E2E. Docker is one option, not a prerequisite. Record whether this is an in-process HTTP test or a deployed full-service journey; neither implies coverage of a proxy or native client it never reaches.
- Reuse existing test configuration. Do not add a Node harness to a project with an adequate established API test suite merely to replace its HTTP client.

## Cases and assertions

Cover the feature's meaningful status codes and business values: success, invalid input, unauthenticated access, forbidden roles, missing resources and conflicts where applicable. For writes, verify the result is retrievable through a public interface. Fixture setup may access storage; business assertions should not depend on internal tables.

```javascript
// Adapt the endpoint and independent expected values to the feature contract.
const created = await request(app)
  .post('/notes')
  .send({ title: 'Acceptance note' })
  .expect(201)
  .expect('Content-Type', /json/);

const fetched = await request(app)
  .get(`/notes/${created.body.id}`)
  .expect(200);
assert.equal(fetched.body.title, 'Acceptance note');
```

Await or return every request so failures reach the runner. Use explicit status expectations for expected errors. Do not swallow callback errors. Poll an observable async result with a bounded deadline instead of sleeping and hoping it is ready.

## Identity and resources

- Exercise real login when authentication is under test. For other cases, reuse the project's test identity setup and declare any bypass. Keep separate Supertest agents for separate cookie sessions or roles.
- Use environment-provided credentials and synthetic test data. Omit tokens, cookies and personal response fields from evidence.
- Assign unique case/worker data namespaces. Clean only owned records; never blanket-clear a shared database. Keep required persistence data until read-back assertions complete.
- Close application handles, pools and task-owned servers in teardown. Fix leaked handles rather than enabling `forceExit` to conceal them.
- Keep command output and exit status even when the runner fails. Use the runner's structured output where available; do not derive counts from source files.

Consult [Supertest's API and examples](https://github.com/forwardemail/supertest) for the installed version. This reference deliberately leaves runner flags and application startup commands to project discovery.

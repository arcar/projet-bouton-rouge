const request = require("supertest");
const app = require("./app");

describe("GET /health", () => {
  it("répond 200 avec status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("POST /login", () => {
  it("accepte les bons identifiants", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "docker" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("refuse un mauvais mot de passe", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "faux" });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      success: false,
      message: "Identifiants incorrects.",
    });
  });

  it("refuse un mauvais utilisateur", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "autre", password: "docker" });
    expect(res.statusCode).toBe(401);
  });

  it("refuse un corps vide", async () => {
    const res = await request(app).post("/login").send({});
    expect(res.statusCode).toBe(401);
  });
});

describe("POST /click", () => {
  it("renvoie le premier message pour count = 1", async () => {
    const res = await request(app).post("/click").send({ count: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      count: 1,
      message: "Je t'avais pourtant prévenu.",
      finished: false,
    });
  });

  it("termine la partie à count = 30", async () => {
    const res = await request(app).post("/click").send({ count: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.finished).toBe(true);
    expect(res.body.message).toContain("BOUM");
  });

  it.each([0, 31, -5, 1.5, "10", null])(
    "refuse count invalide (%p)",
    async (count) => {
      const res = await request(app).post("/click").send({ count });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    }
  );

  it("refuse un corps vide", async () => {
    const res = await request(app).post("/click").send({});
    expect(res.statusCode).toBe(400);
  });
});
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { randomUUID } from "node:crypto";
import ts from "typescript";

// Run services against explicit fakes. These tests never contact the live store.
function load(file, mocks = {}) {
  const source = readFileSync(resolve(file), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const exports = {};
  runInNewContext(js, { exports, URL, crypto: { randomUUID }, require(name) {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    throw new Error(`Unexpected dependency: ${name}`);
  } }, { filename: file });
  return exports;
}

test("admin access requires the designated email AND verified ownership", async () => {
  const auth = { currentUser: null, authStateReady: async () => {} };
  const access = load("src/lib/adminAccess.ts", {
    "firebase/auth": {}, "@/lib/firebase": { auth },
  });
  const user = (email, verified) => ({ getIdTokenResult: async () => ({ claims: { email, email_verified: verified } }) });
  await assert.rejects(access.requireAdmin(), /admin access/);
  for (const candidate of [user(access.ADMIN_EMAIL, false), user("someone@example.com", true), user(access.ADMIN_EMAIL, "true")]) {
    auth.currentUser = candidate;
    await assert.rejects(access.requireAdmin(), /admin access/);
  }
  auth.currentUser = user(access.ADMIN_EMAIL, true);
  assert.equal(await access.requireAdmin(), auth.currentUser);
});

test("a slow token check cannot restore access after sign-out", async () => {
  let callback;
  let resolveToken;
  const states = [];
  const access = load("src/lib/adminAccess.ts", {
    "firebase/auth": { onIdTokenChanged: (_auth, cb) => { callback = cb; return () => {}; } },
    "@/lib/firebase": { auth: {} },
  });
  const unsubscribe = access.onAdminStateChanged({}, user => states.push(user));
  callback({ getIdTokenResult: () => new Promise(resolve => { resolveToken = resolve; }) });
  callback(null);
  resolveToken({ claims: { email: access.ADMIN_EMAIL, email_verified: true } });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(states, [null]);
  unsubscribe();
});

function catalog(allowed = true, queryError = null) {
  const calls = [];
  const fs = {
    collection: (_db, name) => name, doc: (_db, name, id) => `${name}/${id}`,
    query: (...args) => args, where: (...args) => args, orderBy: (...args) => args,
    getDocs: async q => { calls.push(["query", q]); return { docs: [] }; },
    getDocsFromServer: async q => { if (queryError) throw queryError; calls.push(["query", q]); return { docs: [] }; },
    serverTimestamp: () => "SERVER_TIMESTAMP", deleteField: () => "DELETE_FIELD",
    updateDoc: async (...args) => calls.push(["update", ...args]),
    addDoc: async (...args) => { calls.push(["create", ...args]); return { id: "copy-id" }; },
    writeBatch: () => ({ update: (...args) => calls.push(["batch", ...args]), commit: async () => calls.push(["commit"]) }),
  };
  const service = load("src/lib/productService.ts", {
    "firebase/firestore": fs, "@/lib/firebase": { db: {} },
    "@/lib/adminAccess": { requireAdmin: async () => { if (!allowed) throw new Error("Admin required"); } },
  });
  return { service, calls };
}

test("public catalog queries constrain status even when the client is signed out", async () => {
  const { service, calls } = catalog(false);
  await service.getPublicProducts();
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [["query", ["products", ["status", "in", ["published", "sold-out"]]]]]);
  await assert.rejects(service.getProducts(), /Admin required/);
  await assert.rejects(service.updateProduct("p1", { name: "Changed" }), /Admin required/);
  await assert.rejects(service.bulkSetProductStatus(["p1"], "published"), /Admin required/);
  assert.equal(calls.length, 1);
});

test("clearing an optional product field deletes it without clearing omitted fields", async () => {
  const { service, calls } = catalog();
  await service.updateProduct("p1", { collection: undefined, sellingPrice: 599 });
  const [, path, data] = calls[0];
  assert.equal(path, "products/p1");
  assert.equal(data.collection, "DELETE_FIELD");
  assert.equal(data.price, 599);
  assert.equal(Object.hasOwn(data, "category"), false);
});

test("catalog outages reject instead of presenting products as missing", async () => {
  const { service } = catalog(false, new Error("Catalog offline"));
  await assert.rejects(service.getProductBySlugFromFirebase("tee"), /Catalog offline/);
});

test("bulk product changes are bounded and duplicates remain unpublished", async () => {
  const { service, calls } = catalog();
  await assert.rejects(service.bulkSetProductStatus([], "published"));
  await assert.rejects(service.bulkSetProductStatus(Array.from({length: 201}, (_, i) => String(i)), "published"));
  assert.equal(calls.length, 0);
  await service.bulkSetProductStatus(["p1", "p1"], "archived");
  assert.equal(calls.filter(c => c[0] === "batch").length, 1);
  assert.equal(calls.at(-1)[0], "commit");
  await service.duplicateProduct({ id: "p1", name: "Tee", slug: "tee", price: 499, createdAt: "OLD", status: "published", isBestSeller: true });
  const copy = calls.at(-1)[2];
  assert.equal(copy.status, "draft");
  assert.equal(copy.isBestSeller, false);
  assert.equal(Object.hasOwn(copy, "id"), false);
  assert.notEqual(copy.slug, "tee");
  assert.notEqual(copy.createdAt, "OLD");
});

test("launch changes at the exact India-time boundary and requires a valid image and date", () => {
  const home = load("src/lib/homePresentation.ts");
  const time = Date.parse("2026-10-04T18:00:00+05:30");
  const value = home.normalizeHomePresentation({ launchEnabled: true, launchAt: "2026-10-04T18:00:00+05:30", launchDesktop: "/launch.png", launchHref: "/collections/new" });
  assert.equal(home.resolveHero(value, time - 1).desktop, "/hero-slide-1.png");
  assert.equal(home.resolveHero(value, time).desktop, "/launch.png");
  assert.equal(home.resolveHero(value, time).mobile, "/launch.png");
  assert.equal(home.resolveHero({ ...value, launchAt: "invalid" }, time).desktop, "/hero-slide-1.png");
  assert.equal(home.resolveHero({ ...value, launchEnabled: false }, time).desktop, "/hero-slide-1.png");
  assert.equal(home.normalizeHomePresentation(null).heroDesktop, "/hero-slide-1.png");
  assert.equal(home.normalizeHomePresentation({ heroHref: "//outside.example", heroDesktop: "javascript:alert(1)" }).heroHref, "/collections");
});

test("catalog text cannot terminate a JSON-LD script", () => {
  const { serializeJsonLd } = load("src/lib/jsonLd.ts");
  const value = { name: '</script><script>alert("x")</script>' };
  const encoded = serializeJsonLd(value);
  assert.equal(encoded.includes("<"), false);
  assert.deepEqual(JSON.parse(encoded), value);
});

test("CSV exports quote multiline text and neutralize spreadsheet formulas", () => {
  const { csvCell } = load("src/lib/csv.ts");
  assert.equal(csvCell('Cotton, "soft"\ntee'), '"Cotton, ""soft""\ntee"');
  for (const input of ["=1+1", " +123", "@SUM(A1)", "-1+2", "\t=1"]) {
    assert.ok(csvCell(input).startsWith('"\''));
  }
});

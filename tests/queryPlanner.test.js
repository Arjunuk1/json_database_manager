const assert = require("node:assert/strict");
const test = require("node:test");

const IndexManager = require("../index/indexManager");
const QueryPlanner = require("../query/queryPlanner");

test("uses an index scan for single-field indexed equality queries", () => {
    const indexManager = new IndexManager();
    indexManager.createIndex("email");
    const planner = new QueryPlanner(indexManager);

    assert.deepEqual(planner.createPlan({ email: "arjun@gmail.com" }), {
        type: "INDEX_SCAN",
        index: "email",
        field: "email",
        value: "arjun@gmail.com",
        reason: "Indexed equality lookup"
    });
});

test("uses a collection scan for non-indexed equality queries", () => {
    const planner = new QueryPlanner(new IndexManager());

    assert.deepEqual(planner.createPlan({ name: "Arjun" }), {
        type: "COLLECTION_SCAN",
        reason: "No suitable index found for query"
    });
});

test("uses a collection scan for range and multi-field queries", () => {
    const indexManager = new IndexManager();
    indexManager.createIndex("age");
    indexManager.createIndex("email");
    const planner = new QueryPlanner(indexManager);

    assert.deepEqual(planner.createPlan({ age: { $gt: 18 } }), {
        type: "COLLECTION_SCAN",
        reason: "No suitable index found for query"
    });
    assert.deepEqual(planner.createPlan({ email: "arjun@gmail.com", age: 19 }), {
        type: "INDEX_SCAN",
        index: "email",
        field: "email",
        value: "arjun@gmail.com",
        reason: "Indexed equality lookup"
    });
});

test("uses a collection scan for an empty query", () => {
    const planner = new QueryPlanner(new IndexManager());

    assert.deepEqual(planner.createPlan(), {
        type: "COLLECTION_SCAN",
        reason: "No filter provided"
    });
});

const { performance } = require("perf_hooks");
const HashIndex = require("../index/hashIndex");

const TOTAL_DOCUMENTS = 100000;
const documents = [];

console.log(`Generating ${TOTAL_DOCUMENTS} documents...`);

for (let i = 0; i < TOTAL_DOCUMENTS; i++) {
    documents.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        age: 18 + (i % 50)
    });
}

const targetEmail = "user75000@example.com";

const scanStart = performance.now();
const scanResult = documents.filter(document => document.email === targetEmail);
const scanEnd = performance.now();

const index = new HashIndex("email");
const buildStart = performance.now();

for (const document of documents) {
    index.insert(document);
}

const buildEnd = performance.now();
const lookupStart = performance.now();
const indexedResult = index.find(targetEmail);
const lookupEnd = performance.now();

console.log("\n========== BENCHMARK ==========\n");
console.log(`Documents: ${TOTAL_DOCUMENTS}`);
console.log(`Collection Scan: ${(scanEnd - scanStart).toFixed(4)} ms`);
console.log(`Index Build: ${(buildEnd - buildStart).toFixed(4)} ms`);
console.log(`Index Lookup: ${(lookupEnd - lookupStart).toFixed(4)} ms`);
console.log(`Scan Results: ${scanResult.length}`);
console.log(`Index Results: ${indexedResult.length}`);

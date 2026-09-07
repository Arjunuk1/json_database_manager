const fs = require("fs");
const path = require("path");

class IndexMetadataStore {
    constructor(collectionName) {
        const indexDirectory = path.join(__dirname, "../data/indexes");

        if (!fs.existsSync(indexDirectory)) {
            fs.mkdirSync(indexDirectory, { recursive: true });
        }

        this.filePath = path.join(
            indexDirectory,
            `${collectionName}.indexes.json`
        );
    }

    load() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }

        const content = fs.readFileSync(this.filePath, "utf8");

        return content.trim() ? JSON.parse(content) : [];
    }

    save(indexes) {
        fs.writeFileSync(this.filePath, JSON.stringify(indexes, null, 2));
    }
}

module.exports = IndexMetadataStore;

module.exports = {
    apps: [{
        name: "whabot",
        script: "./index.js",
        watch: true,
        ignore_watch: ["database.json", "node_modules", "state"]
    }]
};
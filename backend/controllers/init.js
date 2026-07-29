const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), ".myGit");
    const commitsPath = path.join(repoPath, "commits");
    try {
        await fs.mkdir(repoPath, {recursive: true});
        await fs.mkdir(commitsPath, {recursive: true});
        await fs.writeFile(
            path.join(repoPath, "config.js"), 
            JSON.stringify({bucket: process.env.S3_BUCKET})
        );
        console.log("Repository initialized.");
    }
    catch(err) {
        console.log("Error initializing the repository.", err);
    }
}

module.exports = {initRepo};
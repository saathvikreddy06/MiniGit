const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitId) {
    let repoPath = path.resolve(process.cwd(), ".myGit");
    let commitsPath = path.join(repoPath, "commits");
    try {
        let commitDir = path.join(commitsPath, commitId);
        let parentDir = path.resolve(repoPath, "..");
        let files = await fs.readdir(commitDir);
        for(let file of files) {
            await fs.copyFile(path.join(commitDir, file), path.join(parentDir,file));
        }
        console.log(`Revert to ${commitId} successfull`);
    }
    catch(err) {
        console.error(`Error reverting to ${commitId} : `, err)
    }
}
module.exports = {revertRepo};
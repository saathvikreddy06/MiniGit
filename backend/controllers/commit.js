const fs = require("fs").promises;
const path = require("path");
const {v4:uuidv4} = require("uuid");

async function commitRepo(message) {
    let repoPath = path.resolve(process.cwd(), ".myGit");
    let commitPath = path.join(repoPath, "commits");
    let stagedDir = path.join(repoPath, "staging");
    try {
        let commitId = uuidv4();
        let commitDir = path.join(commitPath,commitId);
        await fs.mkdir(commitDir, {recursive: true});
        let files = await fs.readdir(stagedDir);
        for(let file of files) {
            await fs.copyFile(path.join(stagedDir,file),path.join(commitDir,file));
        }
        await fs.writeFile(path.join(commitDir,"commit.json"), JSON.stringify({message, date: new Date().toISOString()}));
        console.log(`Commit ${commitId} created with message : ${message}`);
    } catch(err) {
        console.log("Error commiting the staged files : ", err);
    }
}

module.exports = {commitRepo};
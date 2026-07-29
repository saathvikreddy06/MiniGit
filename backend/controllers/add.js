const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) {
    try {
        let fileName = path.basename(filePath);
        let repoPath = path.resolve(process.cwd(),".myGit");
        let stagingPath = path.join(repoPath,"staging");
        await fs.mkdir(stagingPath,{recursive: true});
        await fs.copyFile(filePath, path.join(stagingPath, fileName));
        console.log(`File ${fileName} added to the staging area`);
    } catch(err) {
        console.log(`Error staging the file : ${err}`);
    }
}

module.exports = {addRepo};
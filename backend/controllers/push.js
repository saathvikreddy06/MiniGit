const fs = require("fs").promises;
const path = require("path");
const {S3, S3_BUCKET} = require("../config/aws-config.js");

async function pushRepo() {
    let repoPath = path.resolve(process.cwd(), ".myGit");
    let commitsPath = path.join(repoPath, "commits");

    try {
        let commits = await fs.readdir(commitsPath);
        for(let commit of commits) {
            let commitDir = path.join(commitsPath, commit);
            let files = await fs.readdir(commitDir);
            for(let file of files) {
                let filePath = path.join(commitDir,file);
                let fileContent = await fs.readFile(filePath);
                let params = {
                    Bucket : S3_BUCKET,
                    Key: `commits/${commit}/${file}`,
                    Body: fileContent
                };
                await S3.upload(params).promise();
            }
        }
        console.log("All commits are successfully pushed to S3.");
    } 
    catch(err) {
        console.error("Error pushing the commits to S3: ", err);
    }
}

module.exports = {pushRepo};
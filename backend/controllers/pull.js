const fs = require("fs").promises;
const path = require("path");
const {S3, S3_BUCKET} = require("../config/aws-config.js");

async function pullRepo() {
    let repoPath = path.resolve(process.cwd(),".myGit");
    let commitsPath = path.join(repoPath, "commits");

    try {
        let data = await S3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: "commits/"
        }).promise();
        let objects = data.Contents;
        for(let object of objects) {
            let key = object.Key;
            let commitDir = path.join(commitsPath, path.basename(path.dirname(key)));
            await fs.mkdir(commitDir, {recursive: true});
            let params = {
                Bucket: S3_BUCKET,
                Key: key
            }
            let fileContent = await S3.getObject(params).promise();
            await fs.writeFile(path.join(repoPath,key), fileContent.Body.toString());
        }
        console.log("Commits successfully pulled from s3");
    }
    catch(err) {
        console.error("Error pulling the commits from S3 : ", err);
    }
}
module.exports = {pullRepo};
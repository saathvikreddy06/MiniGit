const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require("./routes/main.router.js");

const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");
const {initRepo} = require("./controllers/init.js");
const {addRepo} = require("./controllers/add.js");
const {commitRepo} = require("./controllers/commit.js");
const {pullRepo} = require("./controllers/pull.js");
const {pushRepo} = require("./controllers/push.js");
const {revertRepo} = require("./controllers/revert.js");

dotenv.config();

yargs(hideBin(process.argv))
.command("start", "Start the server", {}, startServer)
.command("init", "Initialize a new repository", {}, initRepo)
.command("add <file>", "Add file to staging area", (yargs) => {yargs.positional("file", {
    describe: "File to be added in staging area",
    type: "string"
})}, (argv) => {
    addRepo(argv.file);
})
.command("commit <message>", "Commit the staged files.", (yargs) => {
    yargs.positional("message", {
        describe: "Commit message",
        type: "string"
    })
}, (argv) => {
    commitRepo(argv.message);
})
.command("push", "Push commits to s3", {}, pushRepo)
.command("pull", "Pull commits from s3", {}, pullRepo)
.command("revert <commitId>", "Revert to a specific commit", 
    (yargs) => {
        yargs.positional("commitId", {
            describe: "Commit Id",
            type: "string"
        })
    }, (argv) => {
        revertRepo(argv.commitId);
    }
)
.demandCommand(1, "You need to enter atleast one command")
.help().argv;

async function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;
    const mongoUrl = process.env.MONGO_DB_URL;

    app.use(express.json());
    app.use(cors("*"));

    const db = mongoose.connection;
    
    db.once("open", async () => {
        console.log("CRUD operations called!");
    });

    await mongoose.connect(mongoUrl).then(() => {
        console.log("Connected to DB:)");
    }).catch((err) => {
        console.log("Error connecting to DB:( ", err);
    });

    app.use("/", mainRouter);

    
    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userId) => {
            user = userId,
            console.log("==========");
            console.log(user);
            console.log("==========");
            socket.join(userId);
        });
    });

    httpServer.listen(port, () => {
        console.log(`Server listening at port ${port}!`);
    });
}
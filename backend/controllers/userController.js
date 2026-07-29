const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {MongoClient} = require("mongodb");
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;
const User = require("../models/userModel.js");
const Repository = require("../models/repoModel.js");
dotenv.config();

const dbUrl = process.env.MONGO_DB_URL;
let client;
async function connectClient() {
    if(!client) {
        client = new MongoClient(dbUrl);
        await client.connect();
    }
}
const signup = async (req,res) => {
    const {username,password,email} = req.body;
    try {
        await connectClient();
        const db = client.db("MiniGit");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({username});
        if(user) {
            return res.status(400).json({message:"User already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: []
        });

        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({id:result.insertedId}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
        res.json({token, userId: result.insertId});
    }
    catch(err) {
        console.error("Error during signup :", err.message);
        res.status(500).send("Server error");
    }
}

const login = async (req,res) => {
    const {email,password} = req.body;
    try {
        await connectClient();
        const db = client.db("MiniGit");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({email});
        if(!user) {
            res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) {
            res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
        res.json({token, userId:user._id});
    } catch(err) {
        console.error("Error during login : ", err.message);
        res.status(500).send("Server Error");
    }
}

const getAllUsers = async (req,res) => {
    try {
        await connectClient();
        const db = client.db("MiniGit");
        const usersCollection = db.collection("users");

        let users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch(err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server Error");
    }
}

const getUserProfile = async (req,res) => {
    let {id} = req.params;
    try {
        await connectClient();
        const db = client.db("MiniGit");
        const usersCollection = db.collection("users");

        let user = await usersCollection.findOne({
            _id: new ObjectId(id)
        });
        if(!user) {
            res.status(404).send("User not found");
        }
        res.json(user); 
    } catch(err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server Error");
    }
}

const updateUserProfile = async (req,res) => {
    let {id} = req.params;
    let {email,password} = req.body;
    try {
        await connectClient();
        const db = client.db("MiniGit");
        const usersCollection = db.collection("users");
        let updateFields = {email};

        if(password) {
            let salt = await bcrypt.genSalt(10);
            let newPassword = await bcrypt.hash(password,salt);
            updateFields.password = newPassword;
        }

        let user = await usersCollection.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {$set: updateFields}, {returnDocument: "after"});

        if(!user) {
            return res.status(404).send("User not found");
        }
        res.json({message: "User updated successfully"}); 
    } catch(err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server Error");
    }
}

const deleteUserProfile = async (req,res) => {
    let {id} = req.params;
    try {
        await connectClient();
        const db = client.db("MiniGit");
        const usersCollection = db.collection("users");

        let result = await usersCollection.deleteOne({
            _id: new ObjectId(id)
        });
        if(result.deletedCount==0) {
            return res.status(404).json({message:"User not found"});
        }
        res.json({message:"User profile deleted"});
    } catch(err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server Error");
    }
}

const toggleStarRepository = async (req, res) => {
    const { userId, repoId } = req.params;

    try {

        if (
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(repoId)
        ) {
            return res.status(400).json({
                error: "Invalid Id"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const repo = await Repository.findById(repoId);

        if (!repo) {
            return res.status(404).json({
                error: "Repository not found"
            });
        }

        const alreadyStarred = user.starRepos.some(
            id => id.toString() === repoId
        );

        if (alreadyStarred) {

            user.starRepos = user.starRepos.filter(
                id => id.toString() !== repoId
            );

            await user.save();

            return res.json({
                message: "Repository unstarred",
                starred: false
            });
        }

        user.starRepos.push(repoId);
        await user.save();

        res.json({
            message: "Repository starred",
            starred: true
        });

    } catch (err) {

        console.error(err.message);

        res.status(500).json({
            error: "Server error"
        });

    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    toggleStarRepository
}


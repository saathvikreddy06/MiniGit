const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const Isuue = require("../models/issueModel.js");
const User = require("../models/userModel.js");

const createRepository = async (req,res) => {
    const {name,description,content,visibility,issues,owner} = req.body;
    try {
        if(!name) {
            return res.status(400).json({error: "Repository name is required!"});
        }
        if(!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({error: "Invalid User Id!"});
        }
        let newRepo = new Repository({
            name,description,content,visibility,issues,owner
        });
        let result = await newRepo.save();
        res.status(201).json({
            message: "Repository created successfully!",
            repoId: result._id
        });
    }
    catch(err) {
        console.error("Error creating a repository :", err.message);
        res.status(500).send("Server error");
    }
}

const getAllRepositories = async (req,res) => {
    try {
        const repos = await Repository.find({}).populate("owner").populate("issues");
        res.send(repos);
    }
    catch(err) {
        console.error("Error fetching repositories :", err.message);
        res.status(500).send("Server error");
    }
}

const fetchRepositoryById = async (req,res) => {
    const {id} = req.params;
    try {
        const repo = await Repository.findById(id).populate("owner").populate("issues");
        res.send(repo);
    }
    catch(err) {
        console.error("Error fetching repository :", err.message);
        res.status(500).send("Server error");
    }
}

const fetchRepositoryByName = async (req,res) => {
    const {name} = req.params;
    try {
        const repo = await Repository.find({name}).populate("owner").populate("issues");
        res.send(repo);
    }
    catch(err) {
        console.error("Error fetching repository :", err.message);
        res.status(500).send("Server error");
    }
}

const fetchRepositoriesForCurrentUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const repos = await Repository.find({
            owner: userId
        }).populate("owner").populate("issues");

        res.json({
            message: "Repositories fetched successfully",
            repositories: repos
        });
    }
    catch (err) {
        console.error("Error fetching repositories:", err.message);
        res.status(500).send("Server error");
    }
};

const updateRepositoryById = async (req,res) => {
    const {id} = req.params;
    const {content,description} = req.body;
    try {
        const repo = Repository.findById(id);
        if(!repo) {
            return res.status(404).json({error: "No repository found!"});
        }
        repo.content.push(content);
        repo.description = description;
        const updatedRepo = await repo.save();
        res.json({
            message: "Repository updated successfully",
            repository: updatedRepo
        })
    }
    catch(err) {
        console.error("Error updating the repository :", err.message);
        res.status(500).send("Server error");
    }
}

const toggleVisibilityId = async (req,res) => {
    const {id} = req.params;
    try {
        const repo = Repository.findById(id);
        if(!repo) {
            return res.status(404).json({error: "No repository found!"});
        }
        repo.visibility = !repo.visibility;
        const updatedRepo = await repo.save();
        res.json({
            message: "Repository visibility toggled successfully",
            repository: updatedRepo
        })
    }
    catch(err) {
        console.error("Error toggling visibility of the repository :", err.message);
        res.status(500).send("Server error");
    }
}

const deleteRepositoryById = async (req,res) => {
    const {id} = req.params;
    try {
        const repo = Repository.findByIdAndDelete(id);
        if(!repo) {
            return res.status(404).json({error: "No repository found!"});
        }
        res.json({
            message: "Repository deleted successfully",
        })
    }
    catch(err) {
        console.error("Error deleting the repository :", err.message);
        res.status(500).send("Server error");
    }
}

module.exports = {
    getAllRepositories,
    createRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    deleteRepositoryById,
    toggleVisibilityId
}


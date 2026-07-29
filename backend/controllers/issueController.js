const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const Isuue = require("../models/issueModel.js");
const User = require("../models/userModel.js");

const createIssue = async (req,res) => {
    const {title,description} = req.body;
    const {id} = req.params;

    try {
        const issue = new Issue({
            title,
            description,
            repository: id
        });
        await issue.save();
        res.status(201).json(issue);
    }
    catch(err) {
        console.error("Error creating the issue :", err.message);
        res.status(500).send("Server error");
    }
    
}

const updateIssueById = async (req,res) => {
    const {id} = req.params;
    const {title,description,status} = req.body;
    try {
        const issue = await Issue.findById(id);
        if(!issue) {
            return res.status(404).json({error: "Issue not found"});
        }
        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();
        res.json(issue, {message: "Isuue updated"});
    }
    catch(err) {
        console.error("Error updating the issue :", err.message);
        res.status(500).send("Server error");
    }
}

const deleteIssueById = async (req,res) => {
    const {id} = req.params;
    try {
        const issue = await Issue.findByIdAndDelete(id);
        if(!issue) {
            return res.status(404).json({error: "Issue not found"});
        }
        res.json({message: "Isuue deleted"});
    }
    catch(err) {
        console.error("Error deleting the issue :", err.message);
        res.status(500).send("Server error");
    }
}

const getAllIssues = async (req,res) => {
    const {id} = req.params;
    try {
        const issues = await Issue.find({repository: id});
        if(!issues) {
            return res.status(404).json({error: "No issues found"});
        }
        res.status(200).json(issues);
    }
    catch(err) {
        console.error("Error deleting the issue :", err.message);
        res.status(500).send("Server error");
    }
}

const getIssueById = async (req,res) => {
    const {id} = req.params;
    
    try {
        const issue = await Issue.findById(id);
        if(!issue) {
            return res.status(404).json({error: "Issue not found"});
        }
        res.json(issue);
    }
    catch(err) {
        console.error("Error fetching the issue :", err.message);
        res.status(500).send("Server error");
    }
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}
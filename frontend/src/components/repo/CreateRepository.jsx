import React, { useState } from "react";
import Navbar from "../NavBar.jsx";
import "./CreateRepository.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaBook,
  FaGlobe,
  FaLock,
  FaPlusCircle,
  FaInfoCircle,
  FaGithub,
} from "react-icons/fa";

const CreateRepository = () => {
  const [repositoryName, setRepositoryName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [initializeReadme, setInitializeReadme] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const owner = localStorage.getItem("userId");

    try {
        const response = await axios.post(
        "http://localhost:3000/repo/create",
        {
            name: repositoryName,
            description,
            content: initializeReadme ? "# " + repositoryName : "",
            visibility,
            issues: [],
            owner,
        }
        );

        console.log(response);
        alert(response.data.message);
        navigate("/");

        setRepositoryName("");
        setDescription("");
        setVisibility("public");
        setInitializeReadme(false);

    } catch (err) {
        console.error(err);

        if (err.response) {
        alert(err.response.data.error);
        } else {
        alert("Unable to create repository.");
        }
    }
    };

  return (
    <>
      <Navbar />

      <div className="create-page">

        <div className="create-header">

          <div className="header-icon">
            <FaGithub />
          </div>

          <div>
            <h1>Create a new repository</h1>
            <p>
              A repository contains all of your project's files,
              revision history and collaboration features.
            </p>
          </div>

        </div>

        <form className="create-card" onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              <FaBook />
              Repository Name
            </label>

            <input
              type="text"
              placeholder="my-awesome-project"
              value={repositoryName}
              onChange={(e) => setRepositoryName(e.target.value)}
              required
            />

          </div>

          <div className="form-group">

            <label>
              <FaInfoCircle />
              Description (optional)
            </label>

            <textarea
              rows="4"
              placeholder="Tell everyone what this repository is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

          </div>

          <div className="visibility-title">
            Repository Visibility
          </div>

          <div className="visibility-options">

            <label
              className={`visibility-card ${
                visibility === "public" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                value="public"
                checked={visibility === "public"}
                onChange={(e) => setVisibility(e.target.value)}
              />

              <div className="visibility-icon">
                <FaGlobe />
              </div>

              <div>

                <h3>Public</h3>

                <p>
                  Anyone on the internet can view this repository.
                </p>

              </div>

            </label>

            <label
              className={`visibility-card ${
                visibility === "private" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                value="private"
                checked={visibility === "private"}
                onChange={(e) => setVisibility(e.target.value)}
              />

              <div className="visibility-icon">
                <FaLock />
              </div>

              <div>

                <h3>Private</h3>

                <p>
                  Only you can access this repository.
                </p>

              </div>

            </label>

          </div>

          <div className="readme-card">
            <label>
                <input
                type="checkbox"
                checked={initializeReadme}
                onChange={(e) => setInitializeReadme(e.target.checked)}
                />
                Add initial content to the repository
            </label>

            </div>

          <button type="submit" className="create-button">

            <FaPlusCircle />

            <span>Create Repository</span>

          </button>

        </form>

      </div>
    </>
  );
};

export default CreateRepository;
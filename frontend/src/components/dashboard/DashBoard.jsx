import React, { useState, useEffect } from "react";
import "./DashBoard.css";
import NavBar from "../NavBar.jsx";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://54.79.187.233:3000/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://54.79.187.233:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const isStarred = (repoId) => {
      return starredRepos.includes(repoId);
    };

  const toggleStar = (repoId) => {
    if (isStarred(repoId)) {
      setStarredRepos((prev) => prev.filter((id) => id !== repoId));
    } else {
      setStarredRepos((prev) => [...prev, repoId]);
    }

    // Later replace this with your backend API call
  };

  return (
    <>
      <NavBar />

      <section id="dashboard">

        <aside className="dashboard-card">
          <h3 style={{marginBottom: "1rem"}}>Suggested Repositories</h3>

          {suggestedRepositories.map((repo) => {
            return (
              <div className="repo-card" key={repo._id}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            );
          })}
        </aside>

        <main>

          <div className="dashboard-header">
            <h2>Home</h2>
            <p>
              Manage your repositories, search projects and continue building.
            </p>
          </div>

          <div className="repositories-card">

            <div className="repo-header">
              <h2>Your Repositories</h2>

              <div id="search">
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search repositories..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

            </div>

            {searchResults.length > 0 ? (
              searchResults.map((repo) => {
                return (
                  <div className="repo-card" key={repo._id}>
                    <div className="repo-top">
                        <h4>{repo.name}</h4>

                        <div
                            className="star-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(repo._id);
                            }}
                        >
                            {isStarred(repo._id) ? (
                                <StarIcon sx={{ color: "#f2c94c" }} />
                            ) : (
                                <StarBorderIcon />
                            )}
                        </div>
                    </div>

                    <p>{repo.description}</p>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <h3>No repositories found</h3>
                <p>Try searching with another keyword.</p>
              </div>
            )}

          </div>

        </main>

        <aside className="dashboard-card">
          <h3 style={{marginBottom: "1rem"}}>Upcoming Events</h3>

          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>

        </aside>

      </section>
    </>
  );
};

export default Dashboard;
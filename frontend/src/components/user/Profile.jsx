import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import Navbar from "../NavBar.jsx";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

import {
  FaBookOpen,
  FaStar,
  FaUsers,
  FaUserFriends,
  FaSignOutAlt,
} from "react-icons/fa";

import { HiOutlineChartSquareBar } from "react-icons/hi";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ 
    username: "username",
    email: "",
    followedUsers: []
   });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `16.176.12.17:3000/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      <div className="profile-container">

        <div className="profile-banner">
          <h1>Developer Profile</h1>
          <p>Manage your account and view your coding activity.</p>
        </div>

        <div className="profile-nav">

          <button className="profile-nav-item active">
            <FaBookOpen />
            <span>Overview</span>
          </button>

          <button
            className="profile-nav-item"
            onClick={() => navigate("/repo")}
          >
            <FaStar />
            <span>Starred Repositories</span>
          </button>

        </div>

        <button
          id="logout"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            window.location.href = "/auth";
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

        <div className="profile-page-wrapper">

          <div className="user-profile-section">

            <div className="profile-image">
              {userDetails.username.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="name">
              <h2>{userDetails.username}</h2>
              <p>@{userDetails.email}</p>
            </div>

            <div className="follower">

              <div>
                <FaUsers className="profile-stat-icon" />
                <h3>0</h3>
                <p>Followers</p>
              </div>

              <div>
                <FaUserFriends className="profile-stat-icon" />
                <h3>{userDetails.followedUsers.length}</h3>
                <p>Following</p>
              </div>

            </div>

          </div>

          <div className="heat-map-section">

            <div className="activity-card">

              <h2>
                <HiOutlineChartSquareBar />
                <span>Contribution Activity</span>
              </h2>

              <HeatMapProfile />

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Profile;
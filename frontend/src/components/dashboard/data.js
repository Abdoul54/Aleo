import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Label, Tooltip } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./data.css";
import LoginPage from "./loginPage";
const API_BASE_URL = `${process.env.REACT_APP_SERVER_URL}/api`;

const Header = () => {
  return (
    <h2>Dashboard</h2>
  )
};

const DataPage = () => {
  const [postCount, setPostCount] = useState(0);
  const [vehicles, setVehicles] = useState(0);
  const [properties, setProperties] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [outdated, setOutdated] = useState(0);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedLoggedIn === "true") {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/posts/count`);
      const { Posts, Jobs, Properties, Vehicles, outDatedPosts } = response.data;
      setPostCount(Posts);
      setJobs(Jobs);
      setProperties(Properties);
      setVehicles(Vehicles);
      setOutdated(outDatedPosts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const DataDonutChart = () => {
    const data = [
      { name: "Vehicles", value: vehicles },
      { name: "Properties", value: properties },
      { name: "Jobs", value: jobs },
    ];

    const COLORS = ["#0074D9", "#2ECC40", "#FFDC00"];

    return (
      <div
        style={{
          marginLeft: "25%",
          marginTop: "-10%",
        }}
      >
        <PieChart width={570} height={570}>
          <Pie
            data={data}
            cx={300}
            cy={300}
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              value={`${postCount} Posts`}
              position="center"
              fontSize={40}
              fontWeight="bold"
            />
          </Pie>
          <Tooltip />
          <Legend
            layout="vertical"
            align="left"
            verticalAlign="middle"
            iconType="square"
            iconSize={30}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
        <div className="additional-content">
          <p>
            {outdated} {outdated > 1 ? "Posts" : "Post"} To Be Removed
          </p>
        </div>
      </div>
    );
  };

  const handleCheckPosts = async () => {
    try {
      setLoading(true);
      await axios.get(`${API_BASE_URL}/admin/posts/404`);
      toast.success("Checking for outdated posts ended.");
    } catch (error) {
      console.error("Error checking outdated posts:", error);
    } finally {
      setLoading(false);
      fetchData()
    }
  };

  const handleScrapeNewPosts = async () => {
    try {
      setLoading(true);
      toast.info("This may take a while, please be patient.");
      const response = await axios.get(`${API_BASE_URL}/admin/scrape`);
      setRes(response.data);
      console.log(res);
      toast.success("New posts scraped successfully!");
      fetchData();
    } catch (error) {
      console.error("Error scraping new posts:", error);
      toast.error("An error occurred while scraping new posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePosts = async () => {
    try {
      setLoading(true);
      await axios.get(`${API_BASE_URL}/posts/remove`);
      toast.success("All outdated posts have been terminated.");
    } catch (error) {
      console.error("Error removing posts:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="content-container btn-fixed-size">
        {isLoggedIn ? (
          <div>
            <div className="admin-header">
              <h2><Header /></h2>
            </div>
            <div className="donut-chart-container">
              <div className="col-md-8">
                <DataDonutChart />
                <nav className="navbar2">
                  <button
                    className="btn btn-primary btn-fixed-size"
                    disabled={loading}
                    onClick={handleCheckPosts}
                  >
                    {loading ? <div className="loader" /> : "Check outdated Posts"}
                  </button>
                  <a href="/admin/posts">
                    <button className="btn btn-secondary btn-fixed-size">See Posts</button>
                  </a>
                  <button
                    className="btn btn-info btn-fixed-size"
                    disabled={loading}
                    onClick={handleScrapeNewPosts}
                  >
                    {loading ? <div className="loader" /> : "Scrape New Posts"}
                  </button>
                  <button
                    className="btn btn-danger btn-fixed-size"
                    disabled={loading}
                    onClick={handleRemovePosts}
                  >
                    {loading ? <div className="loader" /> : "Remove Posts"}
                  </button>
                </nav>

              </div>
            </div>
            <ToastContainer />
          </div>
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}
export default DataPage;

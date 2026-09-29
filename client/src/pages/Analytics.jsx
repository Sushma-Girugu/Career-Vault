import { useEffect, useState } from "react";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        return response.json();
      })
      .then((data) => {
        setAnalytics(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load analytics");
      });
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!analytics) {
    return <h2>Loading Analytics...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Career Analytics</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginTop: "25px"
        }}
      >
        <div>
          <h3>Profile</h3>
          <p>{analytics.profile}</p>
        </div>

        <div>
          <h3>Total Skills</h3>
          <p>{analytics.totalSkills}</p>
        </div>

        <div>
          <h3>Total Applications</h3>
          <p>{analytics.totalApplications}</p>
        </div>

        <div>
          <h3>Total Questions</h3>
          <p>{analytics.totalQuestions}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>
        Application Status
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px"
        }}
      >
        <div>
          <h3>Applied</h3>
          <p>{analytics.applicationsByStatus.Applied}</p>
        </div>

        <div>
          <h3>Interview</h3>
          <p>{analytics.applicationsByStatus.Interview}</p>
        </div>

        <div>
          <h3>Selected</h3>
          <p>{analytics.applicationsByStatus.Selected}</p>
        </div>

        <div>
          <h3>Rejected</h3>
          <p>{analytics.applicationsByStatus.Rejected}</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
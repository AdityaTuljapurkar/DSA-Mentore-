import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { Axios } from "axios";
import QuestionFrom from "./pages/QuestionFrom";
import Statistics from "./pages/Statistics";
export default function Dashboard() {
  const navigate = useNavigate();

  // State
  const [userData, setUserData] = useState({
    username: "Aditya",
    streak: 0,
    totalSolved: 0,
  });
  const [questions, setQuestions] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState([])
  const [liveTime, setLiveTime] = useState(new Date())
  const [username, setUsername] = useState("")

  function getliveTime() {
    useEffect(() => {
      const interval = setInterval(() =>
        setLiveTime(new Date()), 1000
      )

      return () => {
        clearInterval(interval)
      }
    }, [])
    return liveTime


  }


  // Fetch dashboard data
  useEffect(() => {
    const handel_data_fetch = async () => {
      try {
        const accessTkn = localStorage.getItem("accessToken");

        const header = accessTkn
          ? { Authorization: `Bearer ${accessTkn}` }
          : {};

        const response = await axios.get(
          "http://127.0.0.1:8000/api/fetch_dashboard_data/",
          { headers: header }
        );



        setDashboardData(response.data.questions);
        setUsername(response.data.username);


      } catch (error) {
        console.log("[dashboard fetch error]", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }}
      finally {
        setLoading(false);
      }
    };

    handel_data_fetch();


  }, []);





  // Filter logict
  // const filteredQuestions = questions.filter((q) => {
  //   const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesTopic = selectedTopic === "all" || q.topic === selectedTopic;
  //   return matchesSearch && matchesTopic;
  // });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }



  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      {/* 1. Header / Navigation */}

      <header>
        <div>
          <h2>DSA Mentor</h2>
        </div>
        <nav>
          {
            username && <h4>
              <b>
                User :
              </b> {username}

            </h4>
          }
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <main>
        <QuestionFrom />
        {/* 2. Top Stats Overview */}
        <section>
          <h2>stats</h2>
          <Statistics/>

        </section>

       

        {/* 3. Filters & Search Section */}
        <section>
          <h2>Problems</h2>
          {/* <div>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >



              <option value="all">All Topics</option>
              <option value="Arrays & Hashing">Arrays & Hashing</option>
              <option value="Strings">Strings</option>
              <option value="Linked List">Linked List</option>
            </select>
          </div> */}

          {/* 4. Question Table / List */}
          <table>
            <thead>
              <tr>
                <th>SR.no</th>
                {/* <th>Ques no</th> */}
                <th>Question</th>
                <th>Topic</th>
                <th>subtopic</th>
                <th>Date</th>
                <th>Status</th>
                <th>remark</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.map((item) => (
                <tr key={item.sr_no}>
                  <td>{item.sr_no}</td>
                  {/* <td>{item.ques_no}</td> */}
                  <td>
                    <Link to={`/problem/${item.ques_no}`}>
                      {item.question}
                    </Link>
                  </td>
                  <td>{item.topic}</td>
                  <td>{item.subtopic || "none"}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.status ? "\u2705" : "\u274C"}</td>
                  <td>{item.remark || "no remark yet"}</td>

                </tr>


              ))}



            </tbody>
          </table>
        </section>



      </main>
    </div>
  );
}
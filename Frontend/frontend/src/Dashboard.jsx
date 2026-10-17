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
  const [dashboardData, setDashboardData] = useState([]);
  const [liveTime, setLiveTime] = useState(new Date());
  const [username, setUsername] = useState("");

  function getliveTime() {
    useEffect(() => {
      const interval = setInterval(() =>
        setLiveTime(new Date()), 1000
      );

      return () => {
        clearInterval(interval);
      };
    }, []);
    return liveTime;
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
        }
      } finally {
        setLoading(false);
      }
    };

    handel_data_fetch();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d14] text-[#8a90a6] flex items-center justify-center font-sans">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="bg-[#0b0d14] text-[#eef0f6] min-h-screen font-sans bg-[radial-gradient(500px_400px_at_12%_8%,rgba(139,123,255,0.28),transparent_70%),radial-gradient(450px_400px_at_90%_30%,rgba(61,220,151,0.14),transparent_70%),radial-gradient(500px_450px_at_40%_100%,rgba(255,107,129,0.12),transparent_70%)] bg-fixed">
      <div className="max-w-[1040px] mx-auto px-5 pt-6 pb-14">
        {/* 1. Header / Navigation */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold tracking-wide text-base text-[#eef0f6]">
              DSA Mentor
            </h2>
          </div>
          <nav className="flex items-center gap-3.5">
            {username && (
              <span className="text-[#8a90a6] text-sm">
                User: <span className="text-[#eef0f6]">{username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-[#8a90a6] hover:text-[#eef0f6] text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Logout
            </button>
          </nav>
        </header>

        <main>
          {/* 2. Create AI Question Card */}
          <QuestionFrom />

          {/* 3. Statistics Section */}
          <section>
            <h2 className="text-[15px] font-semibold mt-8 mb-3.5 text-[#eef0f6]">
              Your Statistics
            </h2>
            <Statistics />
          </section>

          {/* 4. Problems Table Section */}
          <section>
            <h2 className="text-[15px] font-semibold mt-8 mb-3.5 text-[#eef0f6]">
              Problems
            </h2>
            <div className="bg-white/[0.06] border border-white/[0.12] rounded-[20px] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-2 pb-3.5 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-[13.5px]">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] uppercase tracking-[0.06em] font-medium text-[#8a90a6] px-3.5 py-3">
                      SR.no
                    </th>
                    <th className="text-left text-[11px] uppercase tracking-[0.06em] font-medium text-[#8a90a6] px-3.5 py-3">
                      Question
                    </th>
                    <th className="text-left text-[11px] uppercase tracking-[0.06em] font-medium text-[#8a90a6] px-3.5 py-3">
                      Topic
                    </th>
                    <th className="text-left text-[11px] uppercase tracking-[0.06em] font-medium text-[#8a90a6] px-3.5 py-3">
                      Subtopic
                    </th>
                    <th className="text-left text-[11px] uppercase tracking-[0.06em] font-medium text-[#8a90a6] px-3.5 py-3">
                      Date
                    </th>
                    <th className="text-left text-[11px] uppercase tracking-[0.06em] font-medium text-[#8a90a6] px-3.5 py-3">
                      Status
                    </th>
                    <th className="text-left text-[11px] uppercase tracking-[0.06em] font-medium text-[#8a90a6] px-3.5 py-3">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.map((item) => (
                    <tr
                      key={item.sr_no}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-3.5 py-[13px] border-t border-white/[0.07] align-top text-[#8a90a6]">
                        {item.sr_no}
                      </td>
                      <td className="px-3.5 py-[13px] border-t border-white/[0.07] align-top font-medium">
                        <Link
                          to={`/problem/${item.ques_no}`}
                          className="hover:text-[#8b7bff] transition-colors text-[#eef0f6]"
                        >
                          {item.question}
                        </Link>
                      </td>
                      <td className="px-3.5 py-[13px] border-t border-white/[0.07] align-top text-[#eef0f6]">
                        {item.topic}
                      </td>
                      <td className="px-3.5 py-[13px] border-t border-white/[0.07] align-top text-[#8a90a6]">
                        {item.subtopic || "none"}
                      </td>
                      <td className="px-3.5 py-[13px] border-t border-white/[0.07] align-top text-[#8a90a6]">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-3.5 py-[13px] border-t border-white/[0.07] align-top">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            item.status
                              ? "bg-[#3ddc97] shadow-[0_0_10px_#3ddc97]"
                              : "bg-[#ff6b81] shadow-[0_0_10px_#ff6b81]"
                          }`}
                        />
                      </td>
                      <td className="px-3.5 py-[13px] border-t border-white/[0.07] align-top text-[#8a90a6] text-[13px] leading-normal max-w-[340px]">
                        {item.remark || "no remark yet"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
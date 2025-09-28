import StatsChart from "../components/Stats/StatsChart.jsx";
import ArticleList from "../components/Articles/ArticleList.jsx";

export default function Home() {
  return (
    <div>
      <h2>Dashboard</h2>
      <StatsChart />
      <ArticleList />
    </div>
  );
}

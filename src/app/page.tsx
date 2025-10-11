import Cards from "./(components)/Cards";
import Dashboard from "./(components)/Dashboard";

export default function Home() {
  return (
    <div className="m-12">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <Cards />
      <Dashboard />
    </div>
  );
}

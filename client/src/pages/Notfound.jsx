import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-green-700">404</h1>
      <p className="text-gray-600 mt-2 mb-4">Page not found</p>
      <Link to="/dashboard" className="text-green-700 underline">
        Go to dashboard
      </Link>
    </div>
  );
};

export default NotFound;

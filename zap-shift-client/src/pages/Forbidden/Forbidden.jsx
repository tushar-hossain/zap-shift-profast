import { Link } from "react-router";
import { MdBlock } from "react-icons/md";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-10 text-center max-w-md">
        <MdBlock className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          403 - Forbidden
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don’t have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

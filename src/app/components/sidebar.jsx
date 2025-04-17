import React from "react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-6">NCAI-Admin-Portal</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/internships"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Internships
            </Link>
          </li>
          <li>
            <Link
              href="../pages/student"  
              className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Students
            </Link>
          </li>
          <li>
            <Link
              href="/reports"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Reports
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Certification
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
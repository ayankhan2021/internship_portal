"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";

export default function StudentList() {
  const [interns, setInterns] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/interns-data');
      const data = await response.json();
      setInterns(data);
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/interns-data/${id}`, { 
        method: 'DELETE' 
      });
      if (response.ok) {
        setInterns(interns.filter(intern => intern._id !== id));
      }
    } catch (error) {
      console.error('Error deleting intern:', error);
    }
  };

  const handleEdit = (intern) => {
    setSelectedIntern(intern);
    setShowEditModal(true);
  };

  const updateIntern = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/interns-data/${selectedIntern._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedIntern)
      });
      if (response.ok) {
        fetchInterns();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating intern:', error);
    }
  };

  const handleAssignProject = async (intern) => {
    const assignedProject = prompt("Enter project name:");
    if (!assignedProject) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/assign-project/${intern._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedProject, progress: 0 }),
      });
  
      if (response.ok) {
        fetchInterns();
      } else {
        console.error("Failed to update project.");
      }
    } catch (error) {
      console.error("Error assigning project:", error);
    }
  };

  const updateProgress = async (id, progress) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assign-project/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });
  
      if (response.ok) {
        setInterns(prevInterns =>
          prevInterns.map(intern =>
            intern._id === id ? { ...intern, progress } : intern
          )
        );
      } else {
        console.error("Failed to update progress.");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full">
            <div className="w-full p-4 border-b border-gray-300 flex justify-between items-center bg-gray-700 text-white">
              <h2 className="text-2xl font-semibold">Internship Candidates</h2>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">University</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3">Update Progress</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                  {interns.map((intern, index) => (
                    <tr key={intern._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-center">{index + 1}</td>
                      <td className="px-4 py-4">{intern.firstName} {intern.lastName}</td>
                      <td className="px-4 py-4">{intern.email}</td>
                      <td className="px-4 py-4">{intern.university}</td>
                      <td className="px-4 py-4">{intern.department}</td>
                      <td className="px-4 py-4">{intern.phone}</td>
                      <td className="px-4 py-4">{intern.domain}</td>
                      <td className="px-4 py-4">{intern.assignedProject || "Not assigned"}</td>
                      <td className="px-4 py-4">
                        <div className="relative w-32 h-4 bg-gray-300 rounded">
                          <div
                            className="absolute top-0 left-0 h-4 bg-green-500 rounded transition-all"
                            style={{ width: `${intern.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{intern.progress || 0}%</span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={intern.progress || 0}
                          onChange={(e) => updateProgress(intern._id, parseInt(e.target.value))}
                          className="border rounded p-1 bg-white shadow"
                        >
                          <option value="0">Not Started</option>
                          <option value="25">25%</option>
                          <option value="50">50%</option>
                          <option value="75">75%</option>
                          <option value="100">Completed</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 flex space-x-2">
                        <button 
                          onClick={() => handleEdit(intern)}
                          className="text-green-600 hover:text-green-800 text-lg"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(intern._id)}
                          className="text-red-600 hover:text-red-800 text-lg"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleAssignProject(intern)}
                          className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800 transition text-sm"
                        >
                          Assign Project
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {showEditModal && selectedIntern && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Edit Intern Details</h3>
              <input
                type="text"
                placeholder="First Name"
                value={selectedIntern.firstName}
                onChange={(e) => setSelectedIntern({...selectedIntern, firstName: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={selectedIntern.lastName}
                onChange={(e) => setSelectedIntern({...selectedIntern, lastName: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={selectedIntern.email}
                onChange={(e) => setSelectedIntern({...selectedIntern, email: e.target.value})}
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={updateIntern}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
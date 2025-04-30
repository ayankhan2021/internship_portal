'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import RouteGuard from '../../components/RouteGuard';
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHistory, faEye, faUserGraduate, faFileAlt,
  faCalendarCheck, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

function PastInternsManagement() {
  const { user } = useAuth();
  const [pastInterns, setPastInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [viewInternModalOpen, setViewInternModalOpen] = useState(false);

  // Fetch past interns
  useEffect(() => {
    const fetchPastInterns = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // Get past interns data
        const response = await axios.get('http://localhost:5000/api/interns/past', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Past interns data:", response.data);
        setPastInterns(response.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching past interns:', error);
        setError(error.response?.data?.message || 'Failed to load past interns');
      } finally {
        setLoading(false);
      }
    };

    fetchPastInterns();
  }, []);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format task text helper function
  const formatTaskText = (text) => {
    if (!text) return '';
    const textStr = typeof text === 'string' ? text : String(text);
    return textStr
      .replace(/^\[|\]$|^"|"$|^'|'$/g, '')
      .replace(/\\"/g, '"')
      .trim();
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'Incomplete':
        return 'bg-yellow-100 text-yellow-800';
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Open view intern modal
  const openViewInternModal = (intern) => {
    setSelectedIntern(intern);
    setViewInternModalOpen(true);
  };

  // Calculate intern completion rate
  const calculateCompletionRate = (intern) => {
    if (!intern || !intern.assignedProjects || intern.assignedProjects.length === 0) {
      return 0;
    }
    
    const completedProjects = intern.assignedProjects.filter(
      project => project.status === 'Completed'
    ).length;
    
    return Math.round((completedProjects / intern.assignedProjects.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-lg">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Past Interns</h1>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    <FontAwesomeIcon icon={faHistory} className="mr-2 text-gray-600" />
                    Completed Internships
                  </h2>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Total: {pastInterns.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Projects</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastInterns.length > 0 ? (
                        pastInterns.map((intern) => (
                          <tr key={intern._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon icon={faUserGraduate} className="text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{intern.name}</div>
                                  <div className="text-sm text-gray-500">{intern.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {intern.duration || 'N/A'} {intern.duration === 1 ? 'month' : 'months'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-green-600 h-2.5 rounded-full"
                                  style={{ width: `${calculateCompletionRate(intern)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{calculateCompletionRate(intern)}%</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(intern.endDate || intern.deletedAt)}
                            </td>
                            <td className="px-6 py-4">
                              {intern.deletedProjects && intern.deletedProjects.length > 0 ? (
                                <ul className="list-disc pl-5 max-h-32 overflow-y-auto">
                                  {intern.deletedProjects.map((project, idx) => (
                                    <li key={idx} className="text-sm">
                                      {project.title}
                                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                        project.status === "Completed" ? "bg-green-100 text-green-800" :
                                        project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                        "bg-yellow-100 text-yellow-800"
                                      }`}>
                                        {project.status}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500">No projects</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => openViewInternModal(intern)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No past interns found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* View Past Intern Modal */}
        {selectedIntern && viewInternModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedIntern.name}</h2>
                <button
                  onClick={() => setViewInternModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Basic Information</h3>
                  <p><span className="font-medium">Email:</span> {selectedIntern.email}</p>
                  <p><span className="font-medium">Username:</span> {selectedIntern.username}</p>
                  <p><span className="font-medium">Duration:</span> {selectedIntern.duration || 'N/A'} {selectedIntern.duration === 1 ? 'month' : 'months'}</p>
                  <p><span className="font-medium">Internship Period:</span> {formatDate(selectedIntern.createdAt)} - {formatDate(selectedIntern.endDate || selectedIntern.deletedAt)}</p>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">Performance Summary</h3>
                  <p><span className="font-medium">Completion Rate:</span> {calculateCompletionRate(selectedIntern)}%</p>
                  <p>
                    <span className="font-medium">Projects Completed:</span> {
                      selectedIntern.deletedProjects?.filter(p => p.status === 'Completed').length || 0
                    } of {selectedIntern.deletedProjects?.length || 0}
                  </p>
                  <p>
                    <span className="font-medium">Attendance Rate:</span> {
                      selectedIntern.attendance ? 
                      `${Math.round((selectedIntern.attendance.filter(a => a.status === 'Present').length / selectedIntern.attendance.length) * 100)}%` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Assigned Tasks</h3>
                {selectedIntern.tasks && selectedIntern.tasks.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {Array.isArray(selectedIntern.tasks) 
                      ? selectedIntern.tasks.map((task, index) => (
                          <li key={index} className="mb-1">{formatTaskText(task)}</li>
                        ))
                      : typeof selectedIntern.tasks === 'string'
                        ? (selectedIntern.tasks.startsWith('[') && selectedIntern.tasks.endsWith(']')
                          ? (() => {
                              try {
                                return JSON.parse(selectedIntern.tasks).map((task, index) => (
                                  <li key={index} className="mb-1">{formatTaskText(task)}</li>
                                ));
                              } catch (e) {
                                // If parsing fails, split by comma
                                return selectedIntern.tasks
                                  .replace(/^\[|\]$/g, '') // Remove brackets if present
                                  .split(',')
                                  .map((task, index) => (
                                    <li key={index} className="mb-1">{formatTaskText(task)}</li>
                                  ));
                              }
                            })()
                          : // Otherwise, split by comma
                            selectedIntern.tasks.split(',').map((task, index) => (
                              <li key={index} className="mb-1">{formatTaskText(task)}</li>
                            ))
                        )
                      : <li>Unable to display tasks</li>
                    }
                  </ul>
                ) : (
                  <p className="text-gray-500">No tasks assigned</p>
                )}
              </div>

              {selectedIntern.deletedProjects && selectedIntern.deletedProjects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Completed Projects</h3>
                  <div className="space-y-3">
                    {selectedIntern.deletedProjects.map((project, index) => (
                      <div key={index} className="border p-3 rounded">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{project.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{formatTaskText(project.description)}</p>
                        {project.feedback && project.feedback.length > 0 && (
                          <div className="mt-2 bg-gray-50 p-2 rounded">
                            <p className="text-xs font-medium text-gray-700">Feedback:</p>
                            <p className="text-xs text-gray-600">
                              {formatTaskText(project.feedback[project.feedback.length - 1].comment)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIntern.attendance && selectedIntern.attendance.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Attendance Summary</h3>
                  <div className="flex mb-4 space-x-4">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex-1 text-center">
                      <p className="text-sm text-gray-600">Present</p>
                      <p className="text-xl font-bold text-green-600">
                        {selectedIntern.attendance.filter(a => a.status === 'Present').length}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex-1 text-center">
                      <p className="text-sm text-gray-600">Absent</p>
                      <p className="text-xl font-bold text-red-600">
                        {selectedIntern.attendance.filter(a => a.status === 'Absent').length}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex-1 text-center">
                      <p className="text-sm text-gray-600">Late</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {selectedIntern.attendance.filter(a => a.status === 'Late').length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedIntern.progressUpdates && selectedIntern.progressUpdates.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Progress Reports</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedIntern.progressUpdates.slice().reverse().map((update, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600">
                            {formatDate(update.date || update.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{update.content || update.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProtectedPastInternsPage() {
  return (
    <RouteGuard requireAdmin={true}>
      <PastInternsManagement />
    </RouteGuard>
  );
}
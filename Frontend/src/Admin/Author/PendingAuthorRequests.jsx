import React, { useState, useEffect, useContext } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { AuthContext } from "../../context/Authcontext";
import "../Author/Authordetails.css";

const PendingAuthorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/author-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data.requests);
      } else {
        alert(data.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('An error occurred while fetching requests');
    }
    setLoading(false);
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/author-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        alert('Request approved successfully!');
        fetchRequests(); // Refresh the list
      } else {
        alert(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('An error occurred while approving the request');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  if (loading) {
    return <div className="authors-container"><p>Loading...</p></div>;
  }

  return (
    <div className="authors-container">
      <div className="authors-header">
        <div>
          <h2>Pending Author Requests</h2>
          <p>Review and approve author applications</p>
        </div>
      </div>

      <div className="authors-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.fullName}</td>
                <td>{request.email}</td>
                <td>{new Date(request.submittedAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => handleViewDetails(request)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleApprove(request._id)}
                    title="Approve"
                    style={{ backgroundColor: '#4CAF50', color: 'white' }}
                  >
                    <CheckCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ maxWidth: '600px' }}>
            <h3>Author Request Details</h3>
            <div className="dialog-body">
              <div style={{ marginBottom: '15px' }}>
                <strong>Full Name:</strong> {selectedRequest.fullName}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Email:</strong> {selectedRequest.email}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Bio:</strong>
                <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{selectedRequest.bio}</p>
              </div>
              {selectedRequest.topics && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Topics:</strong> {selectedRequest.topics}
                </div>
              )}
              {selectedRequest.portfolio && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Portfolio:</strong> <a href={selectedRequest.portfolio} target="_blank" rel="noopener noreferrer">{selectedRequest.portfolio}</a>
                </div>
              )}
              <div style={{ marginBottom: '15px' }}>
                <strong>Submitted:</strong> {new Date(selectedRequest.submittedAt).toLocaleString()}
              </div>
            </div>
            <div className="dialog-footer">
              <button
                className="cancel-btn"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
              <button
                className="save-btn"
                onClick={() => {
                  handleApprove(selectedRequest._id);
                  setSelectedRequest(null);
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAuthorRequests;

import React, { useState, useEffect } from "react";
import { CheckCircle, Eye, Mail, Calendar } from "lucide-react";
import "../Author/Authordetails.css";

const PendingAuthorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('An error occurred while fetching requests');
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
    return (
      <div className="authors-container min-h-screen px-4 py-6 md:px-8">
        <div className="state-card rounded-2xl bg-white p-4 shadow-sm">Loading requests…</div>
      </div>
    );
  }

  const filteredRequests = requests.filter((request) => {
    const name = (request.fullName || "").toLowerCase();
    const email = (request.email || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="authors-container min-h-screen px-4 py-6 md:px-8">
      <div className="authors-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-xs uppercase tracking-[0.3em] font-semibold text-indigo-500">
            Admin review
          </span>
          <h2 className="text-3xl font-semibold text-slate-900">Author Requests</h2>
          <p className="text-sm text-slate-500">Review applications and approve new writers.</p>
        </div>
        <div className="meta-pill inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
          Pending: {requests.length}
        </div>
      </div>

      <div className="search-bar">
        <Eye size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="state-card error rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="request-grid">
        {filteredRequests.map((request) => (
          <article key={request._id} className="request-card rounded-2xl bg-white p-4 shadow-sm">
            <div className="request-head">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {request.fullName || "Unnamed"}
                </h3>
                <span className="request-tag">Author application</span>
              </div>
              <button
                className="icon-btn edit"
                onClick={() => handleViewDetails(request)}
                title="View Details"
              >
                <Eye size={16} />
              </button>
            </div>
            <div className="request-meta">
              <div>
                <Mail size={14} />
                <span>{request.email || "—"}</span>
              </div>
              <div>
                <Calendar size={14} />
                <span>
                  {request.submittedAt
                    ? new Date(request.submittedAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
            <p className="request-bio text-sm text-slate-500">
              {(request.bio || "No bio submitted.").slice(0, 140)}
              {request.bio && request.bio.length > 140 ? "…" : ""}
            </p>
            <div className="request-actions">
              <button
                className="approve-btn"
                onClick={() => handleApprove(request._id)}
              >
                <CheckCircle size={16} />
                Approve request
              </button>
            </div>
          </article>
        ))}
        {filteredRequests.length === 0 && (
          <div className="empty-state text-center text-sm text-slate-500">
            <h4 className="text-base font-semibold text-slate-900">No requests found</h4>
            <p>Try a different search term or check back later.</p>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="dialog-overlay">
          <div className="dialog request-dialog rounded-2xl bg-white p-6 shadow-xl">
            <div className="dialog-header">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedRequest.fullName || "Author request"}
                </h3>
                <p className="text-sm text-slate-500">Full application details</p>
              </div>
              <button
                className="icon-btn"
                onClick={() => setSelectedRequest(null)}
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="dialog-body">
              <div className="dialog-grid">
                <div>
                  <label>Full Name</label>
                  <p>{selectedRequest.fullName || "—"}</p>
                </div>
                <div>
                  <label>Email</label>
                  <p>{selectedRequest.email || "—"}</p>
                </div>
                <div>
                  <label>Topics</label>
                  <p>{selectedRequest.topics || "—"}</p>
                </div>
                <div>
                  <label>Submitted</label>
                  <p>
                    {selectedRequest.submittedAt
                      ? new Date(selectedRequest.submittedAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="dialog-span">
                  <label>Bio</label>
                  <p className="bio-block">{selectedRequest.bio || "No bio submitted."}</p>
                </div>
                {selectedRequest.portfolio && (
                  <div className="dialog-span">
                    <label>Portfolio</label>
                    <a
                      href={selectedRequest.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedRequest.portfolio}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="dialog-footer">
              <button className="cancel-btn" onClick={() => setSelectedRequest(null)}>
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

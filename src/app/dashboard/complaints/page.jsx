'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy, Search, Loader2, X, Send, User, Mail, Phone,
  Clock, CheckCircle, AlertCircle, Circle, UserCheck,
  ChevronRight, Filter, Trash2, Building2
} from 'lucide-react';
import axios from 'axios';
import Navbar from '@/component/Navbar/Navbar';
import Sidebar from '@/component/Sidebar/Sidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3085/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superAdminToken') : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const STATUS_STYLES = {
  open: { label: 'Open', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
};

const PRIORITY_STYLES = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium}`}>
      {priority}
    </span>
  );
}

// ============================================================
// Ticket Detail / Thread Panel
// ============================================================
function TicketDetailPanel({ ticket, onClose, onUpdate }) {
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!ticket) return null;

  const storeName =
    ticket.storeId?.storeInfo?.companyName || ticket.hotelName || 'Unknown Store';

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/tickets/reply/${ticket._id}`,
        {
          senderType: 'admin',
          senderName: 'Support Team',
          message: replyMessage.trim(),
        },
        getAuthHeaders()
      );
      if (res.data.success) {
        setReplyMessage('');
        onUpdate(res.data.ticket);
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleAccept = async () => {
    setUpdating(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tickets/assign/${ticket._id}`,
        { assignedTo: 'Support Team' },
        getAuthHeaders()
      );
      if (res.data.success) onUpdate(res.data.ticket);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept ticket');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tickets/status/${ticket._id}`,
        { status },
        getAuthHeaders()
      );
      if (res.data.success) onUpdate(res.data.ticket);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (priority) => {
    setUpdating(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tickets/priority/${ticket._id}`,
        { priority },
        getAuthHeaders()
      );
      if (res.data.success) onUpdate(res.data.ticket);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update priority');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="relative bg-gray-50 w-full sm:w-[560px] h-full shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-5 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-mono">{ticket.ticketNumber}</p>
              <h2 className="font-semibold text-gray-900 text-lg truncate">{ticket.subject}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 flex-shrink-0">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            {ticket.assignedTo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                <UserCheck className="w-3 h-3" />
                {ticket.assignedTo}
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{storeName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{ticket.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{ticket.phone}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={ticket.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              disabled={updating}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {!ticket.assignedTo && (
            <button
              onClick={handleAccept}
              disabled={updating}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              Accept Ticket
            </button>
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Original message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {storeName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3">
                <p className="text-xs text-gray-400 mb-1">{formatDateTime(ticket.createdAt)}</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>
          </div>

          {ticket.replies?.map((reply, idx) => {
            const isAdmin = reply.senderType === 'admin';
            return (
              <div key={idx} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    isAdmin ? 'bg-indigo-500' : 'bg-gray-300'
                  }`}
                >
                  {(reply.senderName || (isAdmin ? 'A' : 'U')).charAt(0)}
                </div>
                <div className="flex-1 min-w-0 max-w-[85%]">
                  <div
                    className={`rounded-2xl p-3 ${
                      isAdmin
                        ? 'bg-indigo-600 text-white rounded-tr-sm ml-auto'
                        : 'bg-white border border-gray-200 rounded-tl-sm'
                    }`}
                  >
                    <p className={`text-xs mb-1 ${isAdmin ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {reply.senderName || (isAdmin ? 'Support' : 'Customer')} · {formatDateTime(reply.createdAt)}
                    </p>
                    <p className={`text-sm whitespace-pre-wrap ${isAdmin ? 'text-white' : 'text-gray-800'}`}>
                      {reply.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply box */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendReply}
              disabled={sending || !replyMessage.trim()}
              className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================
export default function TicketsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/tickets/admin/all`, getAuthHeaders());
      if (res.data.success) setTickets(res.data.tickets);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleDelete = async (ticketId) => {
    if (!confirm('Delete this ticket permanently?')) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/tickets/${ticketId}`, getAuthHeaders());
      if (res.data.success) {
        setTickets((prev) => prev.filter((t) => t._id !== ticketId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const handleTicketUpdate = (updatedTicket) => {
    setSelectedTicket(updatedTicket);
    setTickets((prev) => prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)));
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      !search ||
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.hotelName?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    const matchesPriority = !priorityFilter || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const counts = {
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} onClose={() => isMobile && setIsSidebarOpen(false)} />
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <div
        className={`transition-all duration-300 pt-20 ${
          !isMobile && isSidebarOpen ? 'ml-64' : !isMobile && !isSidebarOpen ? 'ml-20' : 'ml-0'
        }`}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <LifeBuoy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Support Tickets</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage and respond to store support requests</p>
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {Object.entries(STATUS_STYLES).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
                className={`bg-white rounded-xl border p-3 text-left transition ${
                  statusFilter === key ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{counts[key]}</p>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ticket #, subject, store, email..."
                className="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {(statusFilter || priorityFilter || search) && (
              <button
                onClick={() => {
                  setStatusFilter('');
                  setPriorityFilter('');
                  setSearch('');
                }}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Ticket list */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">
                <LifeBuoy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                No tickets found.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((ticket) => {
                  const storeName = ticket.storeId?.storeInfo?.companyName || ticket.hotelName;
                  return (
                    <button
                      key={ticket._id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {storeName?.charAt(0) || 'S'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium text-gray-900 text-sm truncate">{ticket.subject}</p>
                          <span className="text-xs text-gray-400 font-mono flex-shrink-0">{ticket.ticketNumber}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {storeName} · {ticket.email}
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                      </div>

                      <span className="text-xs text-gray-400 flex-shrink-0 hidden md:block">
                        {formatDateTime(ticket.createdAt)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ticket._id);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 transition flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailPanel
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdate={handleTicketUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
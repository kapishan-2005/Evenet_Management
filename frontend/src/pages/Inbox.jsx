import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import Badge from '../components/ui/Badge';
import { api } from '../services/api';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [active, setActive]     = useState(null);
  const [tab, setTab]           = useState('new');
  const [error, setError]       = useState('');

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const avatarColors = [
    'bg-blue-700', 'bg-purple-700', 'bg-green-700',
    'bg-red-700',  'bg-pink-700',   'bg-indigo-700',
  ];

  return (
    <div>
      <TopBar subtitle="Messages" title="Inbox" />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#222] mb-6">
        {['new', 'watched'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium uppercase tracking-wider transition-colors ${
              tab === t
                ? 'text-white border-b-2 border-[#FFE500]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-12 text-xs text-gray-600 uppercase tracking-wider px-4 mb-3">
        <span className="col-span-4">Full Name</span>
        <span className="col-span-4">Email</span>
        <span className="col-span-3">Message</span>
        <span className="col-span-1"></span>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#FFE500]/30 border-t-[#FFE500] rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-gray-600">No messages found</div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <div
              key={msg._id}
              onClick={() => setActive(msg._id)}
              className={`grid grid-cols-12 items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                active === msg._id
                  ? 'bg-[#1E1E00] border border-[#FFE500]/30'
                  : 'bg-[#141414] border border-[#222] hover:border-[#333]'
              }`}
            >
              {/* Name */}
              <div className="col-span-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white ${avatarColors[i % avatarColors.length]}`}>
                  {getInitials(msg.fullName || msg.name)}
                </div>
                <span className="text-sm text-gray-300 font-medium truncate">
                  {msg.fullName || msg.name || 'Unknown'}
                </span>
              </div>

              {/* Email */}
              <div className="col-span-4">
                <span className="text-sm text-gray-500 truncate block">
                  {msg.email || '—'}
                </span>
              </div>

              {/* Preview */}
              <div className="col-span-3">
                <span className="text-sm text-gray-500 truncate block">
                  {msg.message || msg.content || '—'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end items-center gap-2">
                {!msg.read && <Badge text="New" color="yellow" />}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
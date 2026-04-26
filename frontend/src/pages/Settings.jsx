import { useState } from 'react';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import TopBar from '../components/layout/TopBar';

const auditLogs = [
  { text: 'Security Credentials Updated',       time: '2 MIN AGO · 14:37:00'  },
  { text: 'New Administrator Login: John King', time: '5 MIN AGO · 14:34:00'  },
  { text: 'Login Success: Colombia Region IP',  time: '23 MIN AGO · 14:16:00' },
];

export default function Settings() {
  const [color, setColor] = useState('#FFE748');
  const [brandName, setBrandName] = useState('Admin Dashboard');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <TopBar subtitle="System Configuration" title="Admin Settings" />

      <div className="grid grid-cols-3 gap-6">

        {/* Left — Brand + Security */}
        <div className="col-span-2 space-y-6">

          {/* Brand Identity */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold">Brand Identity</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Control the display signature of the public portal
                </p>
              </div>
              <Shield size={18} className="text-[#FFE500]" />
            </div>

            {/* Brand Name */}
            <div className="mb-5">
              <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm px-4 py-2.5 rounded-md focus:outline-none focus:border-[#FFE500] transition-colors"
              />
            </div>

            {/* Logo */}
            <div className="mb-5">
              <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-2">
                Main Portal Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1A1A1A] border border-[#333] rounded-md flex items-center justify-center">
                  <Upload size={20} className="text-gray-600" />
                </div>
                <div>
                  <button className="text-xs bg-[#222] text-white px-4 py-2 rounded-md hover:bg-[#333] transition-colors border border-[#333]">
                    Replace Logo
                  </button>
                  <p className="text-gray-600 text-[10px] mt-1.5">
                    PNG or SVG · max 2MB · recommended 512×512
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Color */}
            <div className="mb-6">
              <label className="text-gray-500 text-[10px] uppercase tracking-wider block mb-2">
                Brand Primary Color
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md border border-[#333]"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-md px-4 py-2.5 flex items-center justify-between">
                  <span className="text-white text-sm font-mono">
                    {color.toUpperCase()}
                  </span>
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-[#FFE500] text-black hover:bg-yellow-300'
              }`}
            >
              {saved && <CheckCircle size={14} />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

          {/* Security */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Admin Portal Security</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Manage advanced system protection and portal access
                </p>
              </div>
              <Shield size={18} className="text-[#FFE500]" />
            </div>
            <p className="text-gray-500 text-sm mb-5">
              Update your administrator password regularly to maintain
              the highest level of system integrity.
            </p>
            <button className="w-full bg-[#FFE500] text-black text-sm font-bold py-3 rounded-md uppercase tracking-wider hover:bg-yellow-300 transition-colors">
              Change Admin Password
            </button>
          </div>
        </div>

        {/* Right — Server + Audit */}
        <div className="space-y-6">

          {/* Server Status */}
          <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
            <div className="h-36 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center">
              <div className="grid grid-cols-6 gap-1.5 opacity-40">
                {[...Array(36)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#FFE500] rounded-sm"
                    style={{ opacity: Math.random() }}
                  />
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-[#FFE500] text-[10px] uppercase tracking-widest mb-1">
                Server Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-semibold">Active & Secure</span>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Recent Audit Logs</h3>
            <div className="space-y-3">
              {auditLogs.map((log, i) => (
                <div key={i} className="border-l-2 border-[#FFE500] pl-3">
                  <p className="text-white text-xs font-medium">{log.text}</p>
                  <p className="text-gray-600 text-[10px] mt-0.5">{log.time}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[#FFE500] text-xs hover:underline">
              VIEW ALL LOGS →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
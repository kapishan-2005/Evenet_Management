import { Bell, HelpCircle, Search } from 'lucide-react';

export default function TopBar({ title, subtitle }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        {subtitle && (
          <p className="text-[#FFE500] text-xs uppercase tracking-widest mb-1">
            {subtitle}
          </p>
        )}
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Filter and search..."
            className="bg-[#1A1A1A] border border-[#333] text-gray-400 text-sm pl-9 pr-4 py-2 rounded-md w-52 focus:outline-none focus:border-[#FFE500] transition-colors"
          />
        </div>
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFE500] rounded-full"></span>
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { MapPin, Upload, X, CheckCircle } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { uploadEvent } from '../services/upload';

const categories = ['Exhibition', 'Festivals', 'Entertainment', 'Education', 'Jobs'];
const districts  = ['Select District', 'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'];

export default function PostEvent() {
  const [title, setTitle]           = useState('');
  const [location, setLocation]     = useState('');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict]     = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [tags, setTags]             = useState([]);
  const [tagInput, setTagInput]     = useState('');
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');

  const toggleCat = (c) =>
    setSelectedCats(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...prev, `#${tagInput.trim()}`]);
      setTagInput('');
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      setError('Event title is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('date', startDate);
      formData.append('time', endDate);
      formData.append('category', selectedCats.join(','));
      if (image) formData.append('image', image);

      await uploadEvent(formData);
      setSuccess(true);

      // Reset form
      setTitle(''); setLocation(''); setStartDate('');
      setEndDate(''); setDescription(''); setSelectedCats([]);
      setTags([]); setImage(null); setPreview(null);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to publish event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar subtitle="Digital 3IL · Concierge" title="" />

      {/* Hero Title */}
      <div className="mb-6">
        <p className="text-[#FFE500] text-xs uppercase tracking-widest">
          Digital 3IL · Concierge
        </p>
        <h1 className="text-4xl font-bold text-white mt-1">
          Curate a{' '}
          <span className="text-[#FFE500] italic">
            New<br />Experience
          </span>
        </h1>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-md mb-4 flex items-center gap-2">
          <CheckCircle size={16} />
          Event published successfully!
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-8">
        <button
          onClick={() => {
            setTitle(''); setDescription('');
            setLocation(''); setStartDate('');
            setEndDate(''); setSelectedCats([]);
            setImage(null); setPreview(null);
          }}
          className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-[#FFE500] text-black text-sm font-bold rounded-md hover:bg-yellow-300 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          )}
          Publish Event
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-6">

          {/* Title */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
              01 — Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter the grand title of your event..."
              className="w-full bg-[#141414] border border-[#333] text-white text-sm px-4 py-3 rounded-md focus:outline-none focus:border-[#FFE500] placeholder-gray-600 transition-colors"
            />
          </div>

          {/* Venue + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
                02 — The Venue
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Galle Face, Colombo..."
                  className="w-full bg-[#141414] border border-[#333] text-white text-sm pl-9 pr-4 py-3 rounded-md focus:outline-none focus:border-[#FFE500] placeholder-gray-600 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
                03 — Temporal Frame
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="flex-1 bg-[#141414] border border-[#333] text-gray-400 text-xs px-2 py-3 rounded-md focus:outline-none focus:border-[#FFE500] transition-colors"
                />
                <span className="text-gray-600 text-xs">TO</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="flex-1 bg-[#141414] border border-[#333] text-gray-400 text-xs px-2 py-3 rounded-md focus:outline-none focus:border-[#FFE500] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
              04 — Narrative Description
            </label>
            <textarea
              rows={7}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the soul of this experience..."
              className="w-full bg-[#141414] border border-[#333] text-white text-sm px-4 py-3 rounded-md focus:outline-none focus:border-[#FFE500] placeholder-gray-600 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Image Upload */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
              05 — Visual Anchor (Thumbnail)
            </label>
            <label
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="w-full h-48 bg-[#141414] border-2 border-dashed border-[#333] rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#FFE500] transition-colors group overflow-hidden relative"
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs">Click to change image</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-600 group-hover:text-[#FFE500] transition-colors" />
                  <p className="text-gray-600 text-xs text-center group-hover:text-gray-400 transition-colors">
                    Drag visual assets here<br />
                    <span className="text-[10px]">or click to browse · PNG, JPG · max 5MB</span>
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {/* Publishing Settings */}
          <div className="bg-[#141414] border border-[#222] rounded-md p-4 space-y-4">
            <p className="text-[#FFE500] text-[10px] uppercase tracking-widest font-semibold">
              Publishing Settings
            </p>

            {/* Categories */}
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">
                Category Selection
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleCat(c)}
                    className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
                      selectedCats.includes(c)
                        ? 'bg-[#FFE500] text-black border-[#FFE500] font-medium'
                        : 'text-gray-400 border-[#333] hover:border-[#FFE500] hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* District */}
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">
                Location Context
              </p>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] text-gray-400 text-sm px-3 py-2 rounded-md focus:outline-none focus:border-[#FFE500] transition-colors"
              >
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Release Date */}
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">
                Release Date
              </p>
              <input
                type="date"
                value={releaseDate}
                onChange={e => setReleaseDate(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] text-gray-400 text-sm px-3 py-2 rounded-md focus:outline-none focus:border-[#FFE500] transition-colors"
              />
            </div>

            {/* Tags */}
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">
                Instance / Tags
              </p>
              <div className="flex flex-wrap gap-2 bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 min-h-[36px]">
                {tags.map((t, i) => (
                  <span key={i} className="flex items-center gap-1 bg-[#222] text-gray-300 text-xs px-2 py-0.5 rounded-md">
                    {t}
                    <button onClick={() => setTags(prev => prev.filter((_, j) => j !== i))}>
                      <X size={10} className="text-gray-500 hover:text-red-400" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="+ Add tag"
                  className="bg-transparent text-xs text-gray-400 placeholder-gray-600 focus:outline-none w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
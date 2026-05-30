import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { LogOut, Mail, User as UserIcon, ShieldCheck, Camera, Loader2 } from 'lucide-react';

const ProfilePopup: React.FC = () => {
  const { user, logout, updateAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await updateAvatar(file);
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 group">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-slate-100 flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            ) : (
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            )}
            
            {!isUploading && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Camera size={18} className="mb-0.5" />
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Change</span>
              </div>
            )}
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Change profile picture"
          />
          <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-sm" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full mt-2 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-blue-500" />
          Active Member
        </span>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/50">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-blue-500">
            <UserIcon size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</p>
            <p className="text-sm font-medium text-slate-700">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/50">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-purple-500">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
            <p className="text-sm font-medium text-slate-700">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
          Edit Profile
        </button>
        <button 
          onClick={() => logout()}
          className="w-full py-2.5 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;

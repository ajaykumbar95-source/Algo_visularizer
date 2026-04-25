import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  onAuthClick: () => void;
  onAdminClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  speed,
  onSpeedChange,
  canGoNext,
  canGoPrev,
  onAuthClick,
  onAdminClick,
}) => {
  const { user, logout } = useAuth();
  return (
    <div className="h-16 border-b border-background-lighter bg-background-light/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          disabled={!canGoPrev || isPlaying}
          title="Previous Step"
        >
          <ChevronLeft size={20} />
        </Button>
        
        <Button
          variant={isPlaying ? 'secondary' : 'primary'}
          size="icon"
          onClick={onTogglePlay}
          className={cn(
            "w-10 h-10 rounded-full",
            !isPlaying && "bg-gradient-to-br from-primary to-secondary hover:brightness-110"
          )}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={!canGoNext || isPlaying}
          title="Next Step"
        >
          <ChevronRight size={20} />
        </Button>

        <div className="w-px h-6 bg-background-lighter mx-2" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          title="Reset"
        >
          <RotateCcw size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-6">
        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-background-lighter">
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                speed === s 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:text-white hover:bg-background-lighter"
              )}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-background-lighter mx-2" />

        {/* User Auth Section */}
        {user ? (
          <div className="flex items-center gap-4 pl-2">
            {user.role === 'ADMIN' && (
              <button 
                onClick={onAdminClick}
                className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all group"
                title="Admin Dashboard"
              >
                <ShieldAlert size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white leading-none">{user.username}</span>
              <span className="text-[10px] text-slate-500 font-medium">{user.role === 'ADMIN' ? 'Administrator' : 'Logged In'}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        ) : (
          <Button 
            variant="primary" 
            className="rounded-xl px-6"
            onClick={onAuthClick}
          >
            <UserIcon size={18} className="mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopBar;

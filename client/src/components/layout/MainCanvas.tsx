import React from 'react';

interface MainCanvasProps {
  children: React.ReactNode;
  title: string;
  description: string;
  stepDescription?: string;
}

const MainCanvas: React.FC<MainCanvasProps> = ({ children, title, description, stepDescription }) => {
  return (
    <main className="flex-1 bg-background relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="p-8 pb-0 shrink-0 relative z-10 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-500 text-sm max-w-2xl">{description}</p>
        </div>
        {stepDescription && (
          <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            {stepDescription}
          </div>
        )}
      </div>

      <div className="flex-1 p-8 relative z-10 flex items-center justify-center">
        <div className="w-full h-full max-w-5xl max-h-[600px] panel-blur rounded-3xl p-8 flex items-center justify-center shadow-2xl shadow-black/40 overflow-hidden relative">
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainCanvas;


import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Timeline from './components/Timeline';
import CanvasPreview from './components/CanvasPreview';
import { useEditorStore } from './store/useEditorStore';

export default function App() {
  const { isLoading, exportingPercentage } = useEditorStore();

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-body selection:bg-brand-pink selection:text-white">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftPanel />
        <main className="flex-1 bg-zinc-900 border-x border-zinc-800 relative shadow-inner overflow-hidden flex items-center justify-center">
          {/* Background Pattern for Canvas Area */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <CanvasPreview />
        </main>
        <RightPanel />
      </div>
      <Timeline />
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 border-4 border-zinc-800 border-t-brand-purple rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-heading font-bold mb-2 text-center">Exporting Video...</h3>
            <p className="text-zinc-400 text-sm mb-6 text-center">Rendering frames and muxing audio. Please do not close this tab.</p>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-purple to-brand-pink h-full transition-all duration-300"
                style={{ width: `${exportingPercentage}%` }}
              />
            </div>
            <div className="mt-2 text-xs font-mono text-zinc-500">{exportingPercentage}% Complete</div>
          </div>
        </div>
      )}
    </div>
  );
}

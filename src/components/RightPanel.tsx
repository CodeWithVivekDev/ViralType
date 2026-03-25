import { useEditorStore } from '../store/useEditorStore';
import { TEMPLATES } from '../config/templates';
import { Settings, Zap, MonitorPlay } from 'lucide-react';

export default function RightPanel() {
  const { isViralMode, setIsViralMode, templateId, setTemplateId, exportSettings, setExportSettings } = useEditorStore();

  const handleViralToggle = () => {
    const newState = !isViralMode;
    setIsViralMode(newState);
    if (newState) {
      setTemplateId('viral');
    } else if (templateId === 'viral') {
      setTemplateId('motivation'); // fallback
    }
  };

  return (
    <aside className="w-72 bg-zinc-950 flex flex-col shrink-0 overflow-y-auto border-l border-zinc-800">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Global Properties
        </h2>
        
        <div className="space-y-6">
          {/* Viral Mode Toggle */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${isViralMode ? 'text-brand-pink fill-brand-pink' : 'text-zinc-500'}`} />
                <span className="text-sm font-bold text-white">Viral Mode</span>
              </div>
              <button 
                onClick={handleViralToggle}
                className={`w-10 h-6 rounded-full transition-colors relative ${isViralMode ? 'bg-brand-pink' : 'bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isViralMode ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-applies the Viral template, beat sync, and emoji engine.
            </p>
          </div>

          {/* Template Selector (only relevant if not forced viral) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Template</label>
            <select 
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value);
                if (e.target.value !== 'viral') setIsViralMode(false);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-sm p-3 text-white focus:outline-none focus:border-brand-purple"
            >
              {Object.values(TEMPLATES).map(tpl => (
                <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MonitorPlay className="w-4 h-4" /> Export Settings
        </h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500">Resolution</label>
            <select 
              value={exportSettings.resolution}
              onChange={(e) => setExportSettings({ resolution: e.target.value as '1080x1920' | '720x1280' })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-sm p-2 text-white outline-none"
            >
              <option value="1080x1920">1080x1920 (High Quality)</option>
              <option value="720x1280">720x1280 (Fast Render)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500">Framerate (FPS)</label>
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {[24, 30].map(fps => (
                <button
                  key={fps}
                  onClick={() => setExportSettings({ fps: fps as 24 | 30 })}
                  className={`flex-1 py-1.5 text-sm rounded ${exportSettings.fps === fps ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500">Format</label>
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {['mp4', 'webm'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setExportSettings({ format: fmt as 'mp4' | 'webm' })}
                  className={`flex-1 py-1.5 text-sm uppercase rounded ${exportSettings.format === fmt ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

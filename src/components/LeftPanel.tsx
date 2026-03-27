
import { useEditorStore } from '../store/useEditorStore';

const TEMPLATES = [
  { id: 'motivation', name: 'Motivation', color: 'bg-brand-purple' },
  { id: 'guru', name: 'Guru', color: 'bg-brand-purple' },
  { id: 'beast', name: 'Beast', color: 'bg-brand-cyan' },
  { id: 'minimal', name: 'Minimal', color: 'bg-zinc-500' },
  { id: 'hook', name: 'Hook', color: 'bg-red-500' },
  { id: 'ai', name: 'AI Gen', color: 'bg-blue-500' },
  { id: 'story', name: 'Story', color: 'bg-yellow-500' },
];

export default function LeftPanel() {
  const { templateId, setTemplateId } = useEditorStore();

  return (
    <aside className="w-64 bg-zinc-950 flex flex-col shrink-0">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Templates</h2>
        <div className="flex flex-col gap-2">
          {TEMPLATES.map(t => (
            <button 
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={`p-3 rounded-lg flex items-center gap-3 text-left transition-all ${templateId === t.id ? 'bg-zinc-800 border-zinc-700 border' : 'bg-transparent hover:bg-zinc-900 border border-transparent'}`}
            >
              <div className={`w-3 h-3 rounded-full ${t.color}`} />
              <span className="font-medium text-sm">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export interface Template {
  id: string;
  name: string;
  fontFamily: string;
  fontFamilyBody: string;
  baseColor: string;
  highlightColor: string;
  backgroundColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  position: 'center' | 'bottom' | 'top';
  animationType: 'zoom' | 'punch' | 'bounce' | 'fade' | 'pop';
}

export const TEMPLATES: Record<string, Template> = {
  viral: {
    id: 'viral', name: 'Viral Bold', fontFamily: 'Syne', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#FFD93D', backgroundColor: '#0B0B0F',
    strokeColor: '#000000', strokeWidth: 8,
    position: 'center', animationType: 'pop'
  },
  motivation: {
    id: 'motivation', name: 'Motivation', fontFamily: 'Syne', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#7B5EFF', backgroundColor: '#000000',
    position: 'center', animationType: 'zoom'
  },
  guru: {
    id: 'guru', name: 'Guru', fontFamily: 'DM Sans', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#FF3CAC', backgroundColor: '#000000',
    position: 'bottom', animationType: 'pop'
  },
  beast: {
    id: 'beast', name: 'Beast', fontFamily: 'Syne', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#00F5D4', backgroundColor: '#000000',
    position: 'center', animationType: 'punch'
  },
  minimal: {
    id: 'minimal', name: 'Minimal', fontFamily: 'DM Sans', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#FFFFFF', backgroundColor: '#111111',
    position: 'center', animationType: 'fade'
  },
  hook: {
    id: 'hook', name: 'Hook', fontFamily: 'Syne', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#FF0000', backgroundColor: '#000000',
    position: 'top', animationType: 'bounce'
  },
  ai: {
    id: 'ai', name: 'AI Gen', fontFamily: 'Syne', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#3B82F6', backgroundColor: '#000000',
    position: 'center', animationType: 'punch'
  },
  story: {
    id: 'story', name: 'Story', fontFamily: 'DM Sans', fontFamilyBody: 'DM Sans',
    baseColor: '#FFFFFF', highlightColor: '#EAB308', backgroundColor: '#000000',
    position: 'center', animationType: 'fade'
  }
};

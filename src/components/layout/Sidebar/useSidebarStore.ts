import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  activeItemId: string;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setActiveItemId: (id: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  activeItemId: 'vista-principal',
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  setActiveItemId: (id) => set({ activeItemId: id }),
}));

import { create } from 'zustand';

interface TeamState {
  selectedTeamId: number | null;
  setSelectedTeamId: (teamId: number | null) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  selectedTeamId: null,
  setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId }),
}));

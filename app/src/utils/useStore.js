import { create } from 'zustand';

// Создаем хранилище
const useStore = create((set) => ({
  page: 'home',
  setPage: (page) => set({ page }),

  dayzTab: 'servers',
  setDayzTab: (dayzTab) => set({ dayzTab }),

  dayzServers: [],
  setDayzServers: (dayzServers) => set({ dayzServers }),

  dayzSelectedServer: null,
  setDayzSelectedServer: (dayzSelectedServer) => set({ dayzSelectedServer }),

  dayzPingMap: {},
  setDayzPingMap: (dayzPingMap) => set({ dayzPingMap }),
}));

export default useStore;
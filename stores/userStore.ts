import { create } from 'zustand';

const useUserStore = create((set) => ({
    loggedInUser: {},
    setUser: (user: any) => set({ loggedInUser: user }),
}));

export default useUserStore;

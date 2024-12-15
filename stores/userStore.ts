import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
    loggedInUser: any
    isLoggedIn: boolean
    setUser: (user: any) => void
    setIsLoggedIn: (loggedIn: boolean) => void
}

const useUserStore = create<Store>()(
    persist(
        (set) => ({
            loggedInUser: {},
            isLoggedIn: false,
            setUser: (user: any) => set({ loggedInUser: user }),
            setIsLoggedIn: (loggedIn: boolean) => set({ isLoggedIn: loggedIn }),
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
        }
    )
);

export default useUserStore;

import { create } from 'zustand';

const useGameStore = create((set) => ({
  diceValue: 1,
  rolling: false,

  rollDice: () => {
    set({ rolling: true });

    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      set({ diceValue: value, rolling: false });
    }, 2000);
  },
}));

export default useGameStore;

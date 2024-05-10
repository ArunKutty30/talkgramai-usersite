import { create } from 'zustand';

type State = {
  activeId: string | null;
  speechSynthesisUtterance: SpeechSynthesisUtterance | null;
  isPaused: boolean;
};
type Action = {
  setActiveId: (id: string) => void;
  setSpeechSynthesisUtterance: (utterance: SpeechSynthesisUtterance | null) => void;
  startSpeech: (id: string, description: string) => void;
  stopSpeech: () => void;
  setIsPaused: (isPaused: boolean) => void;
  pauseResumeSpeech: () => void;
};

const useSpeechStore = create<State & Action>((set, get) => ({
  activeId: null,
  speechSynthesisUtterance: null,
  isPaused: false,

  setActiveId: (id) => set({ activeId: id }),
  setSpeechSynthesisUtterance: (utterance) => set({ speechSynthesisUtterance: utterance }),
  setIsPaused: (isPaused) => set({ isPaused }),

  startSpeech: async (id, description) => {
    const { stopSpeech, setActiveId, setSpeechSynthesisUtterance, setIsPaused } = get();
    await stopSpeech(); // Make sure to await stopping
    setTimeout(() => {
      // Delay start to ensure it's really stopped
      const utterance = new SpeechSynthesisUtterance(description);
      utterance.onend = () =>
        set({ speechSynthesisUtterance: null, activeId: null, isPaused: false });
      window.speechSynthesis.speak(utterance);
      setActiveId(id);
      setSpeechSynthesisUtterance(utterance);
      setIsPaused(false);
    }, 100); // A slight delay to ensure cleanup has completed
  },

  stopSpeech: () => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      set({ speechSynthesisUtterance: null, activeId: null, isPaused: false });
      setTimeout(resolve, 50); // Give some time to ensure speech is stopped
    });
  },

  pauseResumeSpeech: () => {
    const { speechSynthesisUtterance, isPaused, setIsPaused } = get();
    if (speechSynthesisUtterance) {
      if (isPaused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
      setIsPaused(!isPaused);
    }
  },
}));

export default useSpeechStore;

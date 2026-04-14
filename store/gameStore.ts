import { create } from 'zustand';
import { Question, wordRaceQuestions } from '@/constants/mockData';

export type CarState = 'normal' | 'boosting' | 'slowing' | 'turbo';

interface GameState {
  // Session Stats
  score: number;
  coins: number;
  streak: number;
  highestStreak: number;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  
  // Progress
  currentQuestionIndex: number;
  questions: Question[];
  isSessionActive: boolean;
  
  // Game Logic State
  carState: CarState;
  isAnswerLocked: boolean;
  
  // Actions
  startGame: (questions: Question[]) => void;
  submitAnswer: (answer: string) => { isCorrect: boolean; correctAnswer: string };
  nextQuestion: () => void;
  endGame: () => void;
  setCarState: (state: CarState) => void;
}

export const useGameStore = create<GameState>((set: any, get: any) => ({
  score: 0,
  coins: 0,
  streak: 0,
  highestStreak: 0,
  accuracy: 0,
  correctCount: 0,
  wrongCount: 0,
  currentQuestionIndex: 0,
  questions: [],
  isSessionActive: false,
  carState: 'normal',
  isAnswerLocked: false,

  startGame: (questions: Question[]) => set({
    questions,
    currentQuestionIndex: 0,
    score: 0,
    coins: 0,
    streak: 0,
    highestStreak: 0,
    correctCount: 0,
    wrongCount: 0,
    isSessionActive: true,
    carState: 'normal',
    isAnswerLocked: false,
  }),

  submitAnswer: (answer: string) => {
    const { questions, currentQuestionIndex, streak, score, coins, correctCount, wrongCount, highestStreak } = get();
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = answer === currentQ.correctAnswer;
    
    const newStreak = isCorrect ? streak + 1 : 0;
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const newWrongCount = isCorrect ? wrongCount : wrongCount + 1;
    
    // Calculate coins based on speed and streak
    const baseCoins = 10;
    const multiplier = newStreak >= 3 ? 2 : 1;
    const addedCoins = isCorrect ? baseCoins * multiplier : 0;
    
    set({
      streak: newStreak,
      highestStreak: Math.max(highestStreak, newStreak),
      score: isCorrect ? score + 100 : score,
      coins: coins + addedCoins,
      correctCount: newCorrectCount,
      wrongCount: newWrongCount,
      carState: isCorrect ? (newStreak >= 3 ? 'turbo' : 'boosting') : 'slowing',
      isAnswerLocked: true,
    });

    return { isCorrect, correctAnswer: currentQ.correctAnswer };
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ 
        currentQuestionIndex: currentQuestionIndex + 1,
        isAnswerLocked: false,
        carState: get().streak >= 3 ? 'turbo' : 'normal'
      });
    } else {
      set({ isSessionActive: false });
    }
  },

  setCarState: (state: CarState) => set({ carState: state }),
  
  endGame: () => set({ isSessionActive: false }),
}));

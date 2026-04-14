export const mockChild = {
  id: "child-1",
  name: "Arjun",
  age: 7,
  grade: "Grade 2",
  avatar: "user",
  rewardPoints: 2450,
  levelBadges: ["Starter", "Learner", "Explorer"],
  favoriteGames: ["Math Quest", "Word Builder", "Logic Puzzle"],
};

export const mockParent = {
  id: "parent-1",
  name: "Raj Kumar",
  email: "raj@example.com",
  children: [mockChild],
  pin: "1234",
};

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

export const wordRaceQuestions: Question[] = [
  {
    id: 'wr_001',
    question: 'What does RAPID mean?',
    options: ['Very Fast', 'Very Slow', 'Huge'],
    correctAnswer: 'Very Fast',
    hint: 'Think about a fast car...',
  },
  {
    id: 'wr_002',
    question: 'A synonym for GIGANTIC is:',
    options: ['Small', 'Huge', 'Tiny'],
    correctAnswer: 'Huge',
    hint: 'Think of an elephant...',
  },
  {
    id: 'wr_003',
    question: 'Which word means very SHY?',
    options: ['Timid', 'Bold', 'Loud'],
    correctAnswer: 'Timid',
    hint: 'Like a small mouse...',
  },
  {
    id: 'wr_004',
    question: 'What is another word for SMART?',
    options: ['Dull', 'Intelligent', 'Sleepy'],
    correctAnswer: 'Intelligent',
    hint: 'Someone who knows a lot...',
  },
  {
    id: 'wr_005',
    question: 'Which means the OPPOSITE of Brave?',
    options: ['Strong', 'Fearless', 'Cowardly'],
    correctAnswer: 'Cowardly',
    hint: 'Lacks courage...',
  },
];

export const gameLibrary = [
  {
    id: "math-quest",
    title: "Math Quest",
    category: "Mathematics",
    difficulty: "Medium",
    description: "Solve math puzzles and earn points",
    icon: "calculator",
    color: "#FF6B35",
    points: 100,
  },
  {
    id: "word-builder",
    title: "Word Builder",
    category: "Language",
    difficulty: "Easy",
    description: "Build words and expand vocabulary",
    icon: "book-open",
    color: "#004E89",
    points: 75,
  },
  {
    id: "logic-puzzle",
    title: "Logic Puzzle",
    category: "Reasoning",
    difficulty: "Hard",
    description: "Solve challenging logic problems",
    icon: "puzzle",
    color: "#F7B801",
    points: 150,
  },
  {
    id: "memory-match",
    title: "Memory Match",
    category: "Memory",
    difficulty: "Easy",
    description: "Test your memory with matching games",
    icon: "gamepad-2",
    color: "#00B377",
    points: 50,
  },
  {
    id: "science-explorer",
    title: "Science Explorer",
    category: "Science",
    difficulty: "Medium",
    description: "Discover facts about the natural world",
    icon: "microscope",
    color: "#E63946",
    points: 120,
  },
  {
    id: "art-studio",
    title: "Art Studio",
    category: "Creativity",
    difficulty: "Easy",
    description: "Create beautiful digital art",
    icon: "palette",
    color: "#9D4EDD",
    points: 60,
  },
];

export const games = gameLibrary;

export const rewardShop = [
  {
    id: "reward-1",
    name: "Virtual Badge",
    description: "Unlock a new achievement badge",
    cost: 500,
    icon: "medal",
  },
  {
    id: "reward-2",
    name: "Extra Lives",
    description: "Get 5 bonus lives in games",
    cost: 300,
    icon: "heart",
  },
  {
    id: "reward-3",
    name: "Theme Pack",
    description: "Unlock new app themes",
    cost: 800,
    icon: "palette",
  },
  {
    id: "reward-4",
    name: "Power Booster",
    description: "10x points for next game",
    cost: 600,
    icon: "zap",
  },
];

export const rewards = rewardShop;

export const weeklyProgress = [
  { day: "Mon", points: 120, gamesPlayed: 2 },
  { day: "Tue", points: 150, gamesPlayed: 3 },
  { day: "Wed", points: 100, gamesPlayed: 1 },
  { day: "Thu", points: 200, gamesPlayed: 4 },
  { day: "Fri", points: 180, gamesPlayed: 3 },
  { day: "Sat", points: 300, gamesPlayed: 5 },
  { day: "Sun", points: 250, gamesPlayed: 4 },
];

export const mockActivity = [
  { id: "act-1", type: "Math Quest", time: "2 hours ago", points: 150 },
  { id: "act-2", type: "Word Builder", time: "4 hours ago", points: 75 },
  { id: "act-3", type: "Logic Puzzle", time: "Yesterday", points: 200 },
];

export const achievements = [
  {
    id: "ach-1",
    name: "First Step",
    description: "Complete your first game",
    icon: "award",
    unlocked: true,
  },
  {
    id: "ach-2",
    name: "Game Master",
    description: "Complete 10 games",
    icon: "star",
    unlocked: true,
  },
  {
    id: "ach-3",
    name: "Math Wizard",
    description: "Score 100% in Math Quest",
    icon: "zap",
    unlocked: false,
  },
  {
    id: "ach-4",
    name: "Word Pro",
    description: "Create 50 words in Word Builder",
    icon: "book",
    unlocked: false,
  },
];

export const parentInsights = {
  childName: "Arjun",
  totalPoints: 1300,
  gamesPlayed: 22,
  averageSessionDuration: "45 min",
  favoriteSubject: "Mathematics",
  learningTrend: "improving",
  weeklyAveragePoints: 186,
  completionRate: 85,
};

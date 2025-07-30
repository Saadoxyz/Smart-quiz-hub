// Mock axios for demo - replace with actual axios import when using with backend
export const mockAxios = {
  get: async (url) => {
    if (url === 'http://localhost:8080/api/questions') {
      return { data: sampleQuestions };
    }
    if (url === 'http://localhost:8080/api/users') {
      return { data: sampleUsers };
    }
    return { data: [] };
  },
  post: async (url, data) => {
    console.log('POST to:', url, data);
    return { data: { ...data, id: Date.now() } };
  },
  delete: async (url) => {
    console.log('DELETE:', url);
    return { data: {} };
  }
};

// Sample users for demo (replace with actual backend calls)
export const sampleUsers = [
  { id: 1, name: 'admin', email: 'admin@quiz.com', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, name: 'John Student', email: 'john@student.com', username: 'student1', password: 'student123', role: 'student' },
  { id: 3, name: 'Jane Student', email: 'jane@student.com', username: 'student2', password: 'pass123', role: 'student' }
];

// Sample questions data (50 questions)
export const sampleQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    optionA: "London",
    optionB: "Berlin",
    optionC: "Paris",
    optionD: "Madrid",
    correctAnswer: "Paris"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    optionA: "Venus",
    optionB: "Mars",
    optionC: "Jupiter",
    optionD: "Saturn",
    correctAnswer: "Mars"
  },
  {
    id: 3,
    question: "What is 15 + 27?",
    optionA: "41",
    optionB: "42",
    optionC: "43",
    optionD: "44",
    correctAnswer: "42"
  },
  {
    id: 4,
    question: "Who wrote 'Romeo and Juliet'?",
    optionA: "Charles Dickens",
    optionB: "William Shakespeare",
    optionC: "Jane Austen",
    optionD: "Mark Twain",
    correctAnswer: "William Shakespeare"
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    optionA: "Atlantic Ocean",
    optionB: "Indian Ocean",
    optionC: "Arctic Ocean",
    optionD: "Pacific Ocean",
    correctAnswer: "Pacific Ocean"
  },
  {
    id: 6,
    question: "Which gas makes up most of Earth's atmosphere?",
    optionA: "Oxygen",
    optionB: "Carbon Dioxide",
    optionC: "Nitrogen",
    optionD: "Hydrogen",
    correctAnswer: "Nitrogen"
  },
  {
    id: 7,
    question: "What is the square root of 64?",
    optionA: "6",
    optionB: "7",
    optionC: "8",
    optionD: "9",
    correctAnswer: "8"
  },
  {
    id: 8,
    question: "Which country is famous for the Great Wall?",
    optionA: "Japan",
    optionB: "China",
    optionC: "India",
    optionD: "Korea",
    correctAnswer: "China"
  },
  {
    id: 9,
    question: "What is the chemical symbol for gold?",
    optionA: "Go",
    optionB: "Gd",
    optionC: "Au",
    optionD: "Ag",
    correctAnswer: "Au"
  },
  {
    id: 10,
    question: "How many continents are there?",
    optionA: "5",
    optionB: "6",
    optionC: "7",
    optionD: "8",
    correctAnswer: "7"
  },
  {
    id: 11,
    question: "What is the fastest land animal?",
    optionA: "Lion",
    optionB: "Cheetah",
    optionC: "Horse",
    optionD: "Leopard",
    correctAnswer: "Cheetah"
  },
  {
    id: 12,
    question: "Which vitamin is produced when skin is exposed to sunlight?",
    optionA: "Vitamin A",
    optionB: "Vitamin B",
    optionC: "Vitamin C",
    optionD: "Vitamin D",
    correctAnswer: "Vitamin D"
  },
  {
    id: 13,
    question: "What is the smallest prime number?",
    optionA: "0",
    optionB: "1",
    optionC: "2",
    optionD: "3",
    correctAnswer: "2"
  },
  {
    id: 14,
    question: "Which instrument measures earthquakes?",
    optionA: "Thermometer",
    optionB: "Barometer",
    optionC: "Seismometer",
    optionD: "Hygrometer",
    correctAnswer: "Seismometer"
  },
  {
    id: 15,
    question: "What is the currency of Japan?",
    optionA: "Yuan",
    optionB: "Won",
    optionC: "Yen",
    optionD: "Rupee",
    correctAnswer: "Yen"
  },
  {
    id: 16,
    question: "How many sides does a hexagon have?",
    optionA: "5",
    optionB: "6",
    optionC: "7",
    optionD: "8",
    correctAnswer: "6"
  },
  {
    id: 17,
    question: "Which organ in the human body produces insulin?",
    optionA: "Liver",
    optionB: "Kidney",
    optionC: "Pancreas",
    optionD: "Heart",
    correctAnswer: "Pancreas"
  },
  {
    id: 18,
    question: "What is the hardest natural substance?",
    optionA: "Gold",
    optionB: "Iron",
    optionC: "Diamond",
    optionD: "Silver",
    correctAnswer: "Diamond"
  },
  {
    id: 19,
    question: "Which planet is closest to the Sun?",
    optionA: "Venus",
    optionB: "Earth",
    optionC: "Mercury",
    optionD: "Mars",
    correctAnswer: "Mercury"
  },
  {
    id: 20,
    question: "What is 12 × 8?",
    optionA: "94",
    optionB: "95",
    optionC: "96",
    optionD: "97",
    correctAnswer: "96"
  },
  {
    id: 21,
    question: "Which sea is the saltiest?",
    optionA: "Mediterranean Sea",
    optionB: "Dead Sea",
    optionC: "Red Sea",
    optionD: "Black Sea",
    correctAnswer: "Dead Sea"
  },
  {
    id: 22,
    question: "What does 'www' stand for?",
    optionA: "World Wide Web",
    optionB: "World Wide Width",
    optionC: "World Wide Wire",
    optionD: "World Wide Window",
    correctAnswer: "World Wide Web"
  },
  {
    id: 23,
    question: "Which blood type is known as the universal donor?",
    optionA: "A",
    optionB: "B",
    optionC: "AB",
    optionD: "O",
    correctAnswer: "O"
  },
  {
    id: 24,
    question: "What is the largest mammal?",
    optionA: "Elephant",
    optionB: "Blue Whale",
    optionC: "Giraffe",
    optionD: "Hippopotamus",
    correctAnswer: "Blue Whale"
  },
  {
    id: 25,
    question: "How many bones are in an adult human body?",
    optionA: "204",
    optionB: "206",
    optionC: "208",
    optionD: "210",
    correctAnswer: "206"
  },
  {
    id: 26,
    question: "What is the chemical formula for water?",
    optionA: "CO2",
    optionB: "H2O",
    optionC: "NaCl",
    optionD: "CH4",
    correctAnswer: "H2O"
  },
  {
    id: 27,
    question: "Which country has the most time zones?",
    optionA: "Russia",
    optionB: "USA",
    optionC: "China",
    optionD: "France",
    correctAnswer: "France"
  },
  {
    id: 28,
    question: "What is the longest river in the world?",
    optionA: "Amazon River",
    optionB: "Nile River",
    optionC: "Mississippi River",
    optionD: "Yangtze River",
    correctAnswer: "Nile River"
  },
  {
    id: 29,
    question: "Which element has the atomic number 1?",
    optionA: "Helium",
    optionB: "Hydrogen",
    optionC: "Lithium",
    optionD: "Carbon",
    correctAnswer: "Hydrogen"
  },
  {
    id: 30,
    question: "What is 144 ÷ 12?",
    optionA: "11",
    optionB: "12",
    optionC: "13",
    optionD: "14",
    correctAnswer: "12"
  },
  {
    id: 31,
    question: "Which mountain range contains Mount Everest?",
    optionA: "Alps",
    optionB: "Andes",
    optionC: "Himalayas",
    optionD: "Rockies",
    correctAnswer: "Himalayas"
  },
  {
    id: 32,
    question: "What is the main ingredient in guacamole?",
    optionA: "Tomato",
    optionB: "Avocado",
    optionC: "Onion",
    optionD: "Pepper",
    correctAnswer: "Avocado"
  },
  {
    id: 33,
    question: "Which programming language is known for web development?",
    optionA: "C++",
    optionB: "Java",
    optionC: "JavaScript",
    optionD: "Python",
    correctAnswer: "JavaScript"
  },
  {
    id: 34,
    question: "How many minutes are in a full day?",
    optionA: "1440",
    optionB: "1400",
    optionC: "1480",
    optionD: "1500",
    correctAnswer: "1440"
  },
  {
    id: 35,
    question: "What is the capital of Australia?",
    optionA: "Sydney",
    optionB: "Melbourne",
    optionC: "Canberra",
    optionD: "Perth",
    correctAnswer: "Canberra"
  },
  {
    id: 36,
    question: "Which organ is responsible for pumping blood?",
    optionA: "Liver",
    optionB: "Lungs",
    optionC: "Heart",
    optionD: "Kidney",
    correctAnswer: "Heart"
  },
  {
    id: 37,
    question: "What is the freezing point of water in Celsius?",
    optionA: "-1°C",
    optionB: "0°C",
    optionC: "1°C",
    optionD: "32°C",
    correctAnswer: "0°C"
  },
  {
    id: 38,
    question: "Which sport is played at Wimbledon?",
    optionA: "Football",
    optionB: "Cricket",
    optionC: "Tennis",
    optionD: "Golf",
    correctAnswer: "Tennis"
  },
  {
    id: 39,
    question: "How many strings does a standard guitar have?",
    optionA: "4",
    optionB: "5",
    optionC: "6",
    optionD: "7",
    correctAnswer: "6"
  },
  {
    id: 40,
    question: "What is the largest planet in our solar system?",
    optionA: "Saturn",
    optionB: "Jupiter",
    optionC: "Neptune",
    optionD: "Uranus",
    correctAnswer: "Jupiter"
  },
  {
    id: 41,
    question: "Which metal is liquid at room temperature?",
    optionA: "Lead",
    optionB: "Mercury",
    optionC: "Zinc",
    optionD: "Copper",
    correctAnswer: "Mercury"
  },
  {
    id: 42,
    question: "What is the square of 9?",
    optionA: "18",
    optionB: "72",
    optionC: "81",
    optionD: "90",
    correctAnswer: "81"
  },
  {
    id: 43,
    question: "Which continent is known as the 'Dark Continent'?",
    optionA: "Asia",
    optionB: "Africa",
    optionC: "South America",
    optionD: "Australia",
    correctAnswer: "Africa"
  },
  {
    id: 44,
    question: "What does 'AI' stand for in technology?",
    optionA: "Automated Intelligence",
    optionB: "Artificial Intelligence",
    optionC: "Advanced Intelligence",
    optionD: "Applied Intelligence",
    correctAnswer: "Artificial Intelligence"
  },
  {
    id: 45,
    question: "How many legs does a spider have?",
    optionA: "6",
    optionB: "7",
    optionC: "8",
    optionD: "10",
    correctAnswer: "8"
  },
  {
    id: 46,
    question: "What is the main gas in the air we breathe?",
    optionA: "Oxygen",
    optionB: "Carbon Dioxide",
    optionC: "Nitrogen",
    optionD: "Hydrogen",
    correctAnswer: "Nitrogen"
  },
  {
    id: 47,
    question: "Which country invented pizza?",
    optionA: "France",
    optionB: "Italy",
    optionC: "Spain",
    optionD: "Greece",
    correctAnswer: "Italy"
  },
  {
    id: 48,
    question: "What is 25% of 200?",
    optionA: "25",
    optionB: "50",
    optionC: "75",
    optionD: "100",
    correctAnswer: "50"
  },
  {
    id: 49,
    question: "Which ocean is between Europe and America?",
    optionA: "Pacific Ocean",
    optionB: "Indian Ocean",
    optionC: "Atlantic Ocean",
    optionD: "Arctic Ocean",
    correctAnswer: "Atlantic Ocean"
  },
  {
    id: 50,
    question: "What is the most abundant element in the universe?",
    optionA: "Oxygen",
    optionB: "Carbon",
    optionC: "Helium",
    optionD: "Hydrogen",
    correctAnswer: "Hydrogen"
  }
];
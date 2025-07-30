package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize demo users if they don't exist
        if (userRepository.count() == 0) {
            initializeUsers();
        }

        // Initialize demo questions if they don't exist
        if (questionRepository.count() == 0) {
            initializeQuestions();
        }
    }

    private void initializeUsers() {
        // Create admin user
        User admin = new User("admin", "admin123", "Administrator", "admin@smartquiz.com", User.Role.ADMIN);
        userRepository.save(admin);

        // Create demo students
        User student1 = new User("student1", "student123", "John Doe", "john@example.com", User.Role.STUDENT);
        User student2 = new User("student2", "pass123", "Jane Smith", "jane@example.com", User.Role.STUDENT);
        
        userRepository.save(student1);
        userRepository.save(student2);

        System.out.println("✅ Demo users initialized successfully!");
    }

    private void initializeQuestions() {
        String[][] questionsData = {
            {"What is the capital of France?", "London", "Berlin", "Paris", "Madrid", "Paris"},
            {"Which planet is known as the Red Planet?", "Venus", "Mars", "Jupiter", "Saturn", "Mars"},
            {"What is 2 + 2?", "3", "4", "5", "6", "4"},
            {"Who painted the Mona Lisa?", "Van Gogh", "Picasso", "Da Vinci", "Monet", "Da Vinci"},
            {"What is the largest ocean on Earth?", "Atlantic", "Indian", "Arctic", "Pacific", "Pacific"},
            {"In which year did World War II end?", "1944", "1945", "1946", "1947", "1945"},
            {"What is the chemical symbol for gold?", "Go", "Gd", "Au", "Ag", "Au"},
            {"Which country is home to Machu Picchu?", "Chile", "Peru", "Bolivia", "Ecuador", "Peru"},
            {"What is the smallest country in the world?", "Monaco", "Vatican City", "Nauru", "San Marino", "Vatican City"},
            {"Who wrote 'Romeo and Juliet'?", "Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain", "William Shakespeare"},
            {"What is the hardest natural substance on Earth?", "Gold", "Iron", "Diamond", "Platinum", "Diamond"},
            {"Which gas makes up most of the Earth's atmosphere?", "Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen", "Nitrogen"},
            {"What is the currency of Japan?", "Yuan", "Won", "Yen", "Rupiah", "Yen"},
            {"Which animal is known as the 'King of the Jungle'?", "Tiger", "Elephant", "Lion", "Leopard", "Lion"},
            {"What is the fastest land animal?", "Lion", "Horse", "Cheetah", "Antelope", "Cheetah"},
            {"In which continent is the Sahara Desert?", "Asia", "Africa", "Australia", "South America", "Africa"},
            {"What is the main ingredient in guacamole?", "Tomato", "Avocado", "Onion", "Pepper", "Avocado"},
            {"Which programming language is known for its use in web development?", "C++", "Java", "JavaScript", "Python", "JavaScript"},
            {"What does 'WWW' stand for?", "World Wide Web", "World War Won", "We Will Win", "World Water Works", "World Wide Web"},
            {"Which vitamin is produced when skin is exposed to sunlight?", "Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D", "Vitamin D"},
            {"What is the largest mammal in the world?", "Elephant", "Blue Whale", "Giraffe", "Hippopotamus", "Blue Whale"},
            {"Which country gifted the Statue of Liberty to the USA?", "Britain", "Spain", "France", "Italy", "France"},
            {"What is the boiling point of water in Celsius?", "90°C", "95°C", "100°C", "105°C", "100°C"},
            {"Which sport is known as 'the beautiful game'?", "Basketball", "Tennis", "Football/Soccer", "Cricket", "Football/Soccer"},
            {"What is the largest organ in the human body?", "Brain", "Liver", "Lungs", "Skin", "Skin"},
            {"Which metal is liquid at room temperature?", "Lead", "Mercury", "Tin", "Zinc", "Mercury"},
            {"What is the study of earthquakes called?", "Geology", "Seismology", "Meteorology", "Archaeology", "Seismology"},
            {"Which river is the longest in the world?", "Amazon", "Nile", "Mississippi", "Yangtze", "Nile"},
            {"What is the smallest unit of matter?", "Molecule", "Atom", "Electron", "Proton", "Atom"},
            {"Which country has the most natural lakes?", "Russia", "Canada", "Finland", "Sweden", "Canada"},
            {"What does 'HTTP' stand for?", "HyperText Transfer Protocol", "High Tech Transfer Protocol", "Home Tool Transfer Protocol", "Host Transfer Text Protocol", "HyperText Transfer Protocol"},
            {"Which planet is closest to the Sun?", "Venus", "Mercury", "Earth", "Mars", "Mercury"},
            {"What is the capital of Australia?", "Sydney", "Melbourne", "Canberra", "Perth", "Canberra"},
            {"Which blood type is known as the universal donor?", "A+", "B+", "AB+", "O-", "O-"},
            {"What is the most spoken language in the world?", "English", "Spanish", "Mandarin Chinese", "Hindi", "Mandarin Chinese"},
            {"Which instrument measures atmospheric pressure?", "Thermometer", "Barometer", "Hygrometer", "Anemometer", "Barometer"},
            {"What is the largest bird in the world?", "Eagle", "Ostrich", "Albatross", "Condor", "Ostrich"},
            {"Which acid is found in vinegar?", "Citric acid", "Acetic acid", "Sulfuric acid", "Nitric acid", "Acetic acid"},
            {"What is the most abundant gas in the universe?", "Oxygen", "Carbon Dioxide", "Helium", "Hydrogen", "Hydrogen"},
            {"Which country is known as the Land of the Rising Sun?", "China", "South Korea", "Japan", "Thailand", "Japan"},
            {"What is the speed of light in vacuum?", "300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s", "300,000 km/s"},
            {"Which organ produces insulin?", "Liver", "Kidney", "Pancreas", "Stomach", "Pancreas"},
            {"What is the capital of Canada?", "Toronto", "Vancouver", "Montreal", "Ottawa", "Ottawa"},
            {"Which element has the atomic number 1?", "Helium", "Hydrogen", "Lithium", "Carbon", "Hydrogen"},
            {"What is the largest desert in the world?", "Sahara", "Gobi", "Antarctica", "Arabian", "Antarctica"},
            {"Which scientist developed the theory of relativity?", "Newton", "Darwin", "Einstein", "Tesla", "Einstein"},
            {"What is the main component of the Sun?", "Oxygen", "Carbon", "Hydrogen", "Helium", "Hydrogen"},
            {"Which country hosted the 2016 Summer Olympics?", "China", "Brazil", "Russia", "Japan", "Brazil"},
            {"What is the chemical formula for water?", "H2O", "CO2", "NaCl", "CH4", "H2O"},
            {"Which mountain range contains Mount Everest?", "Andes", "Himalayas", "Rocky Mountains", "Alps", "Himalayas"}
        };

        for (String[] qData : questionsData) {
            Question question = new Question();
            question.setQuestion(qData[0]);
            question.setOptionA(qData[1]);
            question.setOptionB(qData[2]);
            question.setOptionC(qData[3]);
            question.setOptionD(qData[4]);
            question.setCorrectAnswer(qData[5]);
            questionRepository.save(question);
        }

        System.out.println("✅ " + questionsData.length + " demo questions initialized successfully!");
    }
}
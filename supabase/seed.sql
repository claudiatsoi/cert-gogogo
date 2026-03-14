-- Seed Data for Go-Go-Go Competition Platform

-- 1. Insert a Demo Competition
INSERT INTO competitions (title, description, is_active)
VALUES 
('Math & Science Challenge 2026', 'A demo competition to test your knowledge in Mathematics and General Science.', true);

-- 2. Insert Questions for the Demo Competition
-- We use a subquery to get the ID of the competition we just created.
WITH new_comp AS (
    SELECT id FROM competitions WHERE title = 'Math & Science Challenge 2026' LIMIT 1
)
INSERT INTO questions (competition_id, type, question_text, correct_answer, distractor_1, distractor_2, distractor_3)
SELECT 
    id,
    'science',
    'What is the chemical symbol for Gold?',
    'Au',
    'Ag',
    'Fe',
    'Cu'
FROM new_comp
UNION ALL
SELECT 
    id,
    'science',
    'Which planet is known as the Red Planet?',
    'Mars',
    'Venus',
    'Jupiter',
    'Saturn'
FROM new_comp
UNION ALL
SELECT 
    id,
    'word',
    'Which word is a synonym for "Happy"?',
    'Joyful',
    'Sad',
    'Angry',
    'Tired'
FROM new_comp;
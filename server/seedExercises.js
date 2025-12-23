const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fittracker';

const exercises = [
    // Cardio Exercises
    {
        name: 'Running',
        description: 'High-impact cardiovascular exercise that improves endurance and burns calories.',
        category: 'cardio',
        muscleGroups: ['legs', 'core', 'full-body'],
        equipment: 'none',
        difficulty: 'beginner',
        duration: 30,
        caloriesBurned: 10,
        instructions: [
            'Start with a 5-minute warm-up walk',
            'Begin running at a comfortable pace',
            'Maintain steady breathing',
            'Land on midfoot, not heel',
            'Keep shoulders relaxed and arms at 90 degrees',
            'Cool down with 5-minute walk'
        ],
        tips: ['Start slow and gradually increase pace', 'Wear proper running shoes', 'Stay hydrated'],
        tags: ['outdoor', 'home-friendly', 'high-intensity'],
        sets: 0,
        reps: '20-30 minutes',
        restTime: 0,
        targetGoal: ['weight-loss', 'endurance', 'general-fitness']
    },
    {
        name: 'Cycling',
        description: 'Low-impact cardio exercise great for building leg strength and cardiovascular health.',
        category: 'cardio',
        muscleGroups: ['legs', 'glutes'],
        equipment: 'other',
        difficulty: 'beginner',
        duration: 30,
        caloriesBurned: 8,
        instructions: [
            'Adjust seat height so knee is slightly bent at bottom of pedal stroke',
            'Start pedaling at moderate pace',
            'Maintain consistent cadence',
            'Keep back straight and core engaged',
            'Gradually increase resistance'
        ],
        tips: ['Wear a helmet if cycling outdoors', 'Keep knees aligned with feet', 'Stay hydrated'],
        tags: ['outdoor', 'low-impact', 'endurance'],
        sets: 0,
        reps: '20-45 minutes',
        restTime: 0,
        targetGoal: ['weight-loss', 'endurance', 'general-fitness']
    },
    {
        name: 'Jump Rope',
        description: 'High-intensity cardio exercise that improves coordination and burns calories quickly.',
        category: 'cardio',
        muscleGroups: ['legs', 'calves', 'shoulders', 'core'],
        equipment: 'other',
        difficulty: 'intermediate',
        duration: 15,
        caloriesBurned: 12,
        instructions: [
            'Hold rope handles at hip level',
            'Jump on balls of feet, not flat',
            'Keep jumps small and quick',
            'Rotate wrists, not arms',
            'Land softly to reduce impact'
        ],
        tips: ['Start with 30-second intervals', 'Use proper length rope', 'Wear supportive shoes'],
        tags: ['home-friendly', 'high-intensity', 'portable'],
        sets: 0,
        reps: '30 seconds - 2 minutes',
        restTime: 30,
        targetGoal: ['weight-loss', 'endurance', 'coordination']
    },
    {
        name: 'Burpees',
        description: 'Full-body exercise combining squat, plank, and jump for maximum calorie burn.',
        category: 'hiit',
        muscleGroups: ['full-body', 'legs', 'chest', 'core'],
        equipment: 'bodyweight',
        difficulty: 'intermediate',
        duration: 0,
        caloriesBurned: 10,
        instructions: [
            'Start in standing position',
            'Squat down and place hands on floor',
            'Jump feet back into plank position',
            'Do a push-up (optional)',
            'Jump feet back to squat position',
            'Explosively jump up with arms overhead'
        ],
        tips: ['Start with modified version (no push-up)', 'Maintain proper form over speed', 'Rest between sets'],
        tags: ['home-friendly', 'high-intensity', 'full-body'],
        sets: 3,
        reps: '8-15',
        restTime: 60,
        targetGoal: ['weight-loss', 'strength', 'endurance']
    },
    
    // Strength Exercises
    {
        name: 'Push-ups',
        description: 'Classic upper body exercise targeting chest, shoulders, and triceps.',
        category: 'strength',
        muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 3,
        instructions: [
            'Start in plank position, hands shoulder-width apart',
            'Lower body until chest nearly touches floor',
            'Keep body in straight line',
            'Push back up to starting position',
            'Keep core engaged throughout'
        ],
        tips: ['Start with knees on floor if needed', 'Keep elbows at 45-degree angle', 'Breathe out on push'],
        tags: ['home-friendly', 'no-equipment', 'upper-body'],
        sets: 3,
        reps: '8-15',
        restTime: 60,
        targetGoal: ['strength', 'muscle-gain', 'general-fitness']
    },
    {
        name: 'Squats',
        description: 'Fundamental lower body exercise that builds leg and glute strength.',
        category: 'strength',
        muscleGroups: ['legs', 'glutes', 'core'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 4,
        instructions: [
            'Stand with feet shoulder-width apart',
            'Lower body as if sitting in chair',
            'Keep knees behind toes',
            'Lower until thighs parallel to floor',
            'Push through heels to return to start',
            'Keep chest up and core engaged'
        ],
        tips: ['Don\'t let knees cave inward', 'Go as low as comfortable', 'Add weight for progression'],
        tags: ['home-friendly', 'no-equipment', 'lower-body'],
        sets: 3,
        reps: '12-20',
        restTime: 60,
        targetGoal: ['strength', 'muscle-gain', 'general-fitness']
    },
    {
        name: 'Pull-ups',
        description: 'Advanced upper body exercise targeting back, biceps, and shoulders.',
        category: 'strength',
        muscleGroups: ['back', 'biceps', 'shoulders'],
        equipment: 'other',
        difficulty: 'advanced',
        duration: 0,
        caloriesBurned: 5,
        instructions: [
            'Hang from bar with palms facing away',
            'Engage back muscles',
            'Pull body up until chin clears bar',
            'Lower with control',
            'Keep core tight throughout'
        ],
        tips: ['Start with assisted pull-ups or negatives', 'Use resistance bands for assistance', 'Focus on form'],
        tags: ['gym-required', 'upper-body', 'advanced'],
        sets: 3,
        reps: '5-12',
        restTime: 90,
        targetGoal: ['strength', 'muscle-gain']
    },
    {
        name: 'Deadlifts',
        description: 'Compound exercise targeting posterior chain (back, glutes, hamstrings).',
        category: 'strength',
        muscleGroups: ['back', 'glutes', 'hamstrings', 'core'],
        equipment: 'barbell',
        difficulty: 'intermediate',
        duration: 0,
        caloriesBurned: 6,
        instructions: [
            'Stand with feet hip-width apart, bar over midfoot',
            'Hinge at hips, keeping back straight',
            'Grip bar just outside legs',
            'Drive through heels to stand up',
            'Keep bar close to body',
            'Lower with control'
        ],
        tips: ['Start with light weight to learn form', 'Keep back straight, never rounded', 'Engage core'],
        tags: ['gym-required', 'full-body', 'compound'],
        sets: 3,
        reps: '5-8',
        restTime: 120,
        targetGoal: ['strength', 'muscle-gain']
    },
    {
        name: 'Lunges',
        description: 'Unilateral leg exercise improving balance and leg strength.',
        category: 'strength',
        muscleGroups: ['legs', 'glutes', 'core'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 4,
        instructions: [
            'Step forward into lunge position',
            'Lower back knee toward ground',
            'Front thigh should be parallel to floor',
            'Push through front heel to return',
            'Alternate legs'
        ],
        tips: ['Keep front knee behind toes', 'Maintain upright torso', 'Add weights for progression'],
        tags: ['home-friendly', 'no-equipment', 'lower-body'],
        sets: 3,
        reps: '10-15 per leg',
        restTime: 60,
        targetGoal: ['strength', 'muscle-gain', 'general-fitness']
    },
    {
        name: 'Plank',
        description: 'Isometric core exercise that builds stability and strength.',
        category: 'strength',
        muscleGroups: ['core', 'shoulders'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 2,
        instructions: [
            'Start in push-up position',
            'Lower to forearms',
            'Keep body in straight line',
            'Engage core and glutes',
            'Hold position',
            'Breathe normally'
        ],
        tips: ['Don\'t let hips sag or rise', 'Start with 20-30 seconds', 'Gradually increase time'],
        tags: ['home-friendly', 'no-equipment', 'core'],
        sets: 3,
        reps: '30-60 seconds',
        restTime: 30,
        targetGoal: ['strength', 'general-fitness', 'core-strength']
    },
    
    // Flexibility Exercises
    {
        name: 'Downward Dog',
        description: 'Yoga pose that stretches hamstrings, calves, and shoulders while strengthening arms.',
        category: 'yoga',
        muscleGroups: ['legs', 'shoulders', 'back'],
        equipment: 'none',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 1,
        instructions: [
            'Start on hands and knees',
            'Tuck toes and lift hips up',
            'Form inverted V shape',
            'Press hands into floor',
            'Lengthen spine',
            'Hold and breathe'
        ],
        tips: ['Bend knees if hamstrings are tight', 'Keep hands shoulder-width apart', 'Relax neck'],
        tags: ['home-friendly', 'flexibility', 'yoga'],
        sets: 0,
        reps: '30-60 seconds',
        restTime: 0,
        targetGoal: ['flexibility', 'general-fitness']
    },
    {
        name: 'Warrior Pose',
        description: 'Yoga pose that builds leg strength while improving balance and flexibility.',
        category: 'yoga',
        muscleGroups: ['legs', 'core'],
        equipment: 'none',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 2,
        instructions: [
            'Step one foot forward into lunge',
            'Turn back foot 45 degrees',
            'Bend front knee to 90 degrees',
            'Arms parallel to floor',
            'Gaze over front hand',
            'Hold and breathe'
        ],
        tips: ['Keep front knee over ankle', 'Engage core', 'Relax shoulders'],
        tags: ['home-friendly', 'flexibility', 'yoga', 'balance'],
        sets: 0,
        reps: '30-60 seconds per side',
        restTime: 0,
        targetGoal: ['flexibility', 'strength', 'balance']
    },
    {
        name: 'Child\'s Pose',
        description: 'Restorative yoga pose that stretches hips, thighs, and ankles while calming the mind.',
        category: 'yoga',
        muscleGroups: ['back', 'hips'],
        equipment: 'none',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 1,
        instructions: [
            'Kneel on floor',
            'Sit back on heels',
            'Fold forward, arms extended',
            'Rest forehead on floor',
            'Breathe deeply',
            'Hold position'
        ],
        tips: ['Widen knees if needed', 'Use as rest pose between exercises', 'Focus on breathing'],
        tags: ['home-friendly', 'flexibility', 'yoga', 'recovery'],
        sets: 0,
        reps: '1-2 minutes',
        restTime: 0,
        targetGoal: ['flexibility', 'recovery', 'stress-relief']
    },
    {
        name: 'Hamstring Stretch',
        description: 'Simple stretch to improve flexibility in the back of the legs.',
        category: 'flexibility',
        muscleGroups: ['legs', 'hamstrings'],
        equipment: 'none',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 1,
        instructions: [
            'Sit on floor with one leg extended',
            'Other leg bent, foot against inner thigh',
            'Reach forward toward extended foot',
            'Keep back straight',
            'Hold stretch',
            'Switch legs'
        ],
        tips: ['Don\'t bounce', 'Breathe into the stretch', 'Go to point of tension, not pain'],
        tags: ['home-friendly', 'flexibility', 'stretching'],
        sets: 0,
        reps: '30-60 seconds per leg',
        restTime: 0,
        targetGoal: ['flexibility', 'recovery']
    },
    
    // HIIT Exercises
    {
        name: 'Mountain Climbers',
        description: 'High-intensity exercise that targets core while providing cardio benefits.',
        category: 'hiit',
        muscleGroups: ['core', 'shoulders', 'legs'],
        equipment: 'bodyweight',
        difficulty: 'intermediate',
        duration: 0,
        caloriesBurned: 8,
        instructions: [
            'Start in plank position',
            'Bring one knee toward chest',
            'Quickly switch legs',
            'Maintain fast pace',
            'Keep core engaged',
            'Continue alternating'
        ],
        tips: ['Start slow to learn form', 'Keep hips level', 'Breathe rhythmically'],
        tags: ['home-friendly', 'high-intensity', 'cardio'],
        sets: 0,
        reps: '20-30 seconds',
        restTime: 30,
        targetGoal: ['weight-loss', 'endurance', 'core-strength']
    },
    {
        name: 'High Knees',
        description: 'Cardio exercise that improves coordination and burns calories.',
        category: 'hiit',
        muscleGroups: ['legs', 'core'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 7,
        instructions: [
            'Stand tall with feet hip-width apart',
            'Lift one knee toward chest',
            'Quickly switch to other leg',
            'Pump arms naturally',
            'Maintain fast pace',
            'Land on balls of feet'
        ],
        tips: ['Keep core engaged', 'Maintain upright posture', 'Start with 20-second intervals'],
        tags: ['home-friendly', 'high-intensity', 'cardio'],
        sets: 0,
        reps: '20-30 seconds',
        restTime: 30,
        targetGoal: ['weight-loss', 'endurance', 'coordination']
    },
    {
        name: 'Jumping Jacks',
        description: 'Full-body cardio exercise that improves coordination and cardiovascular health.',
        category: 'hiit',
        muscleGroups: ['full-body', 'legs', 'shoulders'],
        equipment: 'bodyweight',
        difficulty: 'beginner',
        duration: 0,
        caloriesBurned: 6,
        instructions: [
            'Stand with feet together, arms at sides',
            'Jump feet apart while raising arms overhead',
            'Jump back to starting position',
            'Maintain rhythm',
            'Land softly'
        ],
        tips: ['Start slow and increase pace', 'Keep knees slightly bent', 'Breathe steadily'],
        tags: ['home-friendly', 'high-intensity', 'cardio'],
        sets: 0,
        reps: '20-30',
        restTime: 30,
        targetGoal: ['weight-loss', 'endurance', 'warm-up']
    }
];

async function seedExercises() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing exercises
        await Exercise.deleteMany({});
        console.log('Cleared existing exercises');

        // Insert new exercises
        await Exercise.insertMany(exercises);
        console.log(`Successfully seeded ${exercises.length} exercises`);

        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding exercises:', error);
        process.exit(1);
    }
}

seedExercises();


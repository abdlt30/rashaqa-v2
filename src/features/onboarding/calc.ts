export interface OnboardingData {
  name: string
  goal: 'lose' | 'maintain' | 'gain'
  age: number
  gender: 'male' | 'female'
  height_cm: number
  weight_kg: number
  target_weight_kg?: number
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  diet_preference?: 'balanced' | 'vegetarian' | 'low_carb' | 'high_protein' | 'keto'
}

export interface NutritionTargets {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  water_ml: number
  bmr: number
  tdee: number
}

export function calculateTargets(data: OnboardingData): NutritionTargets {
  const { weight_kg, height_cm, age, gender, activity_level, goal } = data

  // Mifflin-St Jeor Equation
  const bmr =
    gender === 'male'
      ? 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
      : 10 * weight_kg + 6.25 * height_cm - 5 * age - 161

  const multipliers: Record<OnboardingData['activity_level'], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  const tdee = bmr * multipliers[activity_level]

  let calories = tdee
  if (goal === 'lose') calories = tdee - 400
  else if (goal === 'gain') calories = tdee + 300

  calories = Math.round(calories / 10) * 10

  const protein_g = Math.round((calories * 0.25) / 4)
  const carbs_g = Math.round((calories * 0.45) / 4)
  const fat_g = Math.round((calories * 0.3) / 9)
  const water_ml = Math.round((weight_kg * 35) / 100) * 100

  return {
    calories,
    protein_g,
    carbs_g,
    fat_g,
    water_ml,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
  }
}

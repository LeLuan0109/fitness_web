export enum OrderType {
  ASC = "ASC",
  DESC = "DESC",
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum ActivityLevel {
  SEDENTARY = "SEDENTARY", // Ít vận động
  LIGHTLY_ACTIVE = "LIGHTLY_ACTIVE", // Vận động nhẹ (1-3 ngày/tuần)
  MODERATELY_ACTIVE = "MODERATELY_ACTIVE", // Vận động vừa (3-5 ngày/tuần)
  VERY_ACTIVE = "VERY_ACTIVE", // Vận động nhiều (6-7 ngày/tuần)
  EXTRA_ACTIVE = "EXTRA_ACTIVE", // Vận động rất nhiều (2 lần/ngày)
}

export enum FitnessGoal {
  LOSE_WEIGHT = "LOSE_WEIGHT", // Giảm cân
  GAIN_WEIGHT = "GAIN_WEIGHT", // Tăng cân
  MUSCLE_MASS_GAIN = "MUSCLE_GAIN", // Tăng cơ
  SHAPE_BODY = "SHAPE_BODY", // Giữ dáng/Săn chắc
  OTHERS = "OTHERS", // Khác
}

export enum MealType {
  BREAKFAST = "BREAKFAST", // Bữa sáng
  LUNCH = "LUNCH", // Bữa trưa
  DINNER = "DINNER", // Bữa tối
  EXTRA = "EXTRA_MEAL", // Bữa phụ
}

export enum DifficultyLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

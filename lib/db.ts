import { neon } from '@neondatabase/serverless';

// Initialize Neon client
const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL!);

export interface CompletedGoal {
  id: number;
  user_id: string;
  title: string;
  duration: number;
  category: string;
  color: string;
  icon: string;
  rating: number;
  completed_at: string;
  elapsed_seconds: number;
}

export const db = {
  // Save a completed goal to the database
  async saveCompletedGoal(goal: {
    userId: string;
    title: string;
    duration: number;
    category: string;
    color: string;
    icon: string;
    rating: number;
    elapsedSeconds: number;
  }): Promise<CompletedGoal> {
    const result = await sql`
      INSERT INTO completed_goals (user_id, title, duration, category, color, icon, rating, elapsed_seconds)
      VALUES (${goal.userId}, ${goal.title}, ${goal.duration}, ${goal.category}, ${goal.color}, ${goal.icon}, ${goal.rating}, ${goal.elapsedSeconds})
      RETURNING *
    `;
    return result[0] as CompletedGoal;
  },

  // Get all completed goals for a user
  async getCompletedGoals(userId: string): Promise<CompletedGoal[]> {
    const result = await sql`
      SELECT * FROM completed_goals
      WHERE user_id = ${userId}
      ORDER BY completed_at DESC
    `;
    return result as CompletedGoal[];
  },

  // Get completed goals count for a user
  async getCompletedGoalsCount(userId: string): Promise<number> {
    const result = await sql`
      SELECT COUNT(*) as count FROM completed_goals
      WHERE user_id = ${userId}
    `;
    return parseInt(result[0].count as string);
  },

  // Delete a completed goal
  async deleteCompletedGoal(id: number, userId: string): Promise<void> {
    await sql`
      DELETE FROM completed_goals
      WHERE id = ${id} AND user_id = ${userId}
    `;
  },

  // Get total time spent on completed goals
  async getTotalTimeSpent(userId: string): Promise<number> {
    const result = await sql`
      SELECT COALESCE(SUM(elapsed_seconds), 0) as total_seconds
      FROM completed_goals
      WHERE user_id = ${userId}
    `;
    return parseInt(result[0].total_seconds as string);
  }
};

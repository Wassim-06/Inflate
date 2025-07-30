import { api } from "@/lib/api";
import type { QuestionData } from "@/lib/schema";

export const fetchQuestions = async (orderId: string | undefined): Promise<QuestionData> => {
  try {
    if (!orderId) {
      throw new Error("Order ID is required to fetch questions");
    }
    const response = await api.get(`/questions/${orderId}/`);
    // If the response data is an array, wrap it in an object
    const data = response.data;
    if (Array.isArray(data)) {
      return { questions: data, products: [], branding: [] };
    }
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { Category } from "@/services/categoryService";

/**
 * Recursively finds the target category and collects all its descendant category IDs.
 * @param categories - The list of categories to search through.
 * @param targetId - The ID of the category to find.
 * @returns An array of category IDs including the target and its descendants.
 */
export const findCategoryAndCollectIds = (categories: Category[], targetId: string): string[] => {
 const result: string[] = [];
 
 const findCategory = (categories: Category[]): Category | null => {
   for (const category of categories) {
     if (category.id === targetId) {
       return category;
     }
     if (category.items) {
       const found = findCategory(category.items);
       if (found) return found;
     }
   }
   return null;
 }

 const collectIds = (category: Category) => {
   result.push(category.id);
   if (category.items) {
     category.items.forEach(subcategory => collectIds(subcategory));
   }
 }

 const category = findCategory(categories);
 if (category) {
   collectIds(category);
 }

 return result;
}

/**
 * Returns the default settings for a given activity type.
 * @param type - The type of activity.
 * @returns An object containing default settings for the activity.
 */
export const getDefaultActivitySettings = (type: string) => {
 switch (type) {
   case "quiz":
     return {
       timeLimit: 60,
       attemptsAllowed: 1,
       passingGrade: 50,
       shuffleQuestions: false,
     };
   case "assignment":
     return {
       dueDate: null,
       maxPoints: 100,
       submissionType: "file",
     };
   case "forum":
     return {
       type: "general",
       allowAttachments: true,
     };
   default:
     return {};
 }
};

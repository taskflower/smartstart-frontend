import { collection, doc, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Activity } from "@/types/moodle";

interface ActivityInput {
  type: Activity["type"];
  name: string;
  description: string;
  sequence?: number;
}

export const fetchActivities = async (sectionIds: string[]): Promise<Activity[]> => {
  if (sectionIds.length === 0) return [];
  
  const activitiesQuery = query(
    collection(db, "activities"),
    where("section_id", "in", sectionIds)
  );
  const activitiesSnap = await getDocs(activitiesQuery);
  const activities = activitiesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Activity[];
  
  return activities.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
};

export const addActivity = async (sectionId: string, data: ActivityInput): Promise<Activity> => {
  const newActivity = {
    section_id: sectionId,
    type: data.type,
    name: data.name,
    description: data.description,
    sequence: data.sequence ?? 0,
    visible: true,
    settings: getDefaultActivitySettings(data.type),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const docRef = await addDoc(collection(db, "activities"), newActivity);
  return { ...newActivity, id: docRef.id };
};

export const toggleActivityVisibility = async (
  id: string,
  currentVisibility: boolean
): Promise<void> => {
  const docRef = doc(db, "activities", id);
  await updateDoc(docRef, {
    visible: !currentVisibility,
    updated_at: new Date(),
  });
};

// Helper function
const getDefaultActivitySettings = (type: Activity["type"]) => {
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
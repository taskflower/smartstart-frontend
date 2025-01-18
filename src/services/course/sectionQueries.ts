import { collection, doc, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Section } from "@/types/moodle";

interface SectionInput {
  name: string;
  sequence?: number;
}

export const fetchSections = async (courseId: string): Promise<Section[]> => {
  const sectionsQuery = query(
    collection(db, "sections"),
    where("course_id", "==", courseId)
  );
  const sectionsSnap = await getDocs(sectionsQuery);
  const sections = sectionsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Section[];
  
  return sections.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
};

export const addSection = async (courseId: string, data: SectionInput): Promise<Section> => {
  const newSection = {
    course_id: courseId,
    name: data.name,
    type: "standard" as const,
    sequence: data.sequence ?? 0,
    visible: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const docRef = await addDoc(collection(db, "sections"), newSection);
  return { ...newSection, id: docRef.id };
};

export const toggleSectionVisibility = async (
  id: string,
  currentVisibility: boolean
): Promise<void> => {
  const docRef = doc(db, "sections", id);
  await updateDoc(docRef, {
    visible: !currentVisibility,
    updated_at: new Date(),
  });
};
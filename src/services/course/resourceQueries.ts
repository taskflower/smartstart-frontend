import { collection, doc, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Resource } from "@/types/moodle";

interface ResourceInput {
  type: Resource["type"];
  name: string;
  content: string;
  sequence?: number;
}

export const fetchResources = async (sectionIds: string[]): Promise<Resource[]> => {
  if (sectionIds.length === 0) return [];
  
  const resourcesQuery = query(
    collection(db, "resources"),
    where("section_id", "in", sectionIds)
  );
  const resourcesSnap = await getDocs(resourcesQuery);
  const resources = resourcesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Resource[];
  
  return resources.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
};

export const addResource = async (sectionId: string, data: ResourceInput): Promise<Resource> => {
  const newResource = {
    section_id: sectionId,
    type: data.type,
    name: data.name,
    content: data.content,
    sequence: data.sequence ?? 0,
    visible: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const docRef = await addDoc(collection(db, "resources"), newResource);
  return { ...newResource, id: docRef.id };
};

export const toggleResourceVisibility = async (
  id: string,
  currentVisibility: boolean
): Promise<void> => {
  const docRef = doc(db, "resources", id);
  await updateDoc(docRef, {
    visible: !currentVisibility,
    updated_at: new Date(),
  });
};
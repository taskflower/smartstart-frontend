/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CourseHeader from "@/components/course/CourseHeader";
import { SectionCard } from "@/components/course/SectionComponents";
import { ActivityItem, ResourceItem } from "@/components/course/ContentItems";
import { AddContentDialog } from "@/components/course/AddContentDialog";
import { Alert } from "@/components/ui/alert";

import AuthLayout from "@/components/AuthLayout";
import { db } from "@/services/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { Activity, Course, Resource, Section } from "@/types/moodle";
import ActivitySettingsDialog from "@/components/course/ActivitySettingsDialog"; // <--- NOWY IMPORT

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);

  // --- NOWE STANY DLA DIALOGU USTAWIEŃ ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleOpenSettings = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsSettingsOpen(true);
  };

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) {
        setLoading(false);
        setError("Nie podano ID kursu");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Pobierz kurs
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);

        if (!courseSnap.exists()) {
          setError("Kurs nie istnieje");
          setLoading(false);
          return;
        }

        const courseData = { id: courseId, ...courseSnap.data() } as Course;
        setCourse(courseData);

        // 2. Pobierz sekcje (bez orderBy, żeby nie wymagać indeksu)
        const sectionsQuery = query(
          collection(db, "sections"),
          where("course_id", "==", courseId)
        );
        const sectionsSnap = await getDocs(sectionsQuery);
        const sectionsData = sectionsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Section[];

        setSections(sectionsData);

        // 3. Pobierz aktywności i zasoby (też bez orderBy)
        if (sectionsData.length > 0) {
          const sectionIds = sectionsData.map((s) => s.id);

          // Pobierz aktywności
          const activitiesQuery = query(
            collection(db, "activities"),
            where("section_id", "in", sectionIds)
          );

          // Pobierz zasoby
          const resourcesQuery = query(
            collection(db, "resources"),
            where("section_id", "in", sectionIds)
          );

          const [activitiesSnap, resourcesSnap] = await Promise.all([
            getDocs(activitiesQuery),
            getDocs(resourcesQuery),
          ]);

          setActivities(
            activitiesSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Activity[]
          );

          setResources(
            resourcesSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Resource[]
          );
        }
      } catch (err) {
        console.error("Błąd podczas ładowania danych:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Wystąpił błąd podczas ładowania kursu"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  const handleAddSection = async (data: { name: string }) => {
    if (!courseId) return;

    try {
      const newSection = {
        course_id: courseId,
        name: data.name,
        type: "standard" as const,
        sequence: sections.length,
        visible: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const docRef = await addDoc(collection(db, "sections"), newSection);
      // @ts-ignore
      setSections((prev) => [...prev, { ...newSection, id: docRef.id }]);
      setError(null);
    } catch (err) {
      console.error("Error adding section:", err);
      setError("Nie udało się dodać sekcji");
    }
  };

  const handleAddActivity = async (
    sectionId: string,
    data: { type: Activity["type"]; name: string; description: string }
  ) => {
    try {
      const sectionActivities = activities.filter(
        (a) => a.section_id === sectionId
      );
      const newActivity = {
        section_id: sectionId,
        type: data.type,
        name: data.name,
        description: data.description,
        sequence: sectionActivities.length,
        visible: true,
        settings: getDefaultActivitySettings(data.type),
        created_at: new Date(),
        updated_at: new Date(),
      };

      const docRef = await addDoc(collection(db, "activities"), newActivity);
      // @ts-ignore
      setActivities((prev) => [...prev, { ...newActivity, id: docRef.id }]);
      setError(null);
    } catch (err) {
      console.error("Error adding activity:", err);
      setError("Nie udało się dodać aktywności");
    }
  };

  const handleAddResource = async (
    sectionId: string,
    data: { type: Resource["type"]; name: string; content: string }
  ) => {
    try {
      const sectionResources = resources.filter(
        (r) => r.section_id === sectionId
      );
      const newResource = {
        section_id: sectionId,
        type: data.type,
        name: data.name,
        content: data.content,
        sequence: sectionResources.length,
        visible: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const docRef = await addDoc(collection(db, "resources"), newResource);
      setResources((prev) => [...prev, { ...newResource, id: docRef.id }]);
      setError(null);
    } catch (err) {
      console.error("Error adding resource:", err);
      setError("Nie udało się dodać zasobu");
    }
  };

  const handleToggleVisibility = async (
    type: "section" | "activity" | "resource",
    id: string,
    currentVisibility: boolean
  ) => {
    try {
      const collectionName = `${type}s`;
      const docRef = doc(db, collectionName, id);

      await updateDoc(docRef, {
        visible: !currentVisibility,
        updated_at: new Date(),
      });

      switch (type) {
        case "section":
          setSections((prev) =>
            prev.map((s) =>
              s.id === id ? { ...s, visible: !currentVisibility } : s
            )
          );
          break;
        case "activity":
          setActivities((prev) =>
            prev.map((a) =>
              a.id === id ? { ...a, visible: !currentVisibility } : a
            )
          );
          break;
        case "resource":
          setResources((prev) =>
            prev.map((r) =>
              r.id === id ? { ...r, visible: !currentVisibility } : r
            )
          );
          break;
      }
      setError(null);
    } catch (err) {
      console.error("Error toggling visibility:", err);
      setError("Nie udało się zmienić widoczności");
    }
  };

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
    }
  };

  if (!courseId) {
    return (
      <AuthLayout>
        <div className="p-8">
          <Alert variant="destructive">Brak ID kursu</Alert>
        </div>
      </AuthLayout>
    );
  }

  if (loading) {
    return (
      <AuthLayout>
        <div className="p-8">Ładowanie kursu...</div>
      </AuthLayout>
    );
  }

  if (!course) {
    return (
      <AuthLayout>
        <div className="p-8">
          <Alert variant="destructive">Nie znaleziono kursu</Alert>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <CourseHeader
          courseName={course.name}
          courseDescription={course.description}
          error={error}
          onAddSection={handleAddSection}
        />

        <div className="space-y-6">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              {...section}
              onToggleVisibility={() =>
                handleToggleVisibility("section", section.id, section.visible)
              }
              onAddContent={() => {
                setSelectedSectionId(section.id);
                setIsAddContentOpen(true);
              }}
            >
              <div className="space-y-4">
                {activities
                  .filter((activity) => activity.section_id === section.id)
                  // Możesz tu dodać sortowanie w JS, jeśli chcesz zachować kolejność
                  // .sort((a, b) => a.sequence - b.sequence)
                  .map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      {...activity}
                      onToggleVisibility={() =>
                        handleToggleVisibility(
                          "activity",
                          activity.id,
                          activity.visible
                        )
                      }
                      onOpenSettings={() => handleOpenSettings(activity)} // <--- OTWIERA USTAWIENIA
                    />
                  ))}

                {resources
                  .filter((resource) => resource.section_id === section.id)
                  // Możesz tu dodać sortowanie w JS, jeśli chcesz zachować kolejność
                  // .sort((a, b) => a.sequence - b.sequence)
                  .map((resource) => (
                    <ResourceItem
                      key={resource.id}
                      {...resource}
                      onToggleVisibility={() =>
                        handleToggleVisibility(
                          "resource",
                          resource.id,
                          resource.visible
                        )
                      }
                      onOpenSettings={() => {
                        /* Możesz dodać analogiczny dialog dla zasobu */
                      }}
                    />
                  ))}

                {activities.filter((a) => a.section_id === section.id).length === 0 &&
                  resources.filter((r) => r.section_id === section.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Ta sekcja jest pusta. Dodaj aktywność lub zasób.
                    </div>
                  )}
              </div>
            </SectionCard>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ten kurs nie ma jeszcze żadnych sekcji. Dodaj pierwszą sekcję.
            </div>
          )}
        </div>

        <AddContentDialog
          open={isAddContentOpen}
          onOpenChange={setIsAddContentOpen}
          onAddActivity={(data) => {
            if (selectedSectionId) {
              // @ts-ignore
              handleAddActivity(selectedSectionId, data);
              setIsAddContentOpen(false);
            }
          }}
          onAddResource={(data) => {
            if (selectedSectionId) {
              // @ts-ignore
              handleAddResource(selectedSectionId, data);
              setIsAddContentOpen(false);
            }
          }}
        />

        {/* Dialog z ustawieniami aktywności */}
        <ActivitySettingsDialog
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          activity={selectedActivity}
        />
      </div>
    </AuthLayout>
  );
};

export default CoursePage;

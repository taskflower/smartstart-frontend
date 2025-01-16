import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type {
  Activity,
  Resource,
  CoursePageState,
  AddSectionData,
  AddActivityData,
  AddResourceData,
  VisibilityToggleType,
} from "@/types/moodle";
import AuthLayout from "@/components/AuthLayout";
import { Alert } from "@/components/ui/alert";
import {
  fetchCourse,
  fetchSections,
  fetchActivities,
  fetchResources,
  addSection,
  addActivity,
  addResource,
  toggleVisibility,
} from "@/services/courseService";
import {
  CourseHeader,
  SectionCard,
  ActivityItem,
  ResourceItem,
  AddContentDialog,
  ActivitySettingsDialog,
  ResourceSettingsDialog,
} from "@/components/course";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [state, setState] = useState<CoursePageState>({
    course: null,
    sections: [],
    activities: [],
    resources: [],
    loading: true,
    error: null,
    selectedSectionId: null,
    isAddContentOpen: false,
  });

  // UI state for dialogs
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResourceSettingsOpen, setIsResourceSettingsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    if (!courseId) {
      setState((prev) => ({
        ...prev,
        error: "Nie podano ID kursu",
        loading: false,
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [course, sections] = await Promise.all([
        fetchCourse(courseId),
        fetchSections(courseId),
      ]);

      if (!course) {
        setState((prev) => ({
          ...prev,
          error: "Kurs nie istnieje",
          loading: false,
        }));
        return;
      }

      const sectionIds = sections.map((s) => s.id);
      const [activities, resources] = await Promise.all([
        fetchActivities(sectionIds),
        fetchResources(sectionIds),
      ]);

      setState((prev) => ({
        ...prev,
        course,
        sections,
        activities,
        resources,
        loading: false,
      }));
    } catch (err) {
      console.error("Błąd podczas ładowania danych:", err);
      setState((prev) => ({
        ...prev,
        error:
          err instanceof Error
            ? err.message
            : "Wystąpił błąd podczas ładowania kursu",
        loading: false,
      }));
    }
  };

  const handleAddSection = async (data: AddSectionData) => {
    if (!courseId) return;

    try {
      const newSection = await addSection(courseId, data);
      setState((prev) => ({
        ...prev,
        sections: [...prev.sections, newSection],
        error: null,
      }));
    } catch (err) {
      console.error("Error adding section:", err);
      setState((prev) => ({ ...prev, error: "Nie udało się dodać sekcji" }));
    }
  };

  const handleAddActivity = async (
    sectionId: string,
    data: AddActivityData
  ) => {
    try {
      const newActivity = await addActivity(sectionId, data);
      setState((prev) => ({
        ...prev,
        activities: [...prev.activities, newActivity],
        error: null,
        isAddContentOpen: false,
      }));
    } catch (err) {
      console.error("Error adding activity:", err);
      setState((prev) => ({
        ...prev,
        error: "Nie udało się dodać aktywności",
      }));
    }
  };

  const handleAddResource = async (
    sectionId: string,
    data: AddResourceData
  ) => {
    try {
      const newResource = await addResource(sectionId, data);
      setState((prev) => ({
        ...prev,
        resources: [...prev.resources, newResource],
        error: null,
        isAddContentOpen: false,
      }));
    } catch (err) {
      console.error("Error adding resource:", err);
      setState((prev) => ({ ...prev, error: "Nie udało się dodać zasobu" }));
    }
  };

  const handleToggleVisibility = async (
    type: VisibilityToggleType,
    id: string,
    currentVisibility: boolean
  ) => {
    try {
      await toggleVisibility(type, id, currentVisibility);

      setState((prev) => {
        switch (type) {
          case "section":
            return {
              ...prev,
              sections: prev.sections.map((item) =>
                item.id === id ? { ...item, visible: !currentVisibility } : item
              ),
              error: null,
            };
          case "activity":
            return {
              ...prev,
              activities: prev.activities.map((item) =>
                item.id === id ? { ...item, visible: !currentVisibility } : item
              ),
              error: null,
            };
          case "resource":
            return {
              ...prev,
              resources: prev.resources.map((item) =>
                item.id === id ? { ...item, visible: !currentVisibility } : item
              ),
              error: null,
            };
          default:
            return prev;
        }
      });
    } catch (err) {
      console.error("Error toggling visibility:", err);
      setState((prev) => ({
        ...prev,
        error: "Nie udało się zmienić widoczności",
      }));
    }
  };

  if (!courseId) {
    return (
      <AuthLayout>
        <Alert variant="destructive">Brak ID kursu</Alert>
      </AuthLayout>
    );
  }

  if (state.loading) {
    return (
      <AuthLayout>
        <div className="p-8">Ładowanie kursu...</div>
      </AuthLayout>
    );
  }

  if (!state.course) {
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
      <CourseHeader
        courseName={state.course.name}
        courseDescription={state.course.description}
        error={state.error}
        onAddSection={handleAddSection}
      />

      <div className="space-y-6">
        {state.sections.map((section) => (
          <SectionCard
            key={section.id}
            {...section}
            onToggleVisibility={() =>
              handleToggleVisibility("section", section.id, section.visible)
            }
            onAddContent={() => {
              setState((prev) => ({
                ...prev,
                selectedSectionId: section.id,
                isAddContentOpen: true,
              }));
            }}
          >
            <div className="space-y-4">
              {state.activities
                .filter((activity) => activity.section_id === section.id)
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
                    onOpenSettings={() => {
                      setSelectedActivity(activity);
                      setIsSettingsOpen(true);
                    }}
                  />
                ))}

              {state.resources
                .filter((resource) => resource.section_id === section.id)
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
                      setSelectedResource(resource);
                      setIsResourceSettingsOpen(true);
                    }}
                  />
                ))}

              {state.activities.filter((a) => a.section_id === section.id)
                .length === 0 &&
                state.resources.filter((r) => r.section_id === section.id)
                  .length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Ta sekcja jest pusta. Dodaj aktywność lub zasób.
                  </div>
                )}
            </div>
          </SectionCard>
        ))}

        {state.sections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Ten kurs nie ma jeszcze żadnych sekcji. Dodaj pierwszą sekcję.
          </div>
        )}
      </div>

      <AddContentDialog
        open={state.isAddContentOpen}
        onOpenChange={(open) =>
          setState((prev) => ({ ...prev, isAddContentOpen: open }))
        }
        onAddActivity={(data) => {
          if (state.selectedSectionId) {
            handleAddActivity(state.selectedSectionId, data);
          }
        }}
        onAddResource={(data) => {
          if (state.selectedSectionId) {
            handleAddResource(state.selectedSectionId, data);
          }
        }}
      />

      <ActivitySettingsDialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activity={selectedActivity}
      />

      <ResourceSettingsDialog
        open={isResourceSettingsOpen}
        onClose={() => setIsResourceSettingsOpen(false)}
        resource={selectedResource}
      />
    </AuthLayout>
  );
};

export default CoursePage;

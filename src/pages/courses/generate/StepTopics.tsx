// src/pages/courses/generate/StepTopics.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCourseGeneratorStore } from '@/stores/useCourseGeneratorStore';
import { useNavigate } from 'react-router-dom';

interface Topic {
  title: string;
  duration: string;
  materials: string[];
  objectives: string[];
}

const StepTopics = () => {
  const navigate = useNavigate();
  const setCurrentStep = useCourseGeneratorStore((state) => state.setCurrentStep);
  const courseData = useCourseGeneratorStore((state) => state.courseData);
  const setCourseData = useCourseGeneratorStore((state) => state.setCourseData);

  const [newTopic, setNewTopic] = useState<Omit<Topic, 'title'>>({
    duration: '',
    materials: [],
    objectives: [],
  });

  const handleAddTopic = () => {
    if (newTopic.duration && newTopic.materials.length && newTopic.objectives.length) {
      const topic: Topic = {
        title: `Topic ${courseData.topics.length + 1}`,
        ...newTopic,
      };
      setCourseData({
        topics: [...courseData.topics, topic],
      });
      setNewTopic({
        duration: '',
        materials: [],
        objectives: [],
      });
    } else {
      alert('Please fill all fields for the topic.');
    }
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate('/courses/generate/result');
  };

  const handleBack = () => {
    setCurrentStep(3);
    navigate('/courses/generate/step3');
  };

  return (
    <div className="space-y-4">
      {/* Form to Add New Topic */}
      <div className="space-y-2">
        <Label>Duration</Label>
        <Input
          value={newTopic.duration}
          onChange={(e) => setNewTopic({ ...newTopic, duration: e.target.value })}
          placeholder="e.g., 2 godziny"
        />
      </div>

      <div className="space-y-2">
        <Label>Materials (comma separated)</Label>
        <Input
          value={newTopic.materials.join(', ')}
          onChange={(e) =>
            setNewTopic({ ...newTopic, materials: e.target.value.split(',').map(m => m.trim()) })
          }
          placeholder="e.g., Prezentacja, Ćwiczenia, Quiz"
        />
      </div>

      <div className="space-y-2">
        <Label>Objectives (comma separated)</Label>
        <Input
          value={newTopic.objectives.join(', ')}
          onChange={(e) =>
            setNewTopic({ ...newTopic, objectives: e.target.value.split(',').map(o => o.trim()) })
          }
          placeholder="e.g., Understand basic algebra, Solve simple equations"
        />
      </div>

      <Button onClick={handleAddTopic} disabled={!newTopic.duration || newTopic.materials.length === 0 || newTopic.objectives.length === 0}>
        Add Topic
      </Button>

      {/* Display Added Topics */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Added Topics</h3>
        {courseData.topics.length === 0 && <p>No topics added yet.</p>}
        {courseData.topics.map((topic, index) => (
          <div key={index} className="p-2 border rounded">
            <h4 className="font-medium">{topic.title}</h4>
            <p><strong>Duration:</strong> {topic.duration}</p>
            <p><strong>Materials:</strong> {topic.materials.join(', ')}</p>
            <p><strong>Objectives:</strong> {topic.objectives.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Wstecz
        </Button>
        <Button onClick={handleNext} disabled={courseData.topics.length === 0}>
          Generuj
        </Button>
      </div>
    </div>
  );
};

export default StepTopics;

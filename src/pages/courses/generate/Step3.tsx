/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useCourseGeneratorStore } from "@/stores/useCourseGeneratorStore";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const Step3 = () => {
  const navigate = useNavigate();
  const setCurrentStep = useCourseGeneratorStore(
    (state) => state.setCurrentStep
  );
  const courseData = useCourseGeneratorStore((state) => state.courseData);
  const setCourseData = useCourseGeneratorStore((state) => state.setCourseData);

  const [note, setNote] = useState<string>("");

  const handleGenerate = () => {
    setCourseData({
      note,
    } as any);
    setCurrentStep(4);
    navigate("/courses/generate/result");
  };

  const handleBack = () => {
    setCurrentStep(2);
    navigate("/courses/generate/rag-materials");
  };

  const summaryData = [
    { label: "Level", value: courseData.summary.difficulty },
    { label: "School Type", value: courseData.school },
    { label: "Subject", value: courseData.subject },
    { label: "Curriculum Basis", value: courseData.useBase ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-4">
      <Alert>
        <p className="font-semibold">Ready to Generate</p>
        <p>
          Review your selections and add any final notes before generating the
          course.
        </p>
      </Alert>

      {/* Display Summary Table */}
      <Table>
        <TableBody>
          {summaryData.map((item) => (
            <TableRow key={item.label}>
              <TableCell className="text-sm text-muted-foreground">
                {item.label}
              </TableCell>
              <TableCell className="text-sm font-medium text-right">
                {item.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add a Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Additional Notes</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add any additional notes or instructions here..."
          className="min-h-[100px]"
        />
      </div>

      <Separator />

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!courseData.summary.difficulty}
        >
          Generate
        </Button>
      </div>
    </div>
  );
};

export default Step3;
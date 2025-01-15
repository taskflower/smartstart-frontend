import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SchoolType } from "../types/document";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function CreateDocumentPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    textbook: "",
    educationLevel: "",
    language: "",
    schoolType: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docData = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, "documents"), docData);
      return <Navigate to="/dashboard" />;
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Wystąpił błąd podczas dodawania dokumentu");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold">Repozytorium Edukacyjne</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => <Navigate to="/dashboard" />}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do listy
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Dodaj nowy dokument</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">Temat</Label>
                  <Input
                    id="topic"
                    required
                    value={formData.topic}
                    onChange={handleChange("topic")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textbook">Podręcznik</Label>
                  <Input
                    id="textbook"
                    required
                    value={formData.textbook}
                    onChange={handleChange("textbook")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Poziom edukacji</Label>
                  <Input
                    id="educationLevel"
                    required
                    value={formData.educationLevel}
                    onChange={handleChange("educationLevel")}
                    placeholder="np. Klasa 7"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Język</Label>
                  <Select
                    value={formData.language}
                    onValueChange={handleSelectChange("language")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz język" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Polski">Polski</SelectItem>
                      <SelectItem value="Angielski">Angielski</SelectItem>
                      <SelectItem value="Niemiecki">Niemiecki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolType">Typ szkoły</Label>
                  <Select
                    value={formData.schoolType}
                    onValueChange={handleSelectChange("schoolType")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ szkoły" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SchoolType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Treść</Label>
                  <Textarea
                    id="content"
                    required
                    value={formData.content}
                    onChange={handleChange("content")}
                    className="min-h-[200px]"
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Dodawanie..." : "Dodaj dokument"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

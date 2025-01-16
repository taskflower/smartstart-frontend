import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "@/services/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "@/hooks/useAuthState";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthLayout from "@/components/AuthLayout";
import { Category, fetchAllCategories } from "@/services/categoryService";

interface FormData {
  name: string;
  description: string;
  category_id: string;
}

export default function CreateCoursePage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuthState();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category_id: "",
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const treeCategories = await fetchAllCategories();
        setCategories(treeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "courses"), {
        ...formData,
        user_id: user.uid,
        sections: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Przekieruj do nowo utworzonego kursu
      navigate(`/courses/${docRef.id}`);
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Wystąpił błąd podczas dodawania kursu");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSelectChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Funkcja do spłaszczania drzewa kategorii z wcięciami
  const flattenCategories = (categories: Category[], depth = 0): { category: Category; depth: number }[] => {
    return categories.reduce<{ category: Category; depth: number }[]>((acc, category) => {
      acc.push({ category, depth });
      if (category.items && category.items.length > 0) {
        acc.push(...flattenCategories(category.items, depth + 1));
      }
      return acc;
    }, []);
  };

  const flattenedCategories = flattenCategories(categories);

  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do listy
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Dodaj nowy kurs</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Kategoria</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={handleSelectChange("category_id")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        {flattenedCategories.map(({ category, depth }) => (
                          <SelectItem key={category.id} value={category.id}>
                            {`${'— '.repeat(depth)}${category.name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nazwa kursu</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange("name")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Opis kursu</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={handleChange("description")}
                      className="min-h-[100px]"
                    />
                  </div>

                  

                  <Button type="submit" disabled={loading}>
                    {loading ? "Dodawanie..." : "Dodaj kurs"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

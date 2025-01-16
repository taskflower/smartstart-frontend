// src/constants/mockResult.ts

export const MOCK_RESULT = {
    title: "Kurs matematyki - Algebra liniowa",
    description:
      "Kurs przygotowany zgodnie z podstawą programową dla szkół ponadpodstawowych",
    topics: [
      {
        title: "Wprowadzenie do układów równań",
        duration: "2 H",
        materials: ["Prezentacja", "Ćwiczenia", "Quiz"],
        objectives: [
          "Zrozumienie podstaw algebry liniowej",
          "Umiejętność rozwiązywania prostych układów równań",
        ],
      },
      {
        title: "Metoda eliminacji Gaussa",
        duration: "3 H",
        materials: ["Wykład", "Zadania praktyczne", "Test"],
        objectives: [
          "Poznanie metody eliminacji Gaussa",
          "Rozwiązywanie złożonych układów równań",
        ],
      },
      {
        title: "Wyznaczniki macierzy",
        duration: "2.5 H",
        materials: ["Materiały teoretyczne", "Przykłady", "Sprawdzian"],
        objectives: [
          "Obliczanie wyznaczników",
          "Zastosowanie wyznaczników w praktyce",
        ],
      },
    ],
    summary: {
      totalDuration: "7.5 H",
      difficulty: "Średniozaawansowany",
      requirements: ["Podstawy algebry", "Znajomość funkcji liniowych"],
      assessment: [
        "Quizy po każdym module",
        "Test końcowy",
        "Projekt praktyczny",
      ],
    },
  };
  
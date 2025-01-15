/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
  BackgroundVariant
} from "reactflow";
import "reactflow/dist/style.css";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Lightbulb,
  Brain,
  Globe,
  Calculator,
  Code2,
  Link2,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

// -------------------- TYPY / MODELE --------------------

/** Dane dziedziny (tak jak w poprzednim przykładzie) */
interface Area {
  id: string;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

/** Te same obszary co wcześniej */
const areas: Area[] = [
  {
    id: "math",
    name: "Matematyka",
    description: "Analiza, algebra, statystyka",
    icon: Calculator,
  },
  {
    id: "cs",
    name: "Informatyka",
    description: "Algorytmy, struktury danych, programowanie",
    icon: Code2,
  },
  {
    id: "lang",
    name: "Języki obce",
    description: "Angielski, niemiecki, francuski",
    icon: Globe,
  },
  {
    id: "sci",
    name: "Nauki przyrodnicze",
    description: "Fizyka, chemia, biologia",
    icon: Lightbulb,
  },
  {
    id: "cog",
    name: "Logika i myślenie krytyczne",
    description: "Rozwiązywanie problemów, synteza danych",
    icon: Brain,
  },
];

// -------------------- KOMPONENTY NODES --------------------

/**
 * Centralny węzeł ("Twoja Ścieżka") – wygląd taki sam jak w poprzednim kodzie
 */
function CentralNode() {
  return (
    <Card className="w-48 text-center">
      <CardHeader>
        <CardTitle className="text-sm font-bold">Trasa Twojej Podróży</CardTitle>
        <CardDescription>Interdyscyplinarny rdzeń</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="outline" className="flex items-center gap-1">
          <Link2 className="h-3 w-3" />
          Połączona wiedza
        </Badge>
      </CardContent>
    </Card>
  );
}

/**
 * Węzeł "obszaru" wiedzy (np. Matematyka, Informatyka...) –
 * taki sam wygląd jak <AreaCard> z poprzedniego przykładu
 * (tylko w formie węzła React Flow).
 */
function AreaNode({ data }: any) {
  const Icon = data.icon;
  return (
    <Card className="w-48 text-center">
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center justify-center gap-2">
          <Icon className="h-4 w-4" />
          {data.name}
        </CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="w-full">
          Poznaj więcej
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * React Flow pozwala przypisać różne "typy" węzłów
 * do niestandardowych komponentów.
 */
const nodeTypes = {
  centralNode: CentralNode,
  areaNode: AreaNode,
};

// -------------------- POZYCJE (x,y) i KONFIGURACJA --------------------


/**
 * Mamy 6 węzłów: centralny + 5 obszarów.
 * Ustawiamy je w tych samych miejscach, co w poprzednim kodzie.
 */
const initialNodes: Node[] = [
  // Centralny węzeł: na środku (x=400,y=400 w kontenerze 800×800)
  {
    id: "central",
    type: "centralNode",
    position: { x: 350, y: 350 },
    data: {},
  },
  // 1) Matematyka – bliżej góry
  {
    id: "math",
    type: "areaNode",
    position: { x: 350, y: 50 },
    data: {
      name: areas[0].name,
      description: areas[0].description,
      icon: areas[0].icon,
    },
  },
  // 2) Informatyka – w prawo i trochę w górę
  {
    id: "cs",
    type: "areaNode",
    position: { x: 600, y: 250 },
    data: {
      name: areas[1].name,
      description: areas[1].description,
      icon: areas[1].icon,
    },
  },
  // 3) Języki obce – w prawo i na dół
  {
    id: "lang",
    type: "areaNode",
    position: { x: 600, y: 550 },
    data: {
      name: areas[2].name,
      description: areas[2].description,
      icon: areas[2].icon,
    },
  },
  // 4) Nauki przyrodnicze – na dole na środku
  {
    id: "sci",
    type: "areaNode",
    position: { x: 350, y: 650 },
    data: {
      name: areas[3].name,
      description: areas[3].description,
      icon: areas[3].icon,
    },
  },
  // 5) Logika i myślenie – bardziej w lewo
  {
    id: "cog",
    type: "areaNode",
    position: { x: 100, y: 300 },
    data: {
      name: areas[4].name,
      description: areas[4].description,
      icon: areas[4].icon,
    },
  },
];

/**
 * Krawędzie (edges) 1:1 jak poprzednio – z "central" do każdego obszaru.
 */
const initialEdges: Edge[] = [
  { id: "e-central-math", source: "central", target: "math" },
  { id: "e-central-cs", source: "central", target: "cs" },
  { id: "e-central-lang", source: "central", target: "lang" },
  { id: "e-central-sci", source: "central", target: "sci" },
  { id: "e-central-cog", source: "central", target: "cog" },
];

// -------------------- GŁÓWNY KOMPONENT STRONY --------------------

export default function InterdisciplinaryPage() {
  // Stan węzłów i krawędzi – w razie potrzeby można zablokować drag
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Pozwala łączyć węzły "drag & drop"
  const onConnect = useCallback(
    (connection: Connection | Edge) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <AuthLayout>
      <div className="container mx-auto py-8 h-[calc(100vh-4rem)] flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Mapa interdyscyplinarna</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
          Poniższa wizualizacja pokazuje, jak różne obszary wiedzy mogą się
          przenikać, wspierając rozwój ucznia w obranej podróży do celu.
        </p>
        <Separator className="mb-8" />

        {/* Obszar React Flow – 600x600 albo elastyczne 100% w zależności od stylów */}
        <div className="relative border rounded-md flex-1">
          <ReactFlow
            nodeTypes={nodeTypes} // rejestrujemy nasze custom node'y
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </AuthLayout>
  );
}

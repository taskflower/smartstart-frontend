// src/pages/LoginPage.tsx
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/services/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <img className="px-10"src="./ilustration.svg" alt="Illustration" />
        <div className="text-center">
          {/* Zamiast <br/> stosujemy dwie oddzielne linie z różnymi rozmiarami */}
          <h2 className="mt-6 text-4xl font-extrabold ">
            SmartStart
          </h2>
          <h3 className="text-2xl font-semibold ">
            Knowledge Hub
          </h3>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Weaving together diverse platforms, these cohesive educational 
            solutions forge an interdisciplinary journey, supported by 
            autonomous assistants.
          </p>
        </div>
        <Button
          className="w-full flex justify-center py-2 px-4"
          onClick={handleLogin}
        >
          Zaloguj się przez Google
        </Button>
        <div className="flex justify-between items-center">
          <img className="w-32" src="./smartinteractive.svg" alt="Smart Interactive" />
          <img className="w-24" src="./powered.svg" alt="Powered" />
        </div>
      </div>
    </div>
  );
}

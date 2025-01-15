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
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            SmartStart Content Bridge
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Content exchange between educational platforms supported by
            autonomous assistants
          </p>
        </div>
        <Button
          className="w-full flex justify-center py-2 px-4"
          onClick={handleLogin}
        >
          Zaloguj się przez Google
        </Button>
      </div>
    </div>
  );
}

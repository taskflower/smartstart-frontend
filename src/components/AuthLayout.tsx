import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, LogOut, User, LayoutDashboard, BookOpen, Files, PenSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/auth";
import { useAuthState } from "../hooks/useAuthState";
import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "@/services/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Kursy",
      href: "/courses",
      icon: BookOpen,
    },
    {
      name: "Kategorie",
      href: "/categories",
      icon: Files,
    },
    {
      name: "Bank pytań",
      href: "/questions",
      icon: PenSquare,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block">SmartStart Content Bridge</span>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Nauczyciel
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Wyloguj się</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          "hidden md:flex h-screen w-64 flex-col fixed left-0",
          "border-r bg-background"
        )}>
          <div className="flex flex-col space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => navigate(item.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
            <div className="flex justify-around p-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => navigate(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1",
          "md:ml-64", // Offset for sidebar
          isMobile ? "mb-16" : "" // Space for mobile navigation
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PawPrint, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  setIsLoading(true);

  try {
    await login(email, password);
    toast.success("Welcome back!");
    
  
    setTimeout(() => {
      navigate("/home");
    }, 100);
    
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Login failed. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground p-8">
            <PawPrint className="h-24 w-24 mx-auto mb-8 animate-float" />
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-xl opacity-90 max-w-md">
              Your furry friends are waiting for you. Sign in to continue your
              pet care journey.
            </p>
          </div>
        </div>
        <div className="absolute bottom-10 left-10 opacity-20">
          <PawPrint className="h-32 w-32 rotate-[-20deg]" />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <PawPrint className="h-24 w-24 rotate-[15deg]" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Happy-Paws
            </span>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">Sign In</h2>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

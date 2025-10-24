import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "../hooks/use-toast";
import { Leaf, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest } from "../utils/apiHelper";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("/auth/forgot-password", {
        method: "POST",
        data: { email },
      });

      toast({
        title: "Verification Code Sent",
        description: "Check your email for the verification code",
      });

      // Redirect to verification page with email and code
      const encodedEmail = encodeURIComponent(email);
      // Include the code in the URL for demo purposes
      setLocation(
        `/verify-code?email=${encodedEmail}&code=${response.resetCode}`
      );
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Email not registered",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/">
            <div className="flex items-center justify-center space-x-2 mb-6 cursor-pointer">
              <Leaf className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-gray-900">EcoWise</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a verification code
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Link href="/login">
                <Button
                  variant="link"
                  className="w-full flex items-center justify-center text-gray-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;

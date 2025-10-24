import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "../hooks/use-toast";
import { Leaf, Key, ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest } from "../utils/apiHelper";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(600);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    // Parse params using window.location instead
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code"); // Get code from URL

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
      // If code was passed in URL, save it
      if (codeParam) {
        setVerificationCode(codeParam);
      }
    } else {
      // No email in params, redirect back
      setLocation("/forgot-password");
      toast({
        title: "Error",
        description: "Email information missing",
        variant: "destructive",
      });
    }

    // Start countdown timer (1 minute)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation, toast]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("/auth/verify-code", {
        method: "POST",
        data: { email, code },
      });

      toast({
        title: "Code Verified",
        description: "You can now reset your password",
      });

      // Redirect to reset password page
      const encodedEmail = encodeURIComponent(email);
      const resetToken = response.resetToken; // Token from backend
      setLocation(`/reset-password?email=${encodedEmail}&token=${resetToken}`);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        data: { email },
      });

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email",
      });

      // Reset timer
      setTimeLeft(3600);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
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
          <h2 className="text-3xl font-bold text-gray-900">Verify Code</h2>
          <p className="mt-2 text-gray-600">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Enter Code</CardTitle>
            <div className="text-center text-sm">
              <span
                className={`font-medium ${
                  timeLeft < 300 ? "text-red-500" : "text-gray-500"
                }`}
              >
                Code expires in: {formatTime(timeLeft)}
              </span>
            </div>
          </CardHeader>
          {/* Display demo code if available */}
          {verificationCode && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mx-6 mb-4">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-amber-800">
                  Your Verification Code
                </p>
                <p className="text-2xl font-bold tracking-wider text-amber-900 font-mono">
                  {verificationCode}
                </p>
                <p className="text-xs text-amber-700">
                  Valid for 10 minute only
                </p>
              </div>
            </div>
          )}
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="code"
                    className="text-sm font-medium text-gray-700"
                  >
                    Verification Code
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength="6"
                      required
                      value={code}
                      onChange={(e) =>
                        setCode(
                          e.target.value.replace(/\D/g, "").substring(0, 6)
                        )
                      }
                      className="pl-10 text-center text-lg tracking-widest"
                      placeholder="000000"
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || timeLeft === 0}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-primary"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  Resend code
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <Link href="/forgot-password">
                <Button
                  variant="link"
                  className="w-full flex items-center justify-center text-gray-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Forgot Password
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyCode;

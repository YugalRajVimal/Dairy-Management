import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";

interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export default function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isOTPFieldsVisible, setIsOTPFormVisible] = useState(false);
  const [otp, setOTP] = useState<string>("");

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
  });

  // Timer state for resend (in seconds)
  const [resendTimer, setResendTimer] = useState<number>(0);
  // Use a number (from setTimeout) instead of NodeJS.Timeout to avoid TS2503 error
  const timerRef = useRef<number | null>(null);

  // For managing disabling all form during sending
  const [loading, setLoading] = useState<boolean>(false);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  // Handle timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = window.setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
  }, [resendTimer]);

  const clearAlert = () => {
    setAlert({
      isEnable: false,
      variant: "info",
      title: "",
      message: "",
    });
  };

  // Unified OTP sending logic, for both "Get OTP" and "Resend OTP"
  const handleSendOTP = async (isResend = false) => {
    clearAlert();
    if (!email) {
      return setAlert({
        isEnable: true,
        variant: "error",
        title: "Validation Error",
        message: "Please enter your email address.",
      });
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        { email, role: "SubAdmin" }
      );
      setAlert({
        isEnable: true,
        variant: "success",
        title: "Success",
        message: res.data.message || "OTP sent to your email!",
      });
      setIsOTPFormVisible(true);
      setResendTimer(60); // Start 1-min timer
    } catch (err: any) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: isResend ? "Resend OTP Error" : "Error",
        message: err.response?.data?.message || (isResend ? "Failed to resend OTP." : "Failed to send OTP."),
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleLogIn = async () => {
    clearAlert();

    if (!email || !otp) {
      return setAlert({
        isEnable: true,
        variant: "error",
        title: "Validation Error",
        message: "Please enter both email and OTP.",
      });
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-account`,
        { email, otp, role: "SubAdmin" }
      );

      setAlert({
        isEnable: true,
        variant: "success",
        title: "Success",
        message: res.data.message || "OTP verified successfully!",
      });

      // Store token in localStorage
      if (res.data.token) {
        localStorage.setItem("sub-admin-token", res.data.token);
      }

      // Navigate to dashboard
      setTimeout(() => navigate("/sub-admin"), 1000);
    } catch (err: any) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "OTP Verification Failed",
        message:
          err.response?.data?.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-4">
            {alert.isEnable && (
              <Alert
                variant={alert.variant as any}
                title={alert.title}
                message={alert.message}
              />
            )}
          </div>

          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sub Admin Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to sign in!
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="info@gmail.com"
                name="email"
                value={email}
                disabled={loading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearAlert();
                }}
              />
            </div>

            <div className={`${isOTPFieldsVisible ? "block" : "hidden"}`}>
              <Label>
                OTP <span className="text-error-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="Enter OTP"
                name="otp"
                value={otp}
                disabled={loading}
                onChange={(e) => {
                  setOTP(e.target.value);
                  clearAlert();
                }}
              />
            </div>

            {/* Button Group */}
            <div className="flex gap-2 flex-col">
              {/* If OTP requested already, show verify and resend controls */}
              {isOTPFieldsVisible ? (
                <>
                  <Button onClick={handleLogIn} className="w-full" size="sm" disabled={loading}>
                    Verify & Sign In
                  </Button>
                  <Button
                    onClick={() => handleSendOTP(true)}
                    className="w-full"
                    size="sm"
                    variant="outline"
                    disabled={resendTimer > 0 || loading}
                  >
                    {resendTimer > 0
                      ? `Resend OTP (${resendTimer}s)`
                      : "Resend OTP"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleSendOTP(false)} className="w-full" size="sm" disabled={loading}>
                  Get OTP
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

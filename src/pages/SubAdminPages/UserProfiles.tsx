import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { UserCircleIcon } from "../../icons";

// --------- Types ---------
type Profile = {
  name?: string;
  email?: string;
  phoneNo?: string;
  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    bio?: string;
  };
};

type PasswordUpdateModalProps = {
  onClose: () => void;
  otpSent: boolean;
  otpValue: string;
  setOtpValue: (v: string) => void;
  newPwd: string;
  setNewPwd: (v: string) => void;
  confirmPwd: string;
  setConfirmPwd: (v: string) => void;
  otpError: string | null;
  otpSuccess: string | null;
  pwdUpdateError: string | null;
  pwdUpdateSuccess: string | null;
  otpSending: boolean;
  pwdUpdateLoading: boolean;
  handleSendPwdOtp: () => void;
  handleSubmitPwdUpdate: (e: React.FormEvent) => void;
  setShowPwdModal: (show: boolean) => void;
};


  // --------- Modal Dialog for Password Change ---------
  function PasswordUpdateModal({
    onClose,
    otpSent,
    otpValue,
    setOtpValue,
    newPwd,
    setNewPwd,
    confirmPwd,
    setConfirmPwd,
    otpError,
    otpSuccess,
    pwdUpdateError,
    pwdUpdateSuccess,
    otpSending,
    pwdUpdateLoading,
    handleSendPwdOtp,
    handleSubmitPwdUpdate,
    setShowPwdModal
  }: PasswordUpdateModalProps) {
    return (
      <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
            onClick={() => setShowPwdModal(false)}
            type="button"
          >
            &times;
          </button>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            {otpSent ? "Set New Password" : "Update Password"}
          </h2>
          {!otpSent ? (
            <>
              <p className="mb-3 text-sm text-gray-600">
                Request an OTP to your registered email to update your password.
              </p>
              {otpError && (
                <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded mb-3 text-sm">
                  {otpError}
                </div>
              )}
              {otpSuccess && (
                <div className="bg-green-100 text-green-700 border border-green-300 p-2 rounded mb-3 text-sm">
                  {otpSuccess}
                </div>
              )}
              <button
                className="px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 disabled:opacity-60"
                onClick={handleSendPwdOtp}
                type="button"
                disabled={otpSending}
              >
                {otpSending ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmitPwdUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-1 font-medium text-gray-700 dark:text-white/80 text-sm"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/, ""))}
                  maxLength={6}
                  minLength={6}
                  className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                />
              </div>
              <div>
                <label
                  htmlFor="newPwd"
                  className="block mb-1 font-medium text-gray-700 dark:text-white/80 text-sm"
                >
                  New Password
                </label>
                <input
                  id="newPwd"
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  minLength={6}
                  className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPwd"
                  className="block mb-1 font-medium text-gray-700 dark:text-white/80 text-sm"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPwd"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  minLength={6}
                  className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring"
                  required
                  autoComplete="new-password"
                />
              </div>
              {pwdUpdateError && (
                <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-sm">
                  {pwdUpdateError}
                </div>
              )}
              {pwdUpdateSuccess && (
                <div className="bg-green-100 text-green-700 border border-green-300 p-2 rounded text-sm">
                  {pwdUpdateSuccess}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 disabled:opacity-60"
                  disabled={pwdUpdateLoading}
                >
                  {pwdUpdateLoading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                  onClick={() => setShowPwdModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

// --------- Main Component ---------
export default function SubAdminUserProfiles() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For password update
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  const [otpValue, setOtpValue] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdUpdateLoading, setPwdUpdateLoading] = useState(false);
  const [pwdUpdateError, setPwdUpdateError] = useState<string | null>(null);
  const [pwdUpdateSuccess, setPwdUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("sub-admin-token");
        const apiRoute = "/api/sub-admin/get-profile-details";

        if (!token) {
          setError("No sub-admin token found.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || ""}${apiRoute}`,
          {
            headers: { Authorization: token },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile.");
        }

        setProfile(data.profile || data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --------- Password Update Handlers ---------
  // 1. Send OTP
  async function handleSendPwdOtp() {
    setOtpSending(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const token = localStorage.getItem("sub-admin-token");
      if (!token) {
        setOtpError("No sub-admin token found.");
        setOtpSending(false);
        return;
      }
      const apiRoute = "/api/sub-admin/send-set-password-otp";
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}${apiRoute}`, {
        method: "POST",
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }
      setOtpSuccess(
        "OTP sent successfully to your registered email."
      );
      setOtpSent(true);
    } catch (err: any) {
      setOtpError(err.message || "Failed to send OTP.");
      setOtpSent(false);
    } finally {
      setOtpSending(false);
    }
  }

  // 2. Set or update password
  async function handleSubmitPwdUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPwdUpdateLoading(true);
    setPwdUpdateError(null);
    setPwdUpdateSuccess(null);

    if (!otpValue.trim() || !newPwd.trim() || !confirmPwd.trim()) {
      setPwdUpdateError("All fields are required.");
      setPwdUpdateLoading(false);
      return;
    }
    if (newPwd.length < 6) {
      setPwdUpdateError("Password must be at least 6 characters.");
      setPwdUpdateLoading(false);
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdUpdateError("Passwords do not match.");
      setPwdUpdateLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("sub-admin-token");
      if (!token) {
        setPwdUpdateError("No sub-admin token found.");
        setPwdUpdateLoading(false);
        return;
      }
      const apiRoute = "/api/sub-admin/set-or-update-password";
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}${apiRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          passwordOtp: otpValue,
          newPassword: newPwd,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setPwdUpdateSuccess("Password updated successfully.");
      setPwdUpdateError(null);
      setOtpValue("");
      setNewPwd("");
      setConfirmPwd("");
      setOtpSent(false);
      setShowPwdModal(false);
      // Optionally, show a nice toast or redirect to login if you want user to re-authenticate.
    } catch (err: any) {
      setPwdUpdateError(err.message || "Failed to update password.");
    } finally {
      setPwdUpdateLoading(false);
    }
  }



  return (
    <>
      <PageMeta
        title="Dairy Management"
        description="Admin and Sub-Admin Panel for Dairy Management"
      />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-between items-start">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile
          </h3>
          {/* Password change button (sub-admin only, always visible) */}
          <button
            className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-60"
            onClick={() => {
              setShowPwdModal(true);
              setOtpSent(false);
              setOtpError(null);
              setOtpSuccess(null);
              setOtpValue("");
              setNewPwd("");
              setConfirmPwd("");
              setPwdUpdateError(null);
              setPwdUpdateSuccess(null);
            }}
          >
            Update Password
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="w-8 h-8 border-4 border-t-brand-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 mb-6 text-red-600 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                  <div className="w-20 h-20 flex items-center justify-center overflow-hidden border border-gray-200 rounded-full bg-gray-100 dark:border-gray-800">
                    <UserCircleIcon className="h-20 w-20 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-center xl:text-left text-gray-800 dark:text-white/90">
                      {profile.name || <span className="text-gray-400">No Name</span>}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profile.name || <span className="text-gray-400">-</span>}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profile.email || <span className="text-gray-400">-</span>}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profile.phoneNo || <span className="text-gray-400">-</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Address
              </h4>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Address Line</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profile.address?.addressLine || <span className="text-gray-400">-</span>}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">City</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profile.address?.city || <span className="text-gray-400">-</span>}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">State</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profile.address?.state || <span className="text-gray-400">-</span>}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Pincode</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profile.address?.pincode || <span className="text-gray-400">-</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No profile details found.</div>
        )}
      </div>
      {/* {showPwdModal && <PasswordUpdateModal />} */}
      {showPwdModal && (
  <PasswordUpdateModal
    onClose={() => setShowPwdModal(false)}
    otpSent={otpSent}
    otpValue={otpValue}
    setOtpValue={setOtpValue}
    newPwd={newPwd}
    setNewPwd={setNewPwd}
    confirmPwd={confirmPwd}
    setConfirmPwd={setConfirmPwd}
    otpError={otpError}
    otpSuccess={otpSuccess}
    pwdUpdateError={pwdUpdateError}
    pwdUpdateSuccess={pwdUpdateSuccess}
    otpSending={otpSending}
    pwdUpdateLoading={pwdUpdateLoading}
    handleSendPwdOtp={handleSendPwdOtp}
    handleSubmitPwdUpdate={handleSubmitPwdUpdate}
    setShowPwdModal={setShowPwdModal}
  />
)}

    </>
  );
}

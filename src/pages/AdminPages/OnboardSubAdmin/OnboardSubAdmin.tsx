import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { EnvelopeIcon, UserCircleIcon } from "../../../icons";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

const countries = [
  { code: "IN", label: "+91" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
];

// Define the type for the error state to ensure variant is one of the allowed types
interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

const OnboardSubAdmin = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [phoneNo, setPhoneNo] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  // New state variables for address fields
  const [addressLine, setAddressLine] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [pinCode, setPinCode] = useState<string | undefined>(undefined);

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false, // Initially disabled, only show when an alert occurs
    variant: "info", // Default variant, will be overridden on alert
    title: "",
    message: "",
  });

  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
    setPhoneNo(phoneNumber);
  };

  const handleOnboardSubAdmin = async () => {
    // Clear any previous alert messages at the start of a new submission attempt
    setAlert({
      isEnable: false,
      variant: "info",
      title: "",
      message: "",
    });

    if (!name) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Name",
        message: "Please enter the Sub Admin's name.",
      });
      return;
    }

    if (!email) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Email",
        message: "Please enter the Sub Admin's email.",
      });
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!phoneNo) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Phone Number",
        message: "Please enter the Sub Admin's phone number.",
      });
      return;
    }

    // Assuming phoneNo includes country code and is 13 chars long, e.g., +911234567890
    if (phoneNo.length !== 13) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Invalid Phone Number",
        message:
          "Phone number must be 10 digits long (including country code, e.g., +91XXXXXXXXXX).",
      });
      return;
    }

    // Address field validations
    if (!addressLine) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Address Line",
        message: "Please enter the Sub Admin's address line.",
      });
      return;
    }

    if (!city) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing City",
        message: "Please enter the Sub Admin's city.",
      });
      return;
    }

    if (!state) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing State",
        message: "Please enter the Sub Admin's state.",
      });
      return;
    }

    if (!pinCode) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Pin Code",
        message: "Please enter the Sub Admin's pin code.",
      });
      return;
    }

    // Basic pin code validation (e.g., 6 digits for India, adjust as needed)
    const pinCodeRegex = /^\d{6}$/;
    if (!pinCodeRegex.test(pinCode)) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Invalid Pin Code",
        message: "Please enter a valid 6-digit pin code.",
      });
      return;
    }

    // If all validations pass
    console.log("Sub-admin data is valid:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone No:", phoneNo);
    console.log("Address Line:", addressLine);
    console.log("City:", city);
    console.log("State:", state);
    console.log("Pin Code:", pinCode);

    // Here you would typically make an API call to onboard the sub-admin
    // For example:
    // try {
    //   const response = await fetch('/api/onboard-sub-admin', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ name, email, phoneNo, addressLine, city, state, pinCode }), // Updated body
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setAlert({
    //       isEnable: true,
    //       variant: "success",
    //       title: "Success",
    //       message: "Sub-admin onboarded successfully!",
    //     });
    //     // Optionally clear form or redirect
    //   } else {
    //     setAlert({
    //       isEnable: true,
    //       variant: "error",
    //       title: "Onboarding Failed",
    //       message: `Failed to onboard sub-admin: ${data.message || response.statusText}`,
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error onboarding sub-admin:", error);
    //   setAlert({
    //     isEnable: true,
    //     variant: "error",
    //     title: "Network Error",
    //     message: "An error occurred while onboarding the sub-admin. Please try again.",
    //   });
    // }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Onboard Sub Admin" />
      <div className="space-y-6">
        <ComponentCard title="Fill Sub Admin Details">
          {alert.isEnable && (
            <Alert
              variant={alert.variant as any}
              title={alert.title}
              message={alert.message}
            />
          )}
          <div>
            <Label>Name</Label>
            <div className="relative">
              <Input
                placeholder="John Doe"
                type="text"
                className="pl-[62px]"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <UserCircleIcon className="size-6" />
              </span>
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Input
                placeholder="info@gmail.com"
                type="text"
                className="pl-[62px]"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <EnvelopeIcon className="size-6" />
              </span>
            </div>
          </div>
          <div>
            <Label>Phone</Label>
            <PhoneInput
              selectPosition="start"
              countries={countries}
              placeholder="+1 (555) 000-0000"
              onChange={handlePhoneNumberChange}
            />
          </div>{" "}
          {/* New Address Fields */}
          <div>
            <Label>Address Line</Label>
            <div className="relative">
              <Input
                placeholder="123 Main St"
                type="text"
                name="addressLine"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>City</Label>
            <div className="relative">
              <Input
                placeholder="Anytown"
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>State</Label>
            <div className="relative">
              <Input
                placeholder="Anystate"
                type="text"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Pin Code</Label>
            <div className="relative">
              <Input
                placeholder="123456"
                type="text"
                name="pinCode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleOnboardSubAdmin}>
            Handle Onboard Sub Admin
          </Button>
        </ComponentCard>
      </div>
    </div>
  );
};

export default OnboardSubAdmin;

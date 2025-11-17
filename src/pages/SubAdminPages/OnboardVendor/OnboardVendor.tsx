import { useState, useEffect } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { EnvelopeIcon, UserCircleIcon } from "../../../icons";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axios from "axios";

const countries = [
  { code: "IN", label: "+91" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
];

interface RouteType {
  _id: string;
  route: string | number; // route can be string or number
}

// Define the type for the error state to ensure variant is one of the allowed types
interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

const OnboardVendor = () => {
  const [vendorCode, setVendorCode] = useState<string | undefined>(undefined);

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [phoneNo, setPhoneNo] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  const [addressLine, setAddressLine] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [pinCode, setPinCode] = useState<string | undefined>(undefined);
  // Store route as string temporarily for the select value, but allow string | number
  const [route, setRoute] = useState<string | number | undefined>(undefined);

  const [routesOptions, setRoutesOptions] = useState<RouteType[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoadingRoutes(true);
      try {
        const token = localStorage.getItem("sub-admin-token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sub-admin/get-all-routes`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // The fetched routes are in response.data.routes
        if (response.status === 200 && Array.isArray(response.data.routes)) {
          setRoutesOptions(response.data.routes);
        } else {
          setRoutesOptions([]);
        }
      } catch (error: any) {
        setRoutesOptions([]);
      }
      setLoadingRoutes(false);
    };
    fetchRoutes();
  }, []);

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setPhoneNo(phoneNumber);
  };

  const handleOnboardVendor = async () => {
    setAlert({
      isEnable: false,
      variant: "info",
      title: "",
      message: "",
    });

    if (!vendorCode) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Vendor Code",
        message: "Please enter the Vendor Code.",
      });
      return;
    }

    const vendorCodeRegex = /^\d{6}$/;
    if (!vendorCodeRegex.test(vendorCode)) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Invalid Vendor Code",
        message: "Please enter a valid 6-digit Vendor Code.",
      });
      return;
    }

    if (!name) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Name",
        message: "Please enter the Vendor's name.",
      });
      return;
    }

    if (!email) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Email",
        message: "Please enter the Vendor's email.",
      });
      return;
    }

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
        message: "Please enter the Vendor's phone number.",
      });
      return;
    }

    if (phoneNo.length !== 13) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Invalid Phone Number",
        message:
          "Phone number must be 10 digits long (excluding country code, e.g., +91XXXXXXXXXX).",
      });
      return;
    }

    if (!addressLine) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Address Line",
        message: "Please enter the Vendor's address line.",
      });
      return;
    }

    if (!city) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing City",
        message: "Please enter the Vendor's city.",
      });
      return;
    }

    if (!state) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing State",
        message: "Please enter the Vendor's state.",
      });
      return;
    }

    if (!pinCode) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Pin Code",
        message: "Please enter the Vendor's pin code.",
      });
      return;
    }

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

    // Route field validation (must select a route from the dropdown)
    if (
      route === undefined ||
      route === "" ||
      // If route is number, fine. If string check if not empty string.
      (typeof route === "string" && route.trim() === "")
    ) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Route",
        message: "Please select the Vendor's route.",
      });
      return;
    }

    // No need to coerce to number, but if it's a string and can be represented as a number, keep it as string. Let backend handle either.
    let routeValue: string | number;
    if (typeof route === "string" && !isNaN(Number(route))) {
      // If the user selected a route that is "123", let it be as string or number as the backend accepts both
      routeValue = route;
    } else {
      routeValue = route;
    }

    try {
      const token = localStorage.getItem("sub-admin-token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/sub-admin/onboard-vendor`,
        {
          vendorId: vendorCode, // backend expects vendorId
          name,
          email,
          phoneNumber: phoneNo,
          addressLine,
          city,
          state,
          pincode: pinCode,
          // Pass route as string or number
          route: routeValue,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setAlert({
          isEnable: true,
          variant: "success",
          title: "Success",
          message: response.data.message || "Vendor onboarded successfully!",
        });

        // Optionally clear form after success
        setVendorCode("");
        setName("");
        setEmail("");
        setPhoneNo("");
        setAddressLine("");
        setCity("");
        setState("");
        setPinCode("");
        setRoute("");
      }
    } catch (error: any) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while onboarding the vendor.";
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Onboarding Failed",
        message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Onboard Vendor" />
      <div className="space-y-6">
        <ComponentCard title="Fill Vendor Details">
          {alert.isEnable && (
            <Alert
              variant={alert.variant as any}
              title={alert.title}
              message={alert.message}
            />
          )}
          <div>
            <Label>Vendor Code</Label>
            <div className="relative">
              <Input
                placeholder="e.g., 123456"
                type="text"
                name="vendorCode"
                value={vendorCode}
                onChange={(e) => setVendorCode(e.target.value)}
              />
            </div>
          </div>
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
          </div>
          <div>
            <Label>Route</Label>
            <div className="relative">
              <select
                name="route"
                value={route === undefined ? "" : route}
                onChange={(e) => {
                  // Accept string or number
                  const val = e.target.value;
                  setRoute(val);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loadingRoutes}
              >
                <option value="">Select a Route</option>
                {routesOptions.map((routeOption) => (
                  <option key={routeOption._id} value={routeOption.route}>
                    {routeOption.route}
                  </option>
                ))}
              </select>
              {loadingRoutes && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-700 opacity-70">
                  Loading...
                </span>
              )}
            </div>
          </div>
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
          <Button onClick={handleOnboardVendor}>Handle Onboard Vendor</Button>
        </ComponentCard>
      </div>
    </div>
  );
};

export default OnboardVendor;

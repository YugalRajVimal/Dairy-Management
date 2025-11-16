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



interface MultiSelectOption {
  label: string;
  value: number | string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: (number | string)[];
  onChange: (val: (number | string)[]) => void;
  placeholder?: string;
}

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: MultiSelectProps) => {
  // Show selected chip tags for visual feedback
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => {
      // Try to maintain number type if possible
      const found = options.find(o => String(o.value) === opt.value);
      return found ? found.value : opt.value;
    });
    onChange(selected);
  };

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  return (
    <div>
      {/* Selected chips */}
      <div className="flex flex-wrap gap-2 mb-1 min-h-[1.5rem]">
        {selectedOptions.length === 0 && (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}
        {selectedOptions.map(opt => (
          <span
            key={opt.value}
            className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium mr-1"
          >
            {opt.label}
            <button
              type="button"
              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label={`Remove ${opt.label}`}
              onClick={() =>
                onChange(value.filter(v => v !== opt.value))
              }
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <select
          multiple
          value={value.map(String)}
          onChange={handleSelectChange}
          className="w-full border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 rounded px-4 py-2 bg-white appearance-none transition-shadow"
          size={Math.min(6, Math.max(options.length, 2))}
        >
          {options.length === 0 ? (
            <option disabled value="">
              No routes available
            </option>
          ) : (
            options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <svg width="16" height="16" fill="none" className="mt-1">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Hold <kbd className="px-1 py-0.5 bg-gray-100 rounded border text-xs font-mono">Ctrl</kbd> ( <kbd>Cmd</kbd> on Mac ) to select multiple routes.
      </div>
    </div>
  );
};

const countries = [
  { code: "IN", label: "+91" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
];

interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

const OnboardSupervisor = () => {
  const [supervisorCode, setsupervisorCode] = useState<string | undefined>(
    undefined
  );

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [phoneNo, setPhoneNo] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [addressLine, setAddressLine] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [pinCode, setPinCode] = useState<string | undefined>(undefined);

  // Updated: Route is now an array of numbers.
  const [routes, setRoutes] = useState<number[]>([]);
  const [routesOptions, setRoutesOptions] = useState<
    { value: number; label: string }[]
  >([]);
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
        // response.data.routes should be array of routes
        if (response.status === 200 && Array.isArray(response.data.routes)) {
          // Expecting routeNo or _id or number property, adapt below as needed
          setRoutesOptions(
            response.data.routes.map((route: any) => ({
              value: route.route,
              label: route.route
                ? `Route ${route.route}`
                : String(route.route ?? route._id ?? route.route),
            }))
          );
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

  // Helper: for the Route dropdown to only store numbers in state:
  const handleRoutesChange = (selected: (string | number)[]) => {
    // all values in routesOptions.value are numbers or strings of numbers, so map to numbers
    const numericValues: number[] = selected
      .map((val) => (typeof val === "number" ? val : Number(val)))
      // filter NaN or empty
      .filter((val): val is number => typeof val === "number" && !isNaN(val));
    setRoutes(numericValues);
  };

  const handleOnboardSupervisor = async () => {
    console.log(routes);

    setAlert({
      isEnable: false,
      variant: "info",
      title: "",
      message: "",
    });

    // Supervisor Code validation
    if (!supervisorCode) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Supervisor Code",
        message: "Please enter the Supervisor Code.",
      });
      return;
    }

    const supervisorCodeRegex = /^\d{6}$/;
    if (!supervisorCodeRegex.test(supervisorCode)) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Invalid Supervisor Code",
        message: "Please enter a valid 6-digit Supervisor Code.",
      });
      return;
    }

    if (!name) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Name",
        message: "Please enter the Supervisor's name.",
      });
      return;
    }

    if (!email) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Email",
        message: "Please enter the Supervisor's email.",
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
        message: "Please enter the Supervisor's phone number.",
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
        message: "Please enter the Supervisor's address line.",
      });
      return;
    }

    if (!city) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing City",
        message: "Please enter the Supervisor's city.",
      });
      return;
    }

    if (!state) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing State",
        message: "Please enter the Supervisor's state.",
      });
      return;
    }

    if (!pinCode) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Pin Code",
        message: "Please enter the Supervisor's pin code.",
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

    // Route is now required to have at least one selected option
    if (!routes || routes.length === 0) {
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Missing Route(s)",
        message: "Please select at least one route for the Supervisor.",
      });
      return;
    }

    // All validations pass
    try {
      const token = localStorage.getItem("sub-admin-token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/sub-admin/onboard-supervisor`,
        {
          supervisorId: supervisorCode,
          name,
          email,
          phoneNumber: phoneNo,
          addressLine,
          city,
          state,
          pincode: pinCode,
          routes, // Now an array of numbers
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
          message:
            response.data.message || "Supervisor onboarded successfully!",
        });

        setsupervisorCode("");
        setName("");
        setEmail("");
        setPhoneNo("");
        setAddressLine("");
        setCity("");
        setState("");
        setPinCode("");
        setRoutes([]); // Clear multi-select
      }
    } catch (error: any) {
      console.error("Error onboarding Supervisor:", error);

      let message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while onboarding the Supervisor.";

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
      <PageBreadcrumb pageTitle="Onboard Supervisor" />
      <div className="space-y-6">
        <ComponentCard title="Fill Supervisor Details">
          {alert.isEnable && (
            <Alert
              variant={alert.variant as any}
              title={alert.title}
              message={alert.message}
            />
          )}
          <div>
            <Label>Supervisor Code</Label>
            <div className="relative">
              <Input
                placeholder="e.g., 123456"
                type="text"
                name="supervisorCode"
                value={supervisorCode}
                onChange={(e) => setsupervisorCode(e.target.value)}
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
          {/* Route Field - Multi Select Dropdown */}
          <div>
            <Label>Route</Label>
            {loadingRoutes ? (
              <p>Loading routes...</p>
            ) : (
              <MultiSelect
                options={routesOptions}
                value={routes}
                onChange={handleRoutesChange}
                placeholder="Select route(s)..."
              />
            )}
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
          <Button onClick={handleOnboardSupervisor}>
            Handle Onboard Supervisor
          </Button>
        </ComponentCard>
      </div>
    </div>
  );
};

export default OnboardSupervisor;

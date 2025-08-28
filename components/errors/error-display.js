import { AlertCircle, WifiOff, Search, AlertTriangle } from "lucide-react";

export function ErrorDisplayComponent({ error }) {
  // Default error state
  let title = "An error occurred";
  let message = "Please try again later";
  let icon = AlertCircle;
  let variant = "error"; // error, warning, info

  // Handle different error types
  if (error instanceof Error) {
    switch (error.name) {
      case "NetworkError":
        title = "Connection Error";
        message = error.message || "Unable to connect to the server. Please check your internet connection.";
        icon = WifiOff;
        break;
      case "NoResultsError":
        title = "No Results Found";
        message = "We couldn't find the information you're looking for.";
        icon = Search;
        variant = "warning";
        break;
      case "ApiError":
        title = "Service Error";
        message = error.message || "There was a problem with the service.";
        if (error.status === 401 || error.status === 403) {
          message = "You don't have permission to access this resource.";
        } else if (error.status === 404) {
          message = "The requested resource was not found.";
        }
        break;
      case "ValidationError":
        title = "Invalid Input";
        message = error.message || "Please check your input and try again.";
        icon = AlertTriangle;
        variant = "warning";
        break;
    }
  }

  const variantStyles = {
    error: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const IconComponent = icon;

  return (
    <div className={`p-4 rounded-lg border ${variantStyles[variant]} flex items-start gap-3`}>
      <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
} 
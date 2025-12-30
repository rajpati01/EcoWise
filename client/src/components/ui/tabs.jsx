import { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Context for Tabs
const TabsContext = createContext(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component");
  }
  return context;
};

// Root Tabs Component
const Tabs = ({ defaultValue, value: controlledValue, onValueChange, className, children, ...props }) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList Component
const TabsList = ({ className, children, ...props }) => {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TabsList.displayName = "TabsList";

// TabsTrigger Component
const TabsTrigger = ({ className, value, disabled, children, ...props }) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isActive = selectedValue === value;
  const buttonRef = useRef(null);

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    // Handle keyboard navigation
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onValueChange(value);
    }
  };

  useEffect(() => {
    // Set initial focus if this tab is active and no other element is focused
    if (isActive && buttonRef.current && document.activeElement === document.body) {
      buttonRef.current.focus();
    }
  }, [isActive]);

  return (
    <button
      ref={buttonRef}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-background text-foreground shadow-sm",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
};
TabsTrigger.displayName = "TabsTrigger";

// TabsContent Component
const TabsContent = ({ className, value, children, forceMount, ...props }) => {
  const { value: selectedValue } = useTabsContext();
  const isActive = selectedValue === value;
  const contentRef = useRef(null);

  useEffect(() => {
    // Set focus to content when tab becomes active
    if (isActive && contentRef.current) {
      const focusableElement = contentRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  }, [isActive]);

  // Don't render if not active and not force mounted
  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      hidden={!isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        !isActive && forceMount && "hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
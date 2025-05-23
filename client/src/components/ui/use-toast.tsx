import * as React from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [toasts, setToasts] = React.useState<(ToastProps & {id: number})[]>([]);
  const toastCounter = React.useRef(0);
  
  const toast = React.useCallback((props: ToastProps) => {
    const id = toastCounter.current++;
    setToasts((currentToasts) => [...currentToasts, { ...props, id }]);
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter(t => t.id !== id));
    }, props.duration || 3000);
  }, []);
  
  const removeToast = React.useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter(t => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast container positioned at the bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`rounded-md p-4 shadow-md text-white transition-all duration-300 
              ${toast.variant === "destructive" ? "bg-destructive" : "bg-primary"}`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.title && <h4 className="font-medium">{toast.title}</h4>}
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const toast = (props: ToastProps) => {
  // For direct usage without the hook
  // Find an existing Toast container, or create one if none exists
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toastElement = document.createElement('div');
  toastElement.className = `rounded-md p-4 shadow-md text-white transition-all duration-300 
    ${props.variant === "destructive" ? "bg-destructive" : "bg-primary"}`;
  
  // Add title and description
  if (props.title) {
    const titleElement = document.createElement('h4');
    titleElement.className = 'font-medium';
    titleElement.textContent = props.title;
    toastElement.appendChild(titleElement);
  }
  
  if (props.description) {
    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'text-sm opacity-90';
    descriptionElement.textContent = props.description;
    toastElement.appendChild(descriptionElement);
  }
  
  // Add to container
  toastContainer.appendChild(toastElement);
  
  // Remove after duration
  setTimeout(() => {
    if (toastElement.parentNode) {
      toastElement.parentNode.removeChild(toastElement);
    }
  }, props.duration || 3000);
};
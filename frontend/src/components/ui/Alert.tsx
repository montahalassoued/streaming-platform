import { ReactNode } from "react";

interface AlertProps {
  type: "error" | "success" | "info";
  children: ReactNode;
}

const styles = {
  error: "bg-red-900/40 border-red-700 text-red-300",
  success: "bg-green-900/40 border-green-700 text-green-300",
  info: "bg-blue-900/40 border-blue-700 text-blue-300",
};

export default function Alert({ type, children }: AlertProps) {
  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}

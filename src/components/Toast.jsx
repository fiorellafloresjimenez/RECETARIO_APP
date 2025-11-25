import { useEffect, useState } from "react";

export default function Toast({ message = "", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div style={toastStyle}>
      {message}
    </div>
  );
}

const toastStyle = {
  position: "fixed",
  top: 20,
  right: 20,
  background: "#333",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  zIndex: 9999,
  fontSize: 14,
};

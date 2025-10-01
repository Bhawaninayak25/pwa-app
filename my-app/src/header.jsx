import React, { useEffect, useState } from "react";

export default function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <h2>My PWA App</h2>

      {/* Online/Offline Indicator */}
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: isOnline ? "green" : "red",
          marginRight: "10px",
        }}
        title={isOnline ? "Online" : "Offline"}
      ></div>
    </header>
  );
}

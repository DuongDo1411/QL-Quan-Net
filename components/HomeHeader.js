import { useState, useEffect } from "react";

export default function HomeHeader() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  return (
    <div className="text-blue-900 flex justify-between">
      <h2 className=" h-auto justify-center flex bg-gradient-to-r items-center from-blue-500 via-teal-500 to-pink-500 bg-clip-text font-extrabold text-transparent text-center select-auto">
        <div className="flex gap-2 items-center">
          <div>
            Hello <b>{session?.username}</b>
          </div>
        </div>
      </h2>
    </div>
  );
}

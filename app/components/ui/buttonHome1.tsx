"use client";
import { useRouter } from "next/navigation";
const buttonHome1 = () => {
  const router = useRouter();

  const handleReportClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      router.push("/civilian");
    } else {
      router.push("/login");
    }
  };
  return (
    <button
      onClick={handleReportClick}
      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
    >
      Report a Pothole
    </button>
  );
};

export default buttonHome1;

"use client";
import { useRouter } from "next/navigation";
const buttonHome2 = () => {
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
      className="bg-white hover:bg-gray-100 text-orange-600 font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
      onClick={handleReportClick}
    >
      Report Your First Pothole
    </button>
  );
};

export default buttonHome2;

export const getDangerLevelConfig = (dangerLevel) => {
  switch (dangerLevel) {
    case "SAFE":
      return {
        bg:     "bg-green-50",
        border: "border-green-300",
        text:   "text-green-700",
        badge:  "bg-green-100 text-green-800",
        label:  "An toàn",
        dot:    "#22c55e",
      };
    case "MODERATE":
      return {
        bg:     "bg-yellow-50",
        border: "border-yellow-300",
        text:   "text-yellow-700",
        badge:  "bg-yellow-100 text-yellow-800",
        label:  "Trung bình",
        dot:    "#eab308",
      };
    case "DANGEROUS":
      return {
        bg:     "bg-red-50",
        border: "border-red-300",
        text:   "text-red-700",
        badge:  "bg-red-100 text-red-800",
        label:  "Nguy hiểm",
        dot:    "#ef4444",
      };
    case "EXTREME":
      return {
        bg:     "bg-purple-50",
        border: "border-purple-300",
        text:   "text-purple-700",
        badge:  "bg-purple-100 text-purple-800",
        label:  "Cực kỳ nguy hiểm",
        dot:    "#a855f7",
      };
    default:
      return getDangerLevelConfig("SAFE");
  }
};
import { getRecommendedStatements } from "@/api/statements";
import { shorten } from "@/utils/text.utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecommendedTales() {
  const [statements, setStatements] = useState<api.Statement[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRecommendedStatements()
      .then(setStatements)
      .catch(() => console.error("Failed to fetch recommended statements"));
  }, []);

  const goToStatement = (id: number) => {
    router.push(`/tale/${id}`);
  };

  if (statements.length <= 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 text-center">
      <h2 className="text-3xl text-center">
        Or continue an unfinished tale...
      </h2>
      <div className="w-full flex justify-center gap-4 flex-wrap">
        {statements.map((statement, index) => (
          <div
            className="p-4 rounded-md bg-secondary cursor-pointer hover:opacity-80 hover:scale-110 transition-all duration-300"
            key={index}
            onClick={goToStatement.bind(null, statement.id)}
          >
            <span>{shorten(statement.text, 24)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

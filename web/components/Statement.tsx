import { getStatementById } from "@/api/statements";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StatementProps {
  id: number;
}

export default function Statement(props: StatementProps) {
  const [statement, setStatement] = useState<api.Statement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!props.id) return;
    getStatementById(props.id)
      .then(setStatement)
      .catch(() => router.push("/"));
  }, [props.id, router]);

  const goToStatement = () => {
    if (!statement) return;
    router.push(`/tale/${statement.id}`);
  };

  if (!statement) return <div>Loading...</div>;

  return (
    <div
      onClick={goToStatement}
      className="cursor-pointer hover:opacity-60 hover:scale-105 transition-all duration-500"
    >
      <h3 className="text-3xl font-bold text-primary">{statement.text}</h3>
    </div>
  );
}

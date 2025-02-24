"use client";
import {
  createStatement,
  getChildrenStatementsById,
  getStatementById,
} from "@/api/statements";
import ChildrenStatements from "@/components/ChildrenStatements";
import Statement from "@/components/Statement";
import TextInput from "@/components/TextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, use, useState, FormEvent, useMemo } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TaleById(props: PageProps) {
  const { id: rawId } = use(props.params);
  const id = useMemo(() => parseInt(rawId), [rawId]);
  const [statement, setStatement] = useState<api.Statement | null>(null);
  const [children, setChildren] = useState<api.Statement[]>([]);
  const [text, setText] = useState("");
  const isValid = useMemo(() => text.length > 0, [text]);
  const parentId = useMemo(() => statement && statement.parent_id, [statement]);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    getStatementById(id)
      .then(setStatement)
      .catch(() => router.push("/"));
    getChildrenStatementsById(id)
      .then(setChildren)
      .catch(() => router.push("/"));
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // Send the tale to the server
    try {
      const newStatement = await createStatement(text, id);
      if (!newStatement) throw new Error();
      setText("");
      router.push(`/tale/${newStatement.id}`);
    } catch {
      alert("Failed to publish tale");
    }
  };

  if (!statement) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <Link href="/" className="text-primary p-4">
        Start new tale
      </Link>
      <div className="flex-grow flex flex-col justify-center items-center gap-8 px-4 py-8">
        {parentId && <Statement id={parentId} />}
        <h1 className="text-5xl font-bold text-center">{statement.text}</h1>
        <form
          className="w-full flex flex-col justify-center items-center gap-2"
          onSubmit={handleSubmit}
        >
          <TextInput
            placeholder="Continue the tale..."
            value={text}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`bg-primary text-light py-2 px-8 rounded mt-2 transition-all duration-500 ${
              isValid ? "opacity-100" : "opacity-0"
            }`}
          >
            Publish continuation
          </button>
          <div className="w-full sm:w-2/3 lg:w-1/2 flex justify-center">
            {children.length > 0 && (
              <ChildrenStatements statements={children} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

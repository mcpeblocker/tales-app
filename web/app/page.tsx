"use client";
import { createStatement } from "@/api/statements";
import RecommendedTales from "@/components/RecommendedTales";
import TextInput from "@/components/TextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

export default function HomePage() {
  const [text, setText] = useState("");
  const isValid = useMemo(() => text.length > 0, [text]);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // Send the tale to the server
    try {
      const newStatement = await createStatement(text);
      if (!newStatement) throw new Error();
      setText("");
      router.push(`/tale/${newStatement.id}`);
    } catch {
      alert("Failed to publish tale");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="h-48 flex flex-col justify-center">
        <span className="text-center text-3xl font-semibold">Bored?</span>
        <h1 className="text-center text-5xl font-bold">Make your own tale!</h1>
      </div>
      {/* Tale initiator input */}
      <form
        className="flex flex-col justify-center items-center gap-2"
        onSubmit={handleSubmit}
      >
        <TextInput
          placeholder="Once upon a time..."
          value={text}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className={`bg-primary text-light py-2 px-8 rounded mt-2 transition-all duration-500 ${
            isValid ? "opacity-100" : "opacity-0"
          }`}
        >
          Publish
        </button>
      </form>
      {/* Recommended tales to continue */}
      <RecommendedTales />
      {/* Footer */}
      <div className="fixed bottom-0 bg-primary w-full text-center py-1">
        <span>
          Want to contribute? This is open-source on{" "}
          <Link
            className="text-blue-200 py-1"
            href="https://github.com/mcpeblocker/tales-app"
          >
            Github
          </Link>
          !
        </span>
      </div>
    </div>
  );
}

"use client";
import {
  createStatement,
  getChildrenStatementsById,
  getSiblingsStatementsById,
} from "@/api/statements";
import Swipable from "@/components/Swipable";
import TextInput from "@/components/TextInput";
import { getFontSizeByLength } from "@/utils/text.utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Direction } from "@/enums/Direction.enum";
import Link from "next/link";
import IndexIndicator from "@/components/IndexIndicator";

export default function FullscreenStatement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [childrenStatements, setChildrenStatements] = useState<api.Statement[]>(
    []
  );
  const [siblingStatements, setSiblingStatements] = useState<api.Statement[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("");
  const isValid = useMemo(() => text.length > 0, [text]);
  const statement = useMemo(() => {
    if (currentIndex < 0 || currentIndex >= siblingStatements.length) {
      return null;
    } else {
      return siblingStatements[currentIndex];
    }
  }, [currentIndex, siblingStatements]);
  const parentId = useMemo(() => statement && statement.parent_id, [statement]);
  const contentText = useMemo(
    () => (statement ? statement.text : ""),
    [statement]
  );
  const fontSize = useMemo(
    () => getFontSizeByLength(contentText.length),
    [contentText]
  );

  useEffect(() => {
    if (!id) return;
    const parsedId = parseInt(id);
    Promise.all([
      getChildrenStatementsById(parsedId).then(setChildrenStatements),
      getSiblingsStatementsById(parsedId).then(setSiblingStatements),
    ]).catch(() => {});
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    const parsedId = parseInt(id);
    const index = siblingStatements.findIndex((s) => s.id === parsedId);
    if (index >= 0) {
      setCurrentIndex(index);
    } else {
      setCurrentIndex(0);
    }
  }, [id, siblingStatements]);

  const handlePrev = () => {
    if (!id) return;
    const prevId = parentId;
    if (prevId) {
      replaceId(prevId);
    }
  };
  const handleNext = () => {
    if (!id) return;
    const nextId = childrenStatements[0]?.id;
    if (nextId) {
      replaceId(nextId);
    }
  };
  const handlePrevSibling = () => {
    if (currentIndex === null || currentIndex <= 0) return;
    replaceId(siblingStatements[currentIndex - 1].id);
  };
  const handleNextSibling = () => {
    if (currentIndex === null || currentIndex >= siblingStatements.length - 1)
      return;
    replaceId(siblingStatements[currentIndex + 1].id);
  };
  const canSwipe = (direction: Direction): boolean => {
    switch (direction) {
      case Direction.UP:
        // Can't go to next if there's no children
        if (childrenStatements.length <= 0) return false;
        break;
      case Direction.DOWN:
        // Can't go up if there's no parent_id
        if (!parentId) return false;
        break;
      case Direction.LEFT:
        // Can't go right if there's no right sibling
        if (
          currentIndex === null ||
          currentIndex >= siblingStatements.length - 1
        )
          return false;
        break;
      case Direction.RIGHT:
        // Can't go left if there's no left sibling
        if (currentIndex === null || currentIndex === 0) return false;
        break;
    }
    return true;
  };

  const replaceId = useCallback(
    (newId: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("id", newId.toString());
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!isValid) return;
    // Send the statement to the server
    try {
      const newStatement = await createStatement(text, parseInt(id));
      if (!newStatement) throw new Error();
      setText("");
      replaceId(newStatement.id);
    } catch {
      alert("Failed to publish tale");
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full h-screen flex flex-col justify-center items-center py-2 px-4">
        <Swipable
          onDown={handlePrev}
          onUp={handleNext}
          onLeft={handleNextSibling}
          onRight={handlePrevSibling}
          canSwipe={canSwipe}
        >
          <div className="flex-1 flex flex-col items-center gap-8 px-4 py-8">
            <Link href="/" className="text-primary p-4">
              Start new tale
            </Link>
            <IndexIndicator
              index={currentIndex ?? 0}
              total={siblingStatements.length}
            />
            <div className="flex-grow flex justify-center items-center">
              <h3
                className="flex-grow  font-bold text-center text-wrap"
                style={{ fontSize }}
              >
                {statement?.text ?? ""}
              </h3>
            </div>
            <form
              className="w-full flex flex-col justify-center items-center gap-2"
              onSubmit={handleSubmit}
            >
              <TextInput
                placeholder="Continue from here..."
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
            </form>
          </div>
        </Swipable>
      </div>
    </Suspense>
  );
}

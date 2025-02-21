import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface ChildrenStatementsProps {
  statements: api.Statement[];
}

export default function ChildrenStatements(props: ChildrenStatementsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentChild = useMemo<api.Statement | null>(
    () => props.statements[currentIndex] || null,
    [props.statements, currentIndex]
  );
  const hasPrev = useMemo(() => currentIndex > 0, [currentIndex]);
  const hasNext = useMemo(
    () => currentIndex < props.statements.length - 1,
    [currentIndex, props.statements.length]
  );
  const router = useRouter();

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const goToStatement = () => {
    if (!currentChild) return;
    router.push(`/tale/${currentChild.id}`);
  };

  return (
    <div className="w-full flex gap-4 items-center">
      <ControlButton label="<" onClick={handlePrev} disabled={!hasPrev} />
      <h4
        className="w-5/6 text-2xl font-bold text-center text-secondary cursor-pointer hover:opacity-60 transition-all duration-500"
        onClick={goToStatement}
      >
        {currentChild?.text}
      </h4>
      <ControlButton label=">" onClick={handleNext} disabled={!hasNext} />
    </div>
  );
}

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ControlButton(props: ControlButtonProps) {
  const isDisabled = props.disabled === true;

  return (
    <button
      onClick={props.onClick}
      className="bg-secondary text-light py-2 px-4 rounded disabled:opacity-50"
      disabled={isDisabled}
    >
      {props.label}
    </button>
  );
}

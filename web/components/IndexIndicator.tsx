interface IndexIndicatorProps {
  index: number;
  total: number;
}

export default function IndexIndicator(props: IndexIndicatorProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: props.total }, (_, i) => (
        <Indicator key={i} isActive={i === props.index} />
      ))}
    </div>
  );
}

interface IndicatorProps {
  isActive: boolean;
}

const Indicator = (props: IndicatorProps) => {
  return (
    <div
      className={`w-2 h-2 rounded-full bg-secondary ${
        !props.isActive && "bg-opacity-25"
      }`}
    ></div>
  );
};

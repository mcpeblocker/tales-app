import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import UpIcon from "@/public/up.svg";
import DownIcon from "@/public/down.svg";
import Image from "next/image";
import { Direction } from "@/enums/Direction.enum";

type SwipableProps = React.PropsWithChildren<{
  onDown: () => void;
  onUp: () => void;
  onLeft: () => void;
  onRight: () => void;
  canSwipe: (direction: Direction) => boolean;
}>;

export default function Swipable(props: SwipableProps) {
  const [isSliding, setIsSliding] = useState(false);
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [isNavigationShown, setIsNavigationShown] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const slide = (direction: Direction) => {
    if (isSliding) return;
    if (!props.canSwipe(direction)) {
      return;
    }
    setIsSliding(true);
    setTimeout(() => {
      setIsSliding(false);
    }, 500);
    setDirection(direction);
    switch (direction) {
      case Direction.UP:
        props.onUp();
        break;
      case Direction.DOWN:
        props.onDown();
        break;
      case Direction.LEFT:
        props.onLeft();
        break;
      case Direction.RIGHT:
        props.onRight();
        break;
    }
  };
  const handlers = useSwipeable({
    onSwipedDown: slide.bind(null, Direction.DOWN),
    onSwipedUp: slide.bind(null, Direction.UP),
    onSwipedLeft: slide.bind(null, Direction.LEFT),
    onSwipedRight: slide.bind(null, Direction.RIGHT),
    trackMouse: true,
    preventScrollOnSwipe: true,
    swipeDuration: 500,
  });

  const toggleVisibility = () => {
    setIsNavigationShown((prev) => !prev);
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      setIsNavigationShown(false);
      setTimeoutId(null);
    }, 3000);
    setTimeoutId(newTimeoutId as unknown as number);
  };

  return (
    <div
      className="flex-1 flex flex-col w-full md:w-2/3 lg:w-1/2 overflow-hidden"
      {...handlers}
    >
      <NavigationButton
        navigate={slide}
        direction={Direction.DOWN}
        isShown={isNavigationShown}
      >
        <Image src={UpIcon} alt="Prev" />
      </NavigationButton>
      <div
        onClick={toggleVisibility}
        className="z-0 flex-1 flex flex-col justify-center items-center select-none overflow-hidden"
        style={{
          transition: isSliding ? "transform 0.5s ease" : "none",
          transform: isSliding ? getTranslationByDirection(direction) : "none",
        }}
      >
        {props.children}
      </div>
      <NavigationButton
        navigate={slide}
        direction={Direction.UP}
        isShown={isNavigationShown}
      >
        <Image src={DownIcon} alt="Next" />
      </NavigationButton>
    </div>
  );
}

interface NavigationButtonProps {
  navigate: (direction: Direction) => void;
  children: React.ReactNode;
  direction: Direction;
  isShown: boolean;
}

const NavigationButton = (props: NavigationButtonProps) => {
  return (
    <button
      className="z-20 w-full flex justify-center items-center py-2 px-8 transition-all duration-300 rounded-lg bg-secondary text-light opacity-60 hover:opacity-100"
      onClick={props.navigate.bind(null, props.direction)}
      style={{
        transform: props.isShown
          ? "translateY(0)"
          : props.direction === Direction.UP
          ? "translateY(100%)"
          : "translateY(-100%)",
      }}
    >
      {props.children}
    </button>
  );
};

const getTranslationByDirection = (direction: Direction) => {
  switch (direction) {
    case Direction.UP:
      return "translateY(-60%)";
    case Direction.DOWN:
      return "translateY(60%)";
    case Direction.LEFT:
      return "translateX(-100%)";
    case Direction.RIGHT:
      return "translateX(100%)";
  }
};

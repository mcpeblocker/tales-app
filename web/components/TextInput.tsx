export default function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const initialClassName =
    "p-2 bg-transparent border-b-2 rounded outline-none w-2/3 md:w-1/2 lg:w-1/3";
  const className = props.className
    ? `${initialClassName} ${props.className}`
    : initialClassName;

  return <input className={className} {...props} />;
}

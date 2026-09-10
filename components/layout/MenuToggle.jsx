import { cx } from '@libs/vendor'; 

export default function MenuToggle({ isOpen, onClick, className }) {
  const translateY = isOpen ? "calc(-1em - 2px)" : "0px";
  const topTransform = isOpen ? "rotate(45deg) translateY(0px)" : "rotate(0deg) translateY(-3px)";
  const bottomTransform = isOpen ? "rotate(-45deg) translateY(0px)" : "rotate(0deg) translateY(3px)";
  const label = isOpen ? "Close" : "Menu";

  const mergedClass = cx(
    "group flex cursor-pointer items-center gap-8 transition-colors transition-opacity duration-300 hover:opacity-70",
    "text-accent uppercase tracking-tight",
    className
  );

  return (
    <button type="button" onClick={onClick} aria-expanded={isOpen} aria-label={label} className={mergedClass}>
      <span className="relative h-[1em] w-[3.5em] overflow-hidden">
        <span className="flex flex-col gap-2 transition-transform duration-300 ease-out" style={{ transform: `translateY(${translateY})` }}>
          <span className="block h-[1em] leading-none">Menu</span>
          <span className="block h-[1em] leading-none">Close</span>
        </span>
      </span>
      <span className="relative flex h-16 w-16 flex-col items-center justify-center">
        <span className="absolute h-[2px] w-full origin-center bg-current" style={{ transform: topTransform, transition: "transform 250ms ease-out" }} />
        <span className="absolute h-[2px] w-full origin-center bg-current" style={{ transform: bottomTransform, transition: "transform 250ms ease-out" }} />
      </span>
    </button>
  );
}
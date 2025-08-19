"use client";

type AnimatedButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: string;
  textSize?: string;
  img?: string;
  imgClass?: string;
  formAction?: string; // new prop
};

export default function AnimatedButton({
  text,
  type = "button",
  onClick,
  disabled = false,
  fullWidth = false,
  style = "",
  textSize = "text-sm",
  img = "",
  imgClass = "",
  formAction,
}: AnimatedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    onClick?.();
  };

  return (
    <div>
      <button
        type={type}
        onClick={handleClick}
        formAction={formAction}
        className={`
          ${fullWidth ? "w-full" : ""}
          ${style}
          cursor-pointer
          flex items-center justify-center
          p-2.5 gap-4 rounded-lg
          text-white ${textSize} font-medium

          bg-[#009689] /* unidoc-500 */
          shadow-[0_4px_0_#007d70] /* unidoc-600 */

          transition
          hover:bg-[#4dbdad] /* unidoc-400 */
          hover:shadow-[0_4px_0_#009689] /* unidoc-500 */
          hover:translate-y-[1px]

          focus:bg-[#007d70] /* unidoc-600 */
          focus:shadow-none
          focus:translate-y-1

          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:bg-[#009689] /* unidoc-500 */
          disabled:hover:shadow-[0_4px_0_#007d70] /* unidoc-600 */
          disabled:hover:translate-y-0
        `}
        disabled={disabled}
      >
        {img && <img src={img} className={imgClass} />}
        {text}
      </button>
    </div>
  );
}

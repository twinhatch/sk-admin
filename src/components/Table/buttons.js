import React from "react";

function classNames(...classes) {
   return classes.filter(Boolean).join(" ");
 }
export function Button({ children, className, ...rest }) {
  
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black !bg-transparent hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PageButton({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-2 py-2 border border-[#DAAD65] bg-transparent text-sm font-medium !text-black hover:bg-[#DAAD65]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

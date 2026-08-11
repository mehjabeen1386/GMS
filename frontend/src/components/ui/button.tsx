import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'default';
}

export const Button = ({ variant = 'default', size = 'default', className = '', ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border bg-transparent hover:bg-muted",
    ghost: "hover:bg-muted"
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 py-2"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
};
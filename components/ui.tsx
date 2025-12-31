import { clsx } from "clsx";

export function cn(...args: any[]) {
  return clsx(args);
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const { className, variant = "primary", ...rest } = props;
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-ink text-bg hover:opacity-90 shadow-soft"
      : "bg-transparent text-ink hover:bg-ink/5";
  return <button className={cn(base, styles, className)} {...rest} />;
}

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("rounded-xl2 border border-ink/10 bg-white/70 shadow-soft", className)} {...rest} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-ink/15 bg-white/70 px-3 py-2 text-sm text-ink placeholder:text-ink/45 focus:outline-none focus:ring-2 focus:ring-accent/50",
        className
      )}
      {...rest}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-ink/15 bg-white/70 px-3 py-2 text-sm text-ink placeholder:text-ink/45 focus:outline-none focus:ring-2 focus:ring-accent/50",
        className
      )}
      {...rest}
    />
  );
}

import Link from "next/link";
import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-[18px] text-body transition-colors cursor-pointer";

const variants: Record<ButtonVariant, string> = {
  primary: "border-[1.5px] border-honey-strong bg-honey font-bold text-ink hover:bg-honey-strong",
  secondary: "border border-line-strong bg-surface font-medium text-ink hover:bg-surface-muted",
  danger: "border border-danger-border bg-surface font-medium text-danger hover:bg-danger-soft",
};

// No design, desabilitado e carregando têm o mesmo visual neutro em qualquer
// variante (ex.: "Excluindo..."), deixando claro que não dá para clicar de novo.
// O Tailwind gera `disabled:` depois de `hover:`, então ele vence o hover.
const disabled =
  "disabled:cursor-not-allowed disabled:border disabled:border-line disabled:bg-surface-muted disabled:font-medium disabled:text-ink-subtle";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
};

// Com `href`, o Button vira um <Link>: navegação continua sendo link (abre em
// nova aba, prefetch), só o visual é de botão. Ex.: "Nova tarefa", "Editar".
type LinkButtonProps = CommonProps & ComponentProps<typeof Link>;

type NativeButtonProps = CommonProps &
  ComponentProps<"button"> & {
    href?: never;
    /**
     * Texto exibido enquanto a ação roda. Se presente, o botão fica desabilitado
     * e mostra esse texto: `loading={isPending && "Excluindo..."}`.
     */
    loading?: string | false;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

function isLink(props: ButtonProps): props is LinkButtonProps {
  return props.href !== undefined;
}

export function Button(props: ButtonProps) {
  if (isLink(props)) {
    const { variant = "primary", className, ...linkProps } = props;
    return <Link className={classes(variant, className)} {...linkProps} />;
  }

  const {
    variant = "primary",
    className,
    loading,
    disabled: isDisabled,
    children,
    // Padrão "button" para não enviar formulários sem querer; o de envio passa type="submit".
    type = "button",
    ...buttonProps
  } = props;

  return (
    <button
      type={type}
      disabled={isDisabled || Boolean(loading)}
      aria-busy={loading ? true : undefined}
      className={classes(variant, className)}
      {...buttonProps}
    >
      {loading || children}
    </button>
  );
}

function classes(variant: ButtonVariant, className?: string) {
  return [base, variants[variant], disabled, className].filter(Boolean).join(" ");
}

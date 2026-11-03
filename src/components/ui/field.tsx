import { useId, type ComponentProps } from "react";

type CommonProps = {
  label: string;
  /** Mensagem de erro. Se presente, o campo fica vermelho e acessível como inválido. */
  error?: string;
  /** Mostra o "*" no label. Sem ele, o label ganha "(opcional)".*/
  required?: boolean;
};

// `required` sai das props nativas de propósito: o atributo HTML faria o navegador
// barrar o envio com o balão dele, antes da nossa validação com mensagens em português.
type InputFieldProps = CommonProps &
  Omit<ComponentProps<"input">, "required"> & { multiline?: false };

type TextareaFieldProps = CommonProps &
  Omit<ComponentProps<"textarea">, "required"> & { multiline: true };

type FieldProps = InputFieldProps | TextareaFieldProps;

/** Label + input (ou textarea, com `multiline`) + mensagem de erro, já ligados por id. */
export function Field(props: FieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;
  const { label, error, required } = props;

  // Atributos que ligam o controle ao label e ao erro para leitores de tela.
  const a11y = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "aria-required": required || undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body font-bold">
        {label}{" "}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            *
          </span>
        ) : (
          <span className="font-normal text-ink-subtle">(opcional)</span>
        )}
      </label>

      {props.multiline ? (
        <textarea
          {...omitFieldProps(props)}
          {...a11y}
          className={controlClasses(error, "resize-y py-3 leading-normal", props.className)}
        />
      ) : (
        <input
          {...omitFieldProps(props)}
          {...a11y}
          className={controlClasses(error, "min-h-12", props.className)}
        />
      )}

      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-sm text-danger">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 7.5v5.5M12 16.5v.01"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// Tira as props do Field para sobrar só o que vai para o <input>/<textarea>.
function omitFieldProps<T extends FieldProps>(props: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { label, error, required, multiline, className, ...rest } = props;
  return rest;
}

function controlClasses(error: string | undefined, extra: string, className?: string) {
  return [
    "w-full rounded-field border-[1.5px] bg-surface px-3.5 text-base text-ink transition-colors",
    // Borda condicional para não depender da ordem do CSS.
    error ? "border-danger" : "border-line-strong",
    "disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:text-ink-subtle",
    extra,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

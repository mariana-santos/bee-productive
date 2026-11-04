// Fuso fixo: o SSR roda no fuso do servidor e o navegador no da pessoa; sem
// isso, a hora do HTML e a da hidratação podem diferir e o React acusa mismatch.
const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/** Ex.: "03/11/2026, 10:42". Usado no card da listagem e na tela de edição. */
export function formatDate(date: Date) {
  return dateFormat.format(date);
}

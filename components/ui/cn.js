// Concatenatore di classi minimale (evita dipendenze extra tipo clsx).
export const cn = (...classes) => classes.filter(Boolean).join(' ');

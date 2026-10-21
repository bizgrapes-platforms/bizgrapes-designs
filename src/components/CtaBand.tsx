import { BIZGRAPES_APP_URL } from "@/lib/config";

export function CtaBand() {
  return (
    <section className="mt-16 overflow-hidden rounded-[28px] bg-violet-900 px-6 py-12 text-center sm:px-12 sm:py-16">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Make something worth sharing
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-violet-100">
        Design logos, branding kits and social posts with Bizgrapes AI, then
        publish your best work here.
      </p>
      <a
        href={BIZGRAPES_APP_URL}
        className="mt-7 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-900 transition-colors hover:bg-violet-100"
      >
        Open Bizgrapes AI →
      </a>
    </section>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="paper-card max-w-lg p-10 text-center">
        <p className="text-sm font-medium text-cinnabar">404</p>
        <h1 className="font-title mt-2 text-4xl font-black text-ink">此笺已隐入云烟</h1>
        <p className="mt-4 text-sm leading-loose text-dai/70">
          没有找到你访问的页面，可能已被删除，或链接已经失效。
        </p>
        <Link
          href="/workspace"
          className="seal-button mt-8 h-11 px-6 text-sm font-semibold"
        >
          返回工作台
        </Link>
      </section>
    </main>
  );
}

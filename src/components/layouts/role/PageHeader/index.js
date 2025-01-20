export default function PageHeader({ icon, title, children }) {
  return (
    <header className="flex items-center justify-between border-b-2 py-3">
      <h1>
        {icon} {title}
      </h1>

      {children}
    </header>
  );
}

export default function ChartBox({ title, children }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Checkbox({ id, label, checked, onChange }: {
  id: string; label: string; checked: boolean; onChange: (checked: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="cc-checkrow">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

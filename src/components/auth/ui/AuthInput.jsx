export default function AuthInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
      />
    </label>
  );
}

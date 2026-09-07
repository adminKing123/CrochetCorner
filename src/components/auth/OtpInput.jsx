"use client";

export default function OtpInput({ value, onChange, disabled }) {
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  function handleChange(index, char) {
    const cleaned = char.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[index] = cleaned;
    const joined = next.join("").slice(0, 6);
    onChange(joined);

    if (cleaned && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
  }

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 w-10 rounded-xl border border-peach/30 bg-white text-center text-lg font-semibold text-charcoal outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20 sm:h-14 sm:w-12"
        />
      ))}
    </div>
  );
}

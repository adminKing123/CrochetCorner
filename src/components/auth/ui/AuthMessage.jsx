export function AuthError({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
      {message}
    </div>
  );
}

export function AuthSuccess({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border-2 border-mint/30 bg-mint/10 px-4 py-3 font-body text-sm text-mint-dark">
      {message}
    </div>
  );
}

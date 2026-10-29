export function Loader() {
  return (
    <div className="state" role="status" aria-live="polite">
      <div>
        <div className="spinner" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: 16 }}>Loading portfolio…</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state" role="alert">
      <div>
        <h1 style={{ fontSize: '1.4rem' }}>Couldn’t load the portfolio</h1>
        <p style={{ margin: '12px 0 20px', color: 'var(--color-text-muted)' }}>{message}</p>
        <button type="button" className="btn btn--primary" onClick={onRetry}>Try again</button>
      </div>
    </div>
  );
}

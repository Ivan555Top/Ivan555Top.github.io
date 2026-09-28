/** The demo site's coded header and footer (the Header widget and the fallbacks of the Theme Builder). */
export function DemoHeader() {
  return (
    <header className="demo-header">
      <a href="/">
        <strong>Demo Studio</strong>
      </a>
      <nav>
        <a href="/kitchen-sink/">Kitchen sink</a>
        <a href="/widgets/">Widgets</a>
        <a href="/legacy/">Legacy page</a>
      </nav>
    </header>
  );
}

export function DemoFooter() {
  return (
    <footer className="demo-footer">
      <span>© Demo Studio</span>
      <span>Built with the visual builder</span>
    </footer>
  );
}

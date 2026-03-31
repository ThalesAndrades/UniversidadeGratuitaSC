const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <h1 className="text-5xl font-black text-foreground mb-3">404</h1>
        <p className="text-base text-muted-foreground mb-6">Página não encontrada</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default NotFound;

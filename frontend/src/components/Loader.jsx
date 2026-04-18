const Loader = () => {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full border border-luxe-bronze/40" />
          <div className="absolute inset-2 rounded-full border-2 border-luxe-bronze/60 border-t-transparent animate-spin" />
          <div className="absolute inset-5 rounded-full bg-luxe-bronze/15" />
        </div>
        <p className="font-serif text-lg tracking-[0.3em] text-luxe-bronze">KNSU</p>
      </div>
    </div>
  );
};

export default Loader;

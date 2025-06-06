export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <h1 className="text-4xl text-center text-[var(--primary)]">
        {" "}
        Post. Ping. Zuno.
      </h1>
      <h1 className="text-2xl text-center">
        Loading Something Awesome For You...
      </h1>
      <div
        className="relative mt-8"
        style={{
          width: "80vw", // Responsive width
          maxWidth: 900,
          minWidth: 200,
          height: 36,
        }}
      >
        <span className="dot animate-dot1 bg-[var(--dmono)] rounded-full w-[28px] h-[28px] opacity-50 absolute top-0 left-0" />
        <span className="dot animate-dot2 bg-[var(--dmono)] rounded-full w-[28px] h-[28px] opacity-50 absolute top-0 left-0" />
        <span className="dot animate-dot3 bg-[var(--dmono)] rounded-full w-[28px] h-[28px] opacity-50 absolute top-0 left-0" />
      </div>
    </div>
  );
}

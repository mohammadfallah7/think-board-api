const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen bg-linear-to-br from-zinc-400 to-zinc-600">
      <h1 className="text-4xl font-bold tracking-widest uppercase">
        Think Board REST APIs
      </h1>
      <p className="text-zinc-800 font-light text-center max-w-3xl">
        Welcome to the Think Board REST API. This service provides secure and
        scalable endpoints for managing notes. Use these APIs to build web,
        mobile, or desktop applications with reliable CRUD operations, and
        consistent JSON responses.
      </p>
    </div>
  );
};

export default HomePage;

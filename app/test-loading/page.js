export default async function TestLoading() {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Content Loaded!</h1>
      <p>This content appears after 3 seconds of loading.</p>
    </div>
  );
}

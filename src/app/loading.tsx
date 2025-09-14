export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#00BAB8] border-opacity-70 mb-4" />
      <p className="text-gray-600">Loading, please wait...</p>
    </div>
  );
}

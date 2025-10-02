export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-6">
      
      {/* Title / Logo */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-orange-500 mb-4 text-center leading-tight drop-shadow-lg">
        CN_CUIET Careers Portal
      </h1>

      {/* Subtitle */}
      <p className="text-gray-300 text-center text-base sm:text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
        Explore exciting opportunities, apply for jobs, and build your career 
        with <span className="font-semibold text-orange-400">Coding Ninjas CUIET</span> 🚀
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <a
          href="/signin"
          className="w-full sm:w-auto bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 shadow-md hover:shadow-lg transition-all text-center"
        >
          Sign In
        </a>
        <a
          href="/signup"
          className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 shadow-md hover:shadow-lg transition-all text-center"
        >
          Create Account
        </a>
        <a
          href="/careers"
          className="w-full sm:w-auto bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 shadow-md hover:shadow-lg transition-all text-center"
        >
          View Careers
        </a>
      </div>

    </div>
  );
}

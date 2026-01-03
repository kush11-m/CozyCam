git remote add origin https://github.com/kush11-m/CozyCam.git
git branch -M mainimport Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Pink gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 -z-10"></div>

      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12 justify-center animate-fade-in">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-xl">📷</div>
          <span className="font-bold text-gray-800 text-sm">CozyCam</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="text-gray-900 block animate-fade-in-up animate-delay-100">Let&apos;s Get</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600 block animate-fade-in-up animate-delay-200">Snapping!</span>
        </h1>

        <div className="animate-fade-in-up animate-delay-300">
          <p className="text-gray-500 mb-12 text-lg">
            Get an Instant Polaroid collage to share!
          </p>
        </div>

        <div className="animate-scale-in animate-delay-400">
          <Link
            href="/capture"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-10 py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
            Start Photobooth
          </Link>

          <p className="text-xs text-gray-400 mt-6">No download required</p>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-gray-400">
        Made with ❤️ by Kush
      </footer>
    </main>
  );
}

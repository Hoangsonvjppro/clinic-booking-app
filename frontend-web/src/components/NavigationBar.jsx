

function NavigationBar( {isDark, toggleTheme} ) {
    return (
        <>
            <nav className="top-0 left-0 right-0 z-50 bg-[#0a0a0f] border-b border-white/10 fixed">
                <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                        About
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                        Works
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                        Services
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                        Pricing
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                        Features
                    </a>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                        )}
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Contact Us
                    </button>
                    </div>
                </div>
                </div>
            </nav>
        </>
    )
}

export default NavigationBar
import { NavLink } from "react-router-dom"


function SimpleNavigation( {isDark, toggleTheme} ) {
    return (
        <>
            <nav className="top-0 left-0 right-0 z-50 bg-[#0a0a0f] border-b border-white/10 absolute mb-10 transition-all duration-75">
                <div className="max-w-7xl mx-auto px-6">
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

                            <div className="relative group py-2">
                                {/* avatar button and dropdown must be direct children of the same .group so hover keeps dropdown open */}
                                <button
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition relative z-10"
                                >
                                    <img
                                        src="https://i.pravatar.cc/40"
                                        alt="User avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                <div className="absolute group -right-5 mt-1 w-44 bg-[#0a0a0f] border border-white/10 rounded-lg shadow-lg text-sm text-gray-300 transform origin-top-right opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150 z-20">
                                    <NavLink to="/profile" className="block px-4 py-2 hover:bg-white/5">
                                        Profile
                                    </NavLink>
                                    <NavLink to="/settings" className="block px-4 py-2 hover:bg-white/5">
                                        Settings
                                    </NavLink>
                                    <button
                                        onClick={() => console.log("logout")}
                                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default SimpleNavigation
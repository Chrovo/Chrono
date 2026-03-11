const Footer = () => (
    <div className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <p className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent text-lg font-bold">
                Chrono
            </p>
            <p className="text-slate-500 text-sm">
                Made by{" "}
                <a target="_blank" href="https://github.com/Chrovo" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium">
                    Chrovo
                </a>
            </p>
        </div>
    </div>
);

export default Footer;
export default function Footer() {
  return (
    <footer className="w-full bg-[#eff4ff] py-8 px-[2.5%] mt-auto border-t border-slate-200/60">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand & Tagline */}
        <div className="flex flex-col gap-2">
          <h3
            className="text-base font-black text-[#c85a32] tracking-tight m-0"
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontWeight: 900
            }}
          >
            Nomad's Dream
          </h3>
          <p
            className="text-[11px] text-slate-600 leading-relaxed max-w-xs m-0"
            style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
          >
            Travel with a soul, AI-powered journeys designed for the curious and the conscious.
          </p>
        </div>

        {/* Col 2: Company */}
        <div className="flex flex-col gap-2">
          <h4
            className="text-xs font-bold text-slate-900 m-0"
            style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
          >
            Company
          </h4>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            <li>
              <a
                href="#"
                className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors no-underline"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Destinations
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors no-underline"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                AI Guide
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors no-underline"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Sustainability
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div className="flex flex-col gap-2">
          <h4
            className="text-xs font-bold text-slate-900 m-0"
            style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
          >
            Support
          </h4>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            <li>
              <a
                href="#"
                className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors no-underline"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors no-underline"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors no-underline"
                style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="flex flex-col gap-2">
          <h4
            className="text-xs font-bold text-slate-900 m-0"
            style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
          >
            Newsletter
          </h4>
          <p
            className="text-[11px] text-slate-600 m-0"
            style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
          >
            Receive weekly soulful travel inspiration.
          </p>
          <div className="flex items-center gap-1.5 max-w-sm mt-0.5">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-3 py-1.5 bg-white rounded-md border border-slate-200 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00652c] transition-colors"
              style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
            />
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center bg-[#00652c] hover:bg-[#004f22] text-white rounded-md transition-colors cursor-pointer border-none shadow-xs shrink-0"
              aria-label="Subscribe"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

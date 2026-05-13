import Link from "next/link";

const FOOTER_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Terms and Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Do Not Sell My Data", href: "#" },
  { label: "Contact Us", href: "#" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[url('/images/howtoplay-bg.png')] bg-cover bg-center">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Copyright */}
        <p className="text-white text-sm md:text-xl font-londrina">
          © 2026 Legacy Trivia. All Rights Reserved.
        </p>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            {FOOTER_LINKS.map((link, i) => (
              <li key={link.label} className="flex items-center gap-1">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="size-2 bg-[#d9d9d95b] rounded-full"
                  ></span>
                )}
                <Link
                  href={link.href}
                  className="text-white text-sm md:text-xl font-londrina hover:underline transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

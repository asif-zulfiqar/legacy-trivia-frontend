import { Button } from "../ui/Button";

/**
 * AboutSection
 *
 * Full-width vivid-purple section with a radial sunburst / starburst
 * background (animated CSS conic-gradient rays), a "WHO WE ARE" pill,
 * large bold heading, and centred body copy – all white on purple.
 *
 * Colour: #7B00FF (exact from screenshot)
 */
export function AboutSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28 flex flex-col items-center justify-center text-center bg-[url('/images/about-bg.png')] bg-cover bg-center">
      <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-10 flex flex-col items-center gap-6">
        {/* Badge */}
        <Button
          variant="ghost"
          className="w-[120px] text-base font-[900] font-londrina uppercase"
        >
          Who We Are
        </Button>

        {/* Heading */}
        <h2 className="font-[900] text-white text-4xl sm:text-5xl md:text-[54px] font-londrina">
          About Legacy Trivia
        </h2>

        {/* Body */}
        <p className="text-white text-sm md:text-xl font-londrina">
          Legacy Trivia takes the drama of dating and turns it into a Trivia
          game. Think relationship therapy but with scoreboards, sarcasm, and
          way less emotional labor. Free to play, easy to join, perfect for
          couple nights, group hangouts, or killing time between texts you
          shouldn&apos;t send. Compete, tease, and make up sometimes all in one
          round.
        </p>
      </div>
    </section>
  );
}

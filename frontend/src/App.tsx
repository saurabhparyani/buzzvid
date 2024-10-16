import ShimmerButton from "./components/ui/shimmer-button";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import { Link } from "@tanstack/react-router";
// import { useAuthRedirect } from "./hooks/useAuthRedirect";
import Particles from "./components/ui/particles";
// import { useTheme } from "./hooks/useTheme";

function App() {
  // const { isLoading } = useAuthRedirect("/");
  // const { theme } = useTheme();

  // if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
        // color={theme === "dark" ? "#ffffff" : "#000000"} // Set color based on theme
        color="#ffffff"
      />
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-7xl sm:text-[120px] md:text-[170px] lg:text-[200px] xl:text-[270px] mb-4 sm:mb-6 md:mb-8 bg-[linear-gradient(to_bottom,black,gray)] dark:bg-[linear-gradient(to_bottom,white,gray)] bg-clip-text text-transparent">
            buzz.
          </h1>
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
            <TextGenerateEffect words="Where the hive mind meets." />
          </div>
          <div className="flex justify-center mt-10">
            <Link to="/feed">
              <ShimmerButton>
                <div className="text-xl font-semibold">start today.</div>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useNavigate } from "react-router";
import { useState } from "react";
import { Drawer } from "vaul";
import eventConfig from "../../config/eventConfig.json";

// Hero Title Component
const HeroTitle = () => {
  return (
    <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl font-light text-center text-gray-900 mb-8 leading-tight tracking-wide">
      {eventConfig.event.page.title}
    </h1>
  );
};

// Hero Image Component
const HeroImage = () => {
  return (
    <div className="relative w-auto max-w-4xl mb-8 px-4 md:px-0 shadow-xs rounded-3xl overflow-hidden">
      <img
        src={eventConfig.event.page.heroImage}
        alt="Hero image for Agents of Malarkey"
        className="w-full object-contain rounded-lg block shadow-lg"
      />
    </div>
  );
};

// Description Component with Drawer
const HeroDescription = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);

  return (
    <>
      <div className="max-w-4xl text-center mb-12">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light whitespace-pre-line">
          {`An eco-immersive sonic/sound experience by agents of Malarkey - Anish Cherian and Padmanabhan J`}
        </p>
        <button
          onClick={openDrawer}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
        >
          Read more
        </button>
      </div>

      {/* Description Drawer using vaul */}
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9999]" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[75vh] mt-24 fixed bottom-0 left-0 right-0 z-[10000]">
            <div className="px-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto relative">
              <div className="sticky mb-6 bg-white w-full h-6 top-0 flex items-center justify-center">
                <div className="w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300" />
              </div>
              <div className="max-w-md mx-auto pb-8">
                <Drawer.Title className="font-medium mb-4 text-2xl text-black">
                  About the Experience
                </Drawer.Title>

                <p className="text-lg text-gray-700 leading-relaxed font-light whitespace-pre-line">
                  {eventConfig.event.page.description}
                </p>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

// Interactive Button Component
const InteractiveButton = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/event/${eventConfig.event.id}`);
  };

  return (
    <button
      onClick={handleButtonClick}
      className="group relative bg-white hover:bg-gray-50 text-gray-900 font-medium w-48 h-48 rounded-full border border-gray-200 hover:border-gray-300 shadow-sm transition-colors duration-300 flex flex-col items-center justify-center space-y-2"
    >
      {/* Leaf Icon */}
      <svg
        className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>

      {/* Button Text */}
      <span className="text-xs uppercase tracking-wider text-center leading-tight max-w-[120px]">
        {eventConfig.event.page.buttonTitle}
      </span>
    </button>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <HeroTitle />
      <HeroImage />
      <HeroDescription />
      <InteractiveButton />
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="text-center pb-6 px-6 text-gray-500 text-sm">
      <p>An immersive experience by Anish Cherian and Padmanabhan J</p>
    </footer>
  );
};

// Main Landing Page Component (Composition)
export default function LandingPage() {
  // Show loading state (though this should be handled by Root component)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeroSection />
      {/* <Footer /> */}
    </div>
  );
}

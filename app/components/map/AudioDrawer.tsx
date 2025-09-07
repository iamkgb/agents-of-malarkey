import { Drawer } from "vaul";
import type { MarkerData, UserLocation } from "./types";
import { DrawerContent } from "./DrawerContent";

interface AudioDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMarker: MarkerData | null;
  userLocation: UserLocation | null;
}

export const AudioDrawer = ({
  isOpen,
  onOpenChange,
  selectedMarker,
  userLocation,
}: AudioDrawerProps) => {
  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9999]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-fit mt-24 fixed bottom-0 left-0 right-0 z-[10000]">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <DrawerContent
              selectedMarker={selectedMarker}
              userLocation={userLocation}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

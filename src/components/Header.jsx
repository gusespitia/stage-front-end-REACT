import Comand from "./Comand";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";

const Header = () => {
  return (
    <div className="grid grid-cols-2 gap-4 border-b p-4">
      <Comand />
      <div className="flex items-center justify-end">
        <Button variant="outline" size="icon">
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
export default Header;
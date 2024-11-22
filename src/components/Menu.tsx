import { CornerDownRightIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface MenuItem {
  label: string;
  link: string;
}

const Menu = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="select-none relative">
      <div
        className={`cursor-pointer w-8 h-8 flex justify-center items-center text-gray-600 bg-gray-100 rounded-lg ${
          open ? "rounded-bl-none rounded-br-none" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        <MenuIcon
          className={`p-1 transition duration-200 ${open ? "rotate-90" : ""}`}
        />
      </div>
      <div
        className={`absolute mt-0flex flex-col justify-between items-center transition overflow-hidden ${
          open ? "h-96" : "h-0"
        }`}
      >
        <div className="flex flex-col gap-1 text-gray-600 rounded-tr rounded-br rounded-bl  bg-gray-100 p-1">
          {menuItems?.map((item) => (
            <Link
              to={item.link}
              className="text-sm font-bold"
              onClick={() => setOpen(false)}
            >
              <div className="flex gap-1 items-center rounded hover:bg-gray-200 py-1 px-2">
                <CornerDownRightIcon size={12} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Menu;

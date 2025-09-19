import { AiOutlineSetting, AiOutlineDown } from "react-icons/ai";
import Logo from "../../assets/logo.svg";
import Style from "./Weather.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <nav className={Style.navbar}>
      <div className={Style.sectionMain}>
        <img src={Logo} alt="Logo" />
        <div className={Style.Setting}>
          <DropdownMenu>
            <DropdownMenuTrigger className={Style.drop} asChild>
              <button className={Style.ButtonDrop}>
                <AiOutlineSetting className={Style.iconsSitings} />
                Units
                <AiOutlineDown className={Style.iconsSitings} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

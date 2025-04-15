import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import AuthService from "../../service/auth.service";

function Menubar() {
  const pathname = usePathname(); 
  const router = useRouter(); 

  const logout = () => {
    console.log("Logout Clicked");
    AuthService.logout();
    router.push("/login"); 
  };

  const menuItems = [
    {
      title: "Menu",
      items: [
        {
          label: "แจ้งปัญหา",
          href: "/admin/all_report",
        },
        {
          label: "รายงาน",
          href: "/admin/dashboard",
        },
      ],
   
    },
    {
      title: "Other",
      items: [
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
          ),
          label: "ออกจากระบบ",
          href: "#",
          onClick: logout, 
        },
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i, index) => (
        <div className="flex flex-col gap-2" key={index}>
          <span className="text-gray-400 font-light my-4">{i.title}</span>
          {i.items.map((item) => {
            const isActive = pathname === item.href;
            return item.label === "ออกจากระบบ" ? (
              <button
                key={item.label}
                className="flex items-center gap-4 py-2 p-4 rounded-lg transition text-gray-500 hover:bg-slate-200"
                onClick={logout} 
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center gap-4 py-2 p-4 rounded-lg transition ${
                  isActive ? "bg-[#50B0E9] text-white font-semibold" : "text-gray-500 hover:bg-slate-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Menubar;

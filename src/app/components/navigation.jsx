"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function Navigation(props) {
  const { navi1, navi2, page1, page2 , color1 , color2} = props;

  return (
    <div className="">
      <div className="fixed bottom-0 h-12 w-full bg-[#5ABCF5] rounded-tr-2xl rounded-tl-2xl flex justify-between items-center text-white">
        <div className={`flex-1 text-center py-7 ${color1}`}>
          <Link href={page1}>
            <p>{navi1}</p>
          </Link>
        </div>
        <div className={`flex-1 text-center py-7 ${color2}`}>
          <Link href={page2}>
            <p>{navi2}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navigation;

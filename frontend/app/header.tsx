"use client"

import Link from "next/link";
import Logout from "./logout";
import { usePathname } from "next/navigation";
import { Tickets, User, Share2 } from 'lucide-react'; 
import { useEffect, useState } from "react";
import Mailer from "../components/ui/mailer"

interface Props {
  title: string;
}

export default function Header(props:Props) {
  const pathname = usePathname().replace("/", "");
  const [showMailer, setShowMailer] = useState(false);
  const [collectionId, setCollectionId] = useState<number>();

  useEffect(() => {
    const cId = new URLSearchParams(window.location.search).get('collectionId');

    if (cId) {
      setCollectionId(parseInt(cId));
    }
  });
  
  return (
        pathname == "login" || pathname == "register" ? null :
        <nav className="">
          <div className="flex items-center justify-between p-4 bg-purple-900 text-white">
            <Link href="/" className="text-xl font-bold">
              {props.title}
            </Link>
            <div className="flex items-center gap-4">
              <menu type="list" className="flex items-center gap-4">
                <div className="text-sm text-white-300 hover:text-white transition-colors">
                  <Link href="#" onClick={() => setShowMailer(true)} className="hover:underline" title="Send Mail"><Share2 /></Link>
                </div>
                <div className="text-sm text-gray-300 hover:text-white transition-colors">
                  <Link href="/listies" className="hover:underline" title="Listies"><Tickets></Tickets></Link>
                </div>
                <div className="text-sm text-gray-300 hover:text-white transition-colors">
                  <Link href="/account" className="hover:underline" title="Account"><User></User></Link>
                </div>
                <div className="text-sm text-gray-300 hover:text-white transition-colors" title="Logout">
                  <Logout></Logout>
                </div>
              </menu>
            </div>
          </div>
          {showMailer && (
            <Mailer onClose={() => setShowMailer(false)}></Mailer>
          )}
        </nav>
    );
}

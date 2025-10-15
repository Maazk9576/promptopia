"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  ClientSafeProvider,
} from "next-auth/react";
import Button from "./Button";
const Nav = () => {
  // const isUserLoggedIn = useSession;
  const { data: session } = useSession();
  const isUserLoggedIn = session?.user;
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    fetchProviders();
  }, []);
  return (
    <>
      <nav className="flex-between w-full mb-16 pt-3">
        <Link href="/" className="flex gap-2 flex-center">
          <Image
            src="assets/images/logo.svg"
            alt="promptopia logo"
            height={30}
            width={30}
            className="object-contain"
          />
        </Link>
        {/* Desktop Navigation */}
        <div className="sm:flex hidden">
          {isUserLoggedIn ? (
            <div className="flex gap-3 md:gap-5">
              <Link href="create-prompt" className="black_btn">
                Create Post
              </Link>
              <Button name="Sign Out" onClick={signOut} />
              <Link href="/profile">
                <Image
                  alt="profile pic"
                  src={
                    session?.user?.image || "https://i.pravatar.cc/300?img=5"
                  }
                  width={37}
                  height={37}
                  className="rounded-full"
                />
              </Link>
            </div>
          ) : (
            <>
              {/* Providers as ClientSafeProvider[] nbhi le sakte  hain yeh type “Hey, trust me — these values are ClientSafeProvider objects.” */}
              <div className="flex flex-row justify-center gap-2">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <Button
                      key={provider.name}
                      name={`Sign in with ${provider.name}`}
                      onClick={() => signIn(provider.id)}
                      className="black_btn"
                    />
                  ))}
              </div>
            </>
          )}
        </div>
        {/* Mobile Navigation */}
        <div className="sm:hidden flex relative">
          {isUserLoggedIn ? (
            <div className="flex">
              <Image
                alt="profile pic"
                src="https://i.pravatar.cc/300?img=5"
                width={37}
                height={37}
                className="rounded-full"
                onClick={() => setToggleDropdown((prev) => !prev)}
              />
              {toggleDropdown && (
                <div className="dropdown">
                  <Link
                    href="/profile"
                    onClick={() => setToggleDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="create-prompt"
                    onClick={() => setToggleDropdown(false)}
                  >
                    Create Post
                  </Link>
                  <Button
                    name="Sign Out"
                    onClick={() => {
                      setToggleDropdown(false);
                      signOut();
                    }}
                    className="mt-5 w-full black_btn"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <Button
                    key={provider.name}
                    name="Sign In"
                    onClick={() => signIn(provider.id)}
                    className="black_btn"
                  />
                ))}
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;

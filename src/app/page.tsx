"use client";

import { Input } from "@/components";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <div className="relative bg-white">
      <Nav />

      <div className="relative flex min-h-screen w-full justify-center items-center">
        <img
          src="http://placehold.co/500"
          alt=""
          className="h-screen w-screen object-cover"
        />

        <div className="absolute flex justify-around items-center mx-60 mt-20">
          <div className="space-y-10 w-1/2">
            <h2 className="text-5xl text-lime-500 font-extrabold">
              Find the Right Doctor, Right Here.
            </h2>
            <p className="text-xl text-zinc-700 font-medium w-4/5">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Mollitia, eligendi aspernatur? Odio reiciendis voluptate in sed
              magnam? Molestiae a nisi, repellat, corrupti quisquam in totam
              neque assumenda similique alias atque?
            </p>
          </div>

          <div className="flex flex-col items-center space-y-10 bg-white rounded-4xl h-[650px] w-[500px] p-10"></div>
        </div>
      </div>
    </div>
  );
}

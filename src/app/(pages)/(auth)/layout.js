"use client";
import React from "react";
import { useParticleEffect } from "@/hooks/useParticles"; // Adjust the path as needed

export default function AuthLayout({ children }) {
  const canvasRef = useParticleEffect();

  return (
    <div className=" w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="flex-center h-screen relative z-10 pointer-events-none  ">
        <div className="pointer-events-auto  auth_form">{children}</div>
      </div>
    </div>
  );
}

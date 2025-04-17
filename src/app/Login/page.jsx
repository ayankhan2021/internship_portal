"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const particlesConfig = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: ["#4F46E5", "#10B981", "#EF4444"] },
      shape: { type: "circle" },
      opacity: { value: 0.7 },
      size: { value: 3 },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 200, links: { opacity: 1 } },
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  };

  useEffect(() => {
    const initializeParticles = () => {
      if (typeof window !== "undefined" && window.particlesJS) {
        window.particlesJS("particles-js", particlesConfig);
      }
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    script.onload = initializeParticles;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      const particlesContainer = document.getElementById("particles-js");
      if (particlesContainer) particlesContainer.innerHTML = "";
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Perform login logic here
      alert("Login successful!");
      router.push("/dashboard"); // Redirect to dashboard or another page
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div id="particles-js" className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-2xl mx-4 my-8">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email *"
                className="w-full p-3 bg-gray-700 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="text-red-400 text-sm">{errors.email}</span>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password *"
                className="w-full p-3 bg-gray-700 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="text-red-400 text-sm">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/Register")}
                className="text-blue-400 hover:underline"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
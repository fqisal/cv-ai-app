/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Tajawal", "Inter", "system-ui", "sans-serif"]
      },
      keyframes: {
        pageEnter: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        cardReveal: {
          from: { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        statusPulse: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.6" }
        },
        leafSway: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        stemBreathe: {
          "0%,100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.04)" }
        },
        plantBounce: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        orbFloat: {
          "0%,100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-12px) translateX(8px)" }
        }
      },
      animation: {
        pageEnter: "pageEnter 280ms cubic-bezier(0.22,1,0.36,1) both",
        cardReveal: "cardReveal 320ms cubic-bezier(0.34,1.56,0.64,1) both",
        statusPulse: "statusPulse 2s ease-in-out infinite",
        leafSway: "leafSway 3s ease-in-out infinite",
        stemBreathe: "stemBreathe 4s ease-in-out infinite",
        plantBounce: "plantBounce 6s ease-in-out infinite",
        orbFloat: "orbFloat 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};


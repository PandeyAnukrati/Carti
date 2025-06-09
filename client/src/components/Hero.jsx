import React from "react";
import { motion } from "framer-motion";
import bikeImage from "../assets/ecommerce website image.png";
import { Bot, ShoppingBag, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-[#f7f4ee] min-h-[80vh] flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 overflow-hidden">
      {/* Left Text Content */}
      <motion.div
        className="max-w-xl text-left space-y-6"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="text-sm text-gray-600 uppercase tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          AI Assistant
        </motion.p>

        <motion.h1
          className="text-5xl md:text-6xl font-semibold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Shop Smart with Carti
        </motion.h1>

        <motion.button
          className="mt-6 bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <a href="/products">EXPLORE NOW</a>
        </motion.button>

        {/* Feature Highlights */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 font-medium">
                <item.icon size={16} /> {item.title}
              </div>
              <p className="text-gray-500">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="-mt-10 md:mt-0 max-w-3xl w-full -mr-19"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <img src={bikeImage} alt="Bike" className="w-full object-contain" />
      </motion.div>
    </section>
  );
}

const features = [
  {
    icon: Bot,
    title: "Ask Carti",
    description: "Your personal AI shopping buddy",
  },
  {
    icon: ShoppingBag,
    title: "Smart Picks",
    description: "AI-curated product matches",
  },
  {
    icon: Star,
    title: "Top Deals",
    description: "Handpicked offers & discounts",
  },
];

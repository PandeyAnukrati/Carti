
import React from "react";
import { motion } from "framer-motion";
import { Bot, ShoppingCart, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-gray-800 px-6 md:px-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
       
        <p className="text-lg text-center text-gray-700 mb-12">
          Discover how Recommendo, your intelligent ecommerce platform, and Carti, your AI-powered shopping assistant, work together to revolutionize online shopping.
        </p>

        {/* Recommendo Section */}
        <SectionHeader title="What is Recommendo?" />
        <FeatureGrid features={recommendoFeatures} color="blue" />

        {/* Carti Section */}
        <SectionHeader title="Meet Carti — Your AI Assistant" />
        <FeatureGrid features={cartiFeatures} color="purple" />

        {/* Final CTA */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-black">Ready to shop smarter?</h2>
          <p className="mt-2 text-gray-600">
            Explore Recommendo and let Carti help you every step of the way.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}

function SectionHeader({ title }) {
  return (
    <motion.h2
      className="text-2xl md:text-3xl font-bold text-black mb-6 mt-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {title}
    </motion.h2>
  );
}

function FeatureGrid({ features, color }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-md p-6 flex gap-4 items-start"
        >
          <div className={`p-3 rounded-full bg-${color}-100 text-${color}-700`}>
            <item.icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Feature Data
const recommendoFeatures = [
  {
    icon: ShoppingCart,
    title: "Smart Ecommerce Platform",
    description: "Recommendo is a next-gen online store designed to understand and adapt to user preferences.",
  },
  {
    icon: Lightbulb,
    title: "Personalized Recommendations",
    description: "Using advanced filters and behavioral insights, Recommendo suggests products that match your style.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Scalable",
    description: "Built on robust technologies with secure authentication and seamless user experience.",
  },
];

const cartiFeatures = [
  {
    icon: Bot,
    title: "Conversational Shopping Assistant",
    description: "Ask Carti anything – from finding products to understanding return policies.",
  },
  {
    icon: Sparkles,
    title: "Powered by Gemini AI",
    description: "Carti uses cutting-edge AI to provide quick, context-aware responses to your queries.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First",
    description: "All interactions are securely authenticated via Firebase, keeping your data protected.",
  },
];

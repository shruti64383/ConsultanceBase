"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChangeEvent } from 'react';
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronRight, X } from "lucide-react"
import { User, Mail, MessageSquare, Phone, Loader2} from 'lucide-react';
import { motion, useInView } from "framer-motion"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const router = useRouter()
  const containerRef = useRef(null)
  const formRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else {
      newErrors.name = '';
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-()+]{10,20}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please describe your requirements';
      isValid = false;
    } else {
      newErrors.message = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
  
      // Clear error when user types
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/lead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          router.push('/thank-you');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Submission failed');
        }
      } catch (error: unknown) {
        let errorMessage = 'Failed to submit inquiry';
  
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        console.error('Submission error:', error);
        setErrors(prev => ({ ...prev, form: errorMessage }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const selectPlan = (plan: string) => {
    setSelectedPlan(plan)
    setFormData((prev) => ({
      ...prev,
      message: `I'm interested in the ${plan} plan.`,
    }))
    scrollToForm()
  }

  const originalPrice = 7141
  const discountPercentage = 30
  const discountedPrice = 4999

  const pricingPlans = [
    {
      name: "Basic",
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      duration: "month",
      description: "Perfect for small businesses and startups",
      features: [
        "Company Registration",
        "GST Registration",
        "Basic Compliance Setup",
        "Digital Signature Certificate",
        "Email Support",
      ],
      notIncluded: ["Trademark Registration", "Legal Documentation", "Dedicated Account Manager", "Priority Support"],
      popular: false,
    },
    {
      name: "Standard",
      originalPrice: originalPrice * 1.5,
      discountedPrice: discountedPrice * 1.5,
      duration: "month",
      description: "Ideal for growing businesses with moderate needs",
      features: [
        "Everything in Basic",
        "Trademark Registration",
        "Legal Documentation",
        "Annual Compliance Management",
        "Phone & Email Support",
        "Dedicated Account Manager",
      ],
      notIncluded: ["International Trademark", "24/7 Priority Support"],
      popular: true,
    },
    {
      name: "Premium",
      originalPrice: originalPrice * 2.5,
      discountedPrice: discountedPrice * 2.5,
      duration: "month",
      description: "Comprehensive solution for established businesses",
      features: [
        "Everything in Standard",
        "International Trademark",
        "Patent Filing Assistance",
        "Comprehensive Legal Support",
        "Tax Planning & Advisory",
        "24/7 Priority Support",
        "Quarterly Business Review",
      ],
      notIncluded: [],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/70 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center text-sm text-white/80 mb-4">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-white">Pricing</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Transparent Pricing</h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Choose the right plan for your business needs with our transparent pricing structure. Get premium
                services at competitive rates.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-white text-primary hover:bg-gray-100" onClick={scrollToForm}>
                    Contact Us
                  </Button>
                </motion.div>
                {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </motion.div> */}
              </div>
            </motion.div>
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  // src="/placeholder.svg?height=400&width=600&text=Business+Services+Pricing"
                  src="/pricing/price.jpg"
                  alt="Pricing"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-white font-medium">30% Special Discount Available</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your business needs. All plans come with our 30-day satisfaction guarantee.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-lg overflow-hidden border ${
                  plan.popular ? "border-primary" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-white py-2 px-4 text-center">
                    <p className="text-sm font-medium">Most Popular</p>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-gray-400 line-through text-lg mr-2">
                        ₹{plan.originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-3xl font-bold">₹{plan.discountedPrice.toLocaleString()}</span>
                      <span className="text-gray-500 ml-1">/{plan.duration}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="font-medium text-sm mb-2">What's included:</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.notIncluded.length > 0 && (
                    <div className="mb-6">
                      <p className="font-medium text-sm mb-2 text-gray-500">Not included:</p>
                      <ul className="space-y-2">
                        {plan.notIncluded.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-sm text-gray-500">
                            <X className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary" : "bg-gray-800"} hover:${plan.popular ? "bg-primary/90" : "bg-gray-700"}`}
                      onClick={() => selectPlan(plan.name)}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All Plans Include</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every plan comes with these essential features to ensure your business success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Guidance",
                description: "Get professional advice from our team of experienced business consultants",
                icon: "👨‍💼",
              },
              {
                title: "Fast Processing",
                description: "Quick turnaround times for all your business registration and compliance needs",
                icon: "⚡",
              },
              {
                title: "Dedicated Support",
                description: "Access to our support team for any questions or assistance you may need",
                icon: "🛠️",
              },
              {
                title: "Document Management",
                description: "Secure storage and management of all your important business documents",
                icon: "📁",
              },
              {
                title: "Compliance Updates",
                description: "Regular updates on regulatory changes that may affect your business",
                icon: "📢",
              },
              {
                title: "Satisfaction Guarantee",
                description: "Our 30-day satisfaction guarantee ensures you're happy with our services",
                icon: "✅",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our pricing and services
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Can I upgrade my plan later?",
                answer:
                  "Yes, you can upgrade your plan at any time. The price difference will be prorated for the remainder of your billing cycle.",
              },
              {
                question: "Is there a setup fee?",
                answer: "No, there are no hidden setup fees. The price you see is the price you pay.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 30-day satisfaction guarantee. If you're not satisfied with our services within the first 30 days, we'll provide a full refund.",
              },
              {
                question: "Can I customize my plan?",
                answer:
                  "Yes, we offer customized solutions for businesses with specific needs. Contact our sales team to discuss your requirements.",
              },
              {
                question: "How long is the contract period?",
                answer: "Our plans are billed monthly with no long-term commitment. You can cancel at any time.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="mb-6 bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white" ref={formRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Have questions about our pricing or need a custom quote? Fill out the form and our team will get back
                  to you shortly.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3">
                    {[
                      "Transparent pricing with no hidden fees",
                      "Expert team with years of experience",
                      "Dedicated account manager for every client",
                      "Fast turnaround times for all services",
                      "Comprehensive support throughout the process",
                      "High client satisfaction rate",
                    ].map((reason, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      >
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{reason}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
              >
                <h3 className="font-bold text-xl mb-4">Contact Us</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        placeholder="Enter your email"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Your Requirements
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`pl-10 ${errors.message ? "border-red-500" : ""}`}
                        placeholder="Describe your requirements"
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* Form-level error
                  {errors.form ? (
                    <p className="text-red-500 text-sm" aria-live="assertive">
                      {errors.form}
                    </p>
                  ) : null} */}

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                      </span>
                    ) : 'Submit Inquiry'}
                  </Button>
               </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-primary text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Choose the right plan for your business and start your journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-gray-100" onClick={scrollToForm}>
              Contact Us
            </Button>
            <Button variant="outline" className="border-white text-black hover:bg-white/10">
              <Link href="/services">
                View Services
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}


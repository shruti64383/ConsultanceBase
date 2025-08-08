"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronRight, Phone, Loader2} from "lucide-react"
import { User, Mail, MessageSquare } from 'lucide-react';
import { BsWhatsapp } from "react-icons/bs"
import { servicesData } from "@/lib/services-data"
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChangeEvent } from 'react';
import { useRouter } from "next/navigation"
import AnimatedBenefitsSection from "@/components/animated-benefits-section"
import AnimatedProcessSection from "@/components/animated-process-section"
import AnimatedFAQSection from "@/components/animated-faq-section"

export default function ServicePageClient({ params }: { params: { slug: string } }) {
  const service = servicesData.find((service) => service.slug === params.slug)
  const containerRef = useRef(null)
  const formRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })
  const router = useRouter()

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
        message: "",
        form: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If service not found, return 404
  if (!service) {
    notFound()
  }

//   const scrollToForm = () => {
//   router.push('#contact-form'); // Add an ID to your form section
// };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

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

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <Link href="/services" className="hover:text-primary">
                  Services
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-primary">{service.title}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {service.title} Services
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-6 max-w-xl">{service.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Quick Turnaround</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">100% Compliance</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white" 
                    onClick={scrollToForm}
                  >
                    Get Started
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/pricing">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 text-primary">
                      View Pricing
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <Image
                  src={service.bannerImage || "/placeholder.svg"}
                  alt={service.title}
                  width={500}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Expert Assistance</p>
                      <p className="text-xs text-gray-500">Professional support</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Service Information */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <motion.section
              className="mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.title} Overview</h2>
              <p className="mb-4 text-gray-700">
                Our {service.title.toLowerCase()} service provides comprehensive support for businesses looking to
                {service.slug.includes("registration")
                  ? " register and comply with all regulatory requirements."
                  : service.slug.includes("tax")
                    ? " manage their tax obligations efficiently and accurately."
                    : " ensure legal compliance and documentation is properly handled."}
              </p>
              <p className="mb-4 text-gray-700">
                With our team of experienced professionals, we handle the entire process from start to finish, ensuring
                that you can focus on running your business while we take care of the compliance aspects.
              </p>

              <AnimatedBenefitsSection
                benefits={service.benefits.map((benefit) => ({ text: benefit }))}
                title="Key Benefits"
                description="Discover the advantages of our comprehensive services"
                style="default"
              />
            </motion.section>

            {/* Process Section */}
            <motion.section
              className="mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnimatedProcessSection
                steps={[
                  {
                    title: "Initial Consultation",
                    description:
                      "We begin with a detailed consultation to understand your specific requirements and objectives.",
                    details: [
                      "Business structure assessment",
                      "Regulatory requirements analysis",
                      "Timeline and cost estimation",
                    ],
                  },
                  {
                    title: "Document Collection",
                    description:
                      "We guide you on the necessary documents and help you collect all required information.",
                    details: [
                      "Identity and address proofs",
                      "Business activity details",
                      "Ownership structure documentation",
                    ],
                  },
                  {
                    title: "Preparation & Verification",
                    description:
                      "Our experts prepare all required forms and applications, verifying information for accuracy.",
                    details: ["Form filling and verification", "Legal document drafting", "Compliance check"],
                  },
                  {
                    title: "Submission & Follow-up",
                    description:
                      "We submit the application to the relevant authorities and follow up regularly on the progress.",
                    details: ["Application submission", "Regular status updates", "Query resolution with authorities"],
                  },
                  {
                    title: "Completion & Delivery",
                    description:
                      "Once approved, we deliver all certificates and documents to you with guidance on next steps.",
                    details: [
                      "Certificate and document delivery",
                      "Post-registration compliance guidance",
                      "Future compliance calendar setup",
                    ],
                  },
                ]}
                title="Our Process"
                description="Our streamlined process makes everything quick and hassle-free"
                style="default"
              />
            </motion.section>

            {/* FAQs */}
            <motion.section
              className="mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <AnimatedFAQSection
                faqs={[
                  {
                    question: `What is the process for ${service.title.toLowerCase()}?`,
                    answer: `The ${service.title.toLowerCase()} process involves initial consultation, document collection, preparation, submission to authorities, and follow-up until completion. Our team handles all these steps professionally.`,
                  },
                  {
                    question: `How long does the ${service.title.toLowerCase()} process take?`,
                    answer: `The timeline varies depending on the complexity of your case and government processing times. Typically, it takes 2-4 weeks, but we always work to expedite the process wherever possible.`,
                  },
                  {
                    question: `What documents are required for ${service.title.toLowerCase()}?`,
                    answer: `Required documents generally include identity proof, address proof, business details, and specific documents related to your industry. Our team will provide you with a comprehensive checklist during the initial consultation.`,
                  },
                  {
                    question: `What are the fees for ${service.title.toLowerCase()} services?`,
                    answer: `Our fees depend on the complexity of your requirements and the specific service package you choose. We offer transparent pricing with no hidden charges. Contact us for a customized quote.`,
                  },
                  {
                    question: `Do I need to visit your office for ${service.title.toLowerCase()} services?`,
                    answer: `No, our services are completely online. You can submit all documents electronically, and our team handles the entire process remotely. We'll keep you updated at every step via email and phone.`,
                  },
                ]}
                title="Frequently Asked Questions"
                description="Find answers to common questions about our services"
                style="default"
              />
            </motion.section>
          </div>

          {/* Right Sidebar - Service Form */}
          <div className="lg:col-span-1">
            <div id="contact-form" className="sticky top-24" ref={formRef}>
              <motion.div
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-md"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-bold text-xl mb-4">Get {service.title} Service</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Fill the form below and our expert will get in touch with you shortly.
                </p>

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

              <motion.div
                className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="font-bold text-lg mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  {service.whyChooseUs.map((reason, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{reason}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="mt-8 bg-primary/10 p-6 rounded-lg border border-primary/20"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Our experts are available to answer your questions and provide guidance.
                </p>
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <a
                      href="tel:+919897814979"
                      className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 w-full"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Us</span>
                    </a>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <a
                      href={`https://wa.me/919760092270?text=Hello,%20I%20am%20interested%20in%20your%20${service.title}%20service.%20Please%20contact%20me.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-green-500 text-green-500 hover:bg-green-500/10 py-2 px-4 rounded-md flex items-center justify-center gap-2 w-full"
                    >
                      <BsWhatsapp className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


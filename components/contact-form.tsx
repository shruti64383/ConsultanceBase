"use client"

import { useState, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function ContactForm() {
  const [isMinimized, setIsMinimized] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: ""
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
  
      // // Message validation
      // if (!formData.message.trim()) {
      //   newErrors.message = 'Please describe your requirements';
      //   isValid = false;
      // } else {
      //   newErrors.message = '';
      // }
  
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
            router.push(`/thank-you?service=your consultation request`);
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


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Redirect to thank you page with the string "YOUR QUERY"
  //   router.push(`/thank-you?service=your consultation request`)
  // }

  return (
    <AnimatePresence>
      <motion.section
        className="fixed-contact-form"
        initial={{ y: 100 }}
        animate={{ y: isMinimized ? "calc(100% - 40px)" : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className="bg-primary py-2 px-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <h3 className="text-white font-medium text-sm">Get Free CA Guidance</h3>
          <button className="text-white hover:text-white/80 transition-colors">
            {isMinimized ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </button>
        </div>
        <motion.div
          className="bg-gray-100 py-4 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: isMinimized ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Get Free CA Guidance</h2>
                <p className="text-gray-600 text-sm mb-2">
                  Fill the form and our expert will get in touch with you to provide personalized guidance.
                </p>
              </div>

              <div className="w-full md:w-auto flex-1">
                {/* <form className="grid grid-cols-1 md:grid-cols-4 gap-2" onSubmit={handleSubmit}>
                  <div className="md:col-span-1">
                    <Input type="text" placeholder="Your Name" className="w-full h-9" />
                  </div>
                  <div className="md:col-span-1">
                    <Input type="email" placeholder="Email Address" className="w-full h-9" />
                  </div>
                  <div className="md:col-span-1">
                    <Input type="tel" placeholder="Mobile number" className="w-full h-9" />
                  </div>
                  <div className="md:col-span-1">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white font-bold h-9 w-full"
                        type="submit"
                      >
                        FREE CA GUIDANCE
                      </Button>
                    </motion.div>
                  </div>
                </form> */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="md:col-span-1">
                    {/* <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
                      Your Name
                    </label> */}
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Name"
                      disabled={isSubmitting}
                      className="w-full h-9"
                    />
                  </div>

                  <div className="md:col-span-1">
                    {/* <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">
                      Phone Number
                    </label> */}
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Mobile number"
                      disabled={isSubmitting}
                      className="w-full h-9"
                    />
                  </div>

                  <div>
                    {/* <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                      Email Address
                    </label> */}
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      disabled={isSubmitting}
                      className="w-full h-9"
                    />
                  </div>

                  {/* <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements"
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </div> */}

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90 text-white font-bold h-9 w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </span>
                      ) : 'FREE CA GUIDANCE'}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  )
}

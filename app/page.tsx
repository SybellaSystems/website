'use client'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Projects from '../components/Projects'
import Journey from '../components/Journey'
import ContactForm from '../components/ContactForm'
import OgeraDemo from '../components/OgeraDemo'
import Chatbot from '../components/Chatbot'
import { logger } from '../lib/logger'
import { useEffect } from 'react'
import TeamSlider from '@/components/Slider'
import USPSection from '@/components/Usp'
import EcosystemSolutions from '@/components/Ecosystem'
import SubscriptionPopup from '@/components/Popup'
import AdminLogin from '@/app/signin/page'

export default function Page() {
    useEffect(() => {
        logger.info('Home page loaded', {
            page: 'home',
            timestamp: new Date().toISOString()
        });
    }, []);

    return (
        <div>
            <Hero />
            <Services />
            <Projects />
            <TeamSlider />
            <USPSection />
            <OgeraDemo />
            <Journey />
            <EcosystemSolutions />
            <ContactForm />
            <Chatbot />
            <SubscriptionPopup />
            {/* <AdminLogin /> */}
        </div>
    )
}

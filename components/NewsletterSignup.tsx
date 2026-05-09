'use client'
import { useState, useCallback } from 'react'
import { logger } from '../lib/logger'
import { SecurityValidator } from '../lib/security'
import { useI18n } from '../contexts/I18nContext'

interface NewsletterSignupProps {
    onSuccess?: (email: string) => void
    placeholder?: string
    buttonText?: string
    className?: string
}

const NewsletterSignup = ({
    onSuccess,
    placeholder,
    buttonText,
    className = ""
}: NewsletterSignupProps) => {
    const { t } = useI18n()
    const [email, setEmail] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validate email
        if (!email.trim()) {
            setErrorMessage(t('newsletter.error.required'))
            setStatus('error')
            return
        }

        if (!SecurityValidator.validateEmail(email)) {
            setErrorMessage(t('newsletter.error.invalid'))
            setStatus('error')
            return
        }

        setIsSubmitting(true)
        setStatus('idle')
        setErrorMessage('')

        try {
            logger.info('Newsletter signup started', {
                email: email,
                component: 'NewsletterSignup'
            })

            // Simulate API call to CRM (replace with actual implementation)
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In a real implementation, you would:
            // 1. Send to HubSpot, Mailchimp, or your CRM
            // 2. Add to Ogera waitlist if specified
            // 3. Send welcome email

            setStatus('success')
            setEmail('')

            if (onSuccess) {
                onSuccess(email)
            }

            logger.info('Newsletter signup successful', {
                email: email,
                component: 'NewsletterSignup'
            })

        } catch (error) {
            setStatus('error')
            setErrorMessage(t('newsletter.error.failed'))

            logger.error('Newsletter signup failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                email: email,
                component: 'NewsletterSignup'
            })
        } finally {
            setIsSubmitting(false)
        }
    }, [email, onSuccess, t])

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedEmail = SecurityValidator.sanitizeInput(e.target.value)
        setEmail(sanitizedEmail)

        // Clear error when user starts typing
        if (status === 'error') {
            setStatus('idle')
            setErrorMessage('')
        }
    }, [status])

    return (
        <div className={`w-full max-w-md mx-auto ${className}`}>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={placeholder || t('newsletter.placeholder')}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-dark-bg dark:text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                    {isSubmitting ? t('newsletter.subscribing') : (buttonText || t('newsletter.button'))}
                </button>
            </form>

            {status === 'success' && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm">
                        ✅ {t('newsletter.success')}
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                        ❌ {errorMessage}
                    </p>
                </div>
            )}
        </div>
    )
}

export default NewsletterSignup

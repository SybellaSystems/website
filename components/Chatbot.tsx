'use client'
import { useState, useRef, useEffect } from 'react'
import { logger } from '../lib/logger'
import { useI18n } from '../contexts/I18nContext'

interface Message {
    id: string
    text: string
    isUser: boolean
    timestamp: Date
}

const Chatbot = () => {
    const { t } = useI18n()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: t('chatbot.welcome'),
            isUser: false,
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState<string>('')
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen) {
            logger.userInteraction('Chatbot opened', {
                component: 'Chatbot'
            })
        }
    }, [isOpen])

    const predefinedResponses: Record<string, string> = {
        'services': t('chatbot.services'),
        'pricing': t('chatbot.pricing'),
        'contact': t('chatbot.contact'),
        'ogera': t('chatbot.ogera'),
        'about': t('chatbot.about'),
        'default': t('chatbot.default')
    }

    const getBotResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        if (lowerMessage.includes('service') || lowerMessage.includes('solution')) {
            return predefinedResponses.services
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return predefinedResponses.pricing
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
            return predefinedResponses.contact
        } else if (lowerMessage.includes('ogera')) {
            return predefinedResponses.ogera
        } else if (lowerMessage.includes('about') || lowerMessage.includes('company')) {
            return predefinedResponses.about
        } else {
            return predefinedResponses.default
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isUser: true,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        logger.userInteraction('Chatbot message sent', {
            message: inputValue,
            component: 'Chatbot'
        })

        // Simulate bot typing delay
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputValue),
                isUser: false,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botResponse])
            setIsTyping(false)
        }, 1000)
    }

    const toggleChatbot = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            {/* Chatbot Toggle Button */}
            <button
                onClick={toggleChatbot}
                className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 flex items-center justify-center"
                aria-label="Open chatbot"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-dark-surface rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-dark-blue text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{t('chatbot.title')}</h3>
                            <p className="text-xs opacity-80">{t('chatbot.online')}</p>
                        </div>
                        <button
                            onClick={toggleChatbot}
                            className="text-white hover:text-gray-300"
                            aria-label="Close chatbot"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs p-3 rounded-lg ${message.isUser
                                        ? 'bg-accent text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={t('chatbot.placeholder')}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-dark-bg dark:text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('chatbot.send')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}

export default Chatbot

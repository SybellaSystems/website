'use client'
import { useState, useEffect } from 'react'
import { logger } from '../lib/logger'

interface CountdownTimerProps {
    targetDate: string // ISO date string
    onComplete?: () => void
}

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

const CountdownTimer = ({ targetDate, onComplete }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isExpired, setIsExpired] = useState<boolean>(false)

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeft => {
            const difference = new Date(targetDate).getTime() - new Date().getTime()

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                }
            } else {
                setIsExpired(true)
                if (onComplete) {
                    onComplete()
                }
                return { days: 0, hours: 0, minutes: 0, seconds: 0 }
            }
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        // Initial calculation
        setTimeLeft(calculateTimeLeft())

        logger.info('Countdown timer initialized', {
            targetDate,
            component: 'CountdownTimer'
        })

        return () => clearInterval(timer)
    }, [targetDate, onComplete])

    if (isExpired) {
        return (
            <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-accent mb-2">We're Live!</h3>
                <p className="text-gray-600">Thank you for your patience. Explore our platform now!</p>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-r from-dark-blue to-accent rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Launch Countdown</h3>
            <p className="text-lg mb-6 opacity-90">Get ready for something extraordinary</p>

            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm opacity-80">Days</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm opacity-80">Hours</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm opacity-80">Minutes</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm opacity-80">Seconds</div>
                </div>
            </div>

            <div className="mt-6">
                <button className="px-6 py-3 bg-yellow text-dark-blue font-semibold rounded-lg hover:bg-yellow-400 transition-colors">
                    Notify Me When Live
                </button>
            </div>
        </div>
    )
}

export default CountdownTimer

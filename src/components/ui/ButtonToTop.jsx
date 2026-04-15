import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './ButtonToTop.css'
import { HiArrowSmUp } from 'react-icons/hi'

const ButtonToTop = () => {
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    return (
        <button 
            className={`button-to-top ${showButton ? 'show' : ''}`} 
            onClick={scrollToTop}
            aria-label="Volver arriba"
            title="Volver arriba"
        >
            <div className="button-to-top__content">
                <HiArrowSmUp className="button-to-top__icon" />
            </div>
        </button>
    )
}

export default ButtonToTop
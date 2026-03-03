import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './ButtonToTop.css'
import { FaArrowUp } from 'react-icons/fa'

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
        <button className={`button-to-top ${showButton ? 'show' : ''}`} onClick={scrollToTop}>
            <FaArrowUp />
        </button>
    )
}

export default ButtonToTop
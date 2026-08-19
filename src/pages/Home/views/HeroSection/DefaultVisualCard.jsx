/**
 * DefaultVisualCard.jsx
 * Tarjeta visual por defecto del Hero cuando no hay producto con badge BARGAIN.
 */

import ElectricBorder from '../../../../components/animations/ElectricBorder';
import { LuAudioLines } from "react-icons/lu";

const DefaultVisualCard = () => (
    <ElectricBorder
        color="aqua"
        speed={1}
        chaos={0.15}
        borderRadius={24}
    >
        <div className="hero__visual-card">
            <span className='hero__visual-content'>AudioGem</span>
            <span className='hero__visual-content'><LuAudioLines /></span>
        </div>
    </ElectricBorder>
);

export default DefaultVisualCard;

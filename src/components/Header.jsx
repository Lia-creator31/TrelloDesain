import React from 'react';
import logoPAL from '../assets/PAL.png'; 
import logoDefendID from '../assets/DEFEND_ID.png'; 
import logoUAE from '../assets/LPD_UAE_163m.png';
import logoTAWAZUN from '../assets/TAWAZUN_COUNCIL.png';

const Header = () => {
    return (
        <div className='bg-[#9A9A9A] w-full h-12 p-3 border-b border-b-[#9fadbc29] flex items-center justify-between relative'>
            {/* Left Section */}
            <div className="left flex items-center">
                {/* Teks PAL-PM dengan font Peace Sans */}
                <div 
                    className="text-black text-lg font-bold"
                    style={{
                        fontFamily: "'Peace Sans', sans-serif",
                        fontSize: '24px', // Sesuaikan ukuran font sesuai kebutuhan
                        letterSpacing: '1px' // Opsional: untuk memberi jarak antar huruf
                    }}
                >
                    PAL-PM {/* Tambahkan teks di sini */}
                </div>
            </div>

            {/* Center Logos */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2">
                {/* Gambar Logo 1 */}
                <img 
                    src={logoPAL} 
                    alt="Logo 1" 
                    className="h-7 rounded-full" 
                />
                {/* Gambar Logo 2 */}
                <img 
                    src={logoDefendID} 
                    alt="Logo 2" 
                    className=" h-7 rounded-full" 
                />
                {/* Gambar Logo 3 */}
                <img 
                    src={logoTAWAZUN} 
                    alt="Logo 3" 
                    className=" h-10 rounded-full" 
                />
                {/* Gambar Logo 4 */}
                <img 
                    src={logoUAE} 
                    alt="Logo 4" 
                    className=" h-8 rounded-full" 
                />
            </div>

            {/* Right Section */}
            <div className="right flex items-center space-x-4 text-white">
                {/* Teks "Remote dev" */}
                <span className="text-sm font-medium">Username</span>
                {/* Avatar Pengguna */}
                <img 
                    className="w-7 h-7 rounded-full border border-white" 
                    src="https://placehold.co/28x28/png" 
                    alt="User Avatar" 
                />
            </div>
        </div>
    );
}

export default Header;


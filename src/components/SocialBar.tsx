import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function SocialBar() {
  return (
    <div className="fixed top-1/2 left-4 transform -translate-y-1/2 flex flex-col gap-4 z-50">
      <a href="https://www.instagram.com/automake_ig/" target="_blank" rel="noopener noreferrer">
        <FaInstagram size={28} className="text-pink-500 hover:scale-110 transition" />
      </a>
      <a href="https://www.facebook.com/profile.php?id=100094151359842" target="_blank" rel="noopener noreferrer">
        <FaFacebook size={28} className="text-blue-600 hover:scale-110 transition" />
      </a>
      <a href="https://x.com/HarshVardh43535" target="_blank" rel="noopener noreferrer">
        <FaTwitter size={28} className="text-sky-500 hover:scale-110 transition" />
      </a>
      <a href="https://www.linkedin.com/in/s-harsh-vardhan/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin size={28} className="text-blue-700 hover:scale-110 transition" />
      </a>
    </div>
  );
}
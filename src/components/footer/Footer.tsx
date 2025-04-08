const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 mt-6">
      <div className="flex justify-center items-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} WA Weather App. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

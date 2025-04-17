export default function Navbar() {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/admin/dashboard" className="text-white text-xl font-bold">
            Internship Portal
          </a>
          <div className="space-x-4">
          
            <a href="/login" className="text-white  font-bold text-bold p-2 mt-2.5 rounded-2xl h-1.5 hover:text-red-500  hover:font-extrabold">
              Logout
            </a>
          </div>
        </div>
      </nav>
    );
  }
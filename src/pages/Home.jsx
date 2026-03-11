import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        My Projects
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {project.title}
            </h2>

            <p className="text-gray-600 mb-4">
              {project.description}
            </p>

            <p className="text-sm text-gray-500">
              Author: {project.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
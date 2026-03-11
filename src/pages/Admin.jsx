import { useEffect, useState } from "react";

export default function Admin() {

  const [projects, setProjects] = useState([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);

  const owner = import.meta.env.VITE_GITHUB_OWNER;
  const repo = import.meta.env.VITE_GITHUB_REPO;
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/public/data.json`;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {

    try {

      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json"
        }
      });

      const file = await res.json();

      if (!file.content) {
        console.error("GitHub API error:", file);
        return;
      }

      const decoded = JSON.parse(
        atob(file.content.replace(/\n/g, ""))
      );

      setProjects(decoded.projects);
      setSha(file.sha);
      setLoading(false);

    } catch (error) {

      console.error("Error loading data:", error);

    }

  }

  function updateProject(index, field, value) {

    const updated = [...projects];
    updated[index][field] = value;

    setProjects(updated);
  }

  function addProject() {

    const newProject = {
      title: "",
      description: "",
      author: ""
    };

    setProjects([...projects, newProject]);
  }

  function deleteProject(index) {

    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  }

  async function saveChanges() {

    const newData = {
      projects: projects
    };

    const encoded = btoa(JSON.stringify(newData, null, 2));

    try {

      await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Update projects",
          content: encoded,
          sha: sha
        })
      });

      alert("Projects Updated!");

    } catch (error) {

      console.error("Update failed:", error);
      alert("Error updating data");

    }

  }

  if (loading) return <p className="p-10">Loading admin panel...</p>;

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Project Admin Panel
        </h1>

        <button
          onClick={addProject}
          className="bg-green-600 text-white px-4 py-2 rounded mb-6"
        >
          + Add Project
        </button>

        <div className="space-y-6">

          {projects.map((project, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow"
            >

              <input
                className="border p-2 w-full mb-3"
                placeholder="Project Title"
                value={project.title}
                onChange={(e) =>
                  updateProject(index, "title", e.target.value)
                }
              />

              <textarea
                className="border p-2 w-full mb-3"
                placeholder="Description"
                value={project.description}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
              />

              <input
                className="border p-2 w-full mb-3"
                placeholder="Author"
                value={project.author}
                onChange={(e) =>
                  updateProject(index, "author", e.target.value)
                }
              />

              <button
                onClick={() => deleteProject(index)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

        <button
          onClick={saveChanges}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded"
        >
          Save All Changes
        </button>

      </div>

    </div>

  );

}
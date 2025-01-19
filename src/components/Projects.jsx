import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token =
          "536e0034a3491a9103808cf524abd22aa3131cbd3315c87585f081dfae5f29f7741774ad6ad2b90a18d32e299f7b15f98138d7ae0132af4c6dd400bdab6b66fb0ba9a1aa9d1ebf159007ee90b1a38d63bc21df5de5b58571fa887b2d395f7d4c7dea76a0a4133b4327e84049f18156691ba91ba590b2ebde930bc9289e62da6f"; // Replace with your actual token

        const response = await axios.get(
          "https://portfolio-backend-311n.onrender.com/api/projects?populate=*",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const projectsData = response.data?.data || [];
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen py-10 px-6 lg:px-40 bg-gray-100 dark:bg-gray-900 dark:text-white">
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        My Projects
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          <div className="col-span-full text-center">
            <p className="text-lg">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          projects.map((project) => {
            const {
              id,
              Title: title = "Untitled Project",
              Description: description = "No description provided.",
              Text_Stack: techStack = "Not specified.",
              URL: url = "#",
              Image: image = null,
            } = project;

            const imageUrl = image?.formats?.large?.url || image?.url || null;

            return (
              <motion.div
                key={id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: id * 0.2 }}
              >
                {imageUrl ? (
                  <img
                    src={`https://portfolio-backend-311n.onrender.com${imageUrl}`}
                    alt={title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      No Image Available
                    </p>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3">{title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {description}
                  </p>

                  <div className="mb-4">
                    <strong>Tech Stack:</strong>
                    <p className="text-gray-600 dark:text-gray-300">
                      {techStack}
                    </p>
                  </div>

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-red-700 font-semibold hover:underline"
                  >
                    View Project →
                  </a>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center">
            <p className="text-lg">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

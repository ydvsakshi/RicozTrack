import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem("ricoztrack_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("ricoztrack_user");
      localStorage.removeItem("ricoztrack_token");
      return null;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [risks, setRisks] = useState([]);
  const [dependencies, setDependencies] = useState([]);

  const [taskFilter, setTaskFilter] = useState("All");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [showDependencyForm, setShowDependencyForm] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
    manager: "",
    status: "Planning",
    progress: 0,
    dueDate: "",
  });

  const [newTask, setNewTask] = useState({
    name: "",
    project: "",
    assignedTo: "",
    priority: "Medium",
    status: "Planning",
    dueDate: "",
  });

  const [newResource, setNewResource] = useState({
    name: "",
    role: "",
    skills: "",
    availability: "Available",
    project: "Unassigned",
    workload: 0,
  });

  const [newRisk, setNewRisk] = useState({
    name: "",
    project: "",
    probability: "Medium",
    impact: "Medium",
    severity: "Medium",
    status: "Open",
    mitigation: "",
  });

  const [newDependency, setNewDependency] = useState({
    name: "",
    project: "",
    task: "",
    dependsOn: "",
    type: "Finish-to-Start",
    status: "Pending",
  });

  // =========================
  // AUTHENTICATED API REQUEST
  // =========================

  const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem("ricoztrack_token");

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("ricoztrack_token");
      localStorage.removeItem("ricoztrack_user");

      setLoggedInUser(null);
      setProjects([]);
      setTasks([]);
      setResources([]);
      setRisks([]);
      setDependencies([]);
      setActivePage("Dashboard");
    }

    return response;
  };

  // =========================
  // LOAD PROJECTS
  // =========================

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    apiFetch("http://localhost:5000/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        return response.json();
      })
      .then((data) => {
        const formattedProjects = data.map((project) => ({
          ...project,
          status:
            project.status === "Active"
              ? "In Progress"
              : project.status,
        }));

        setProjects(formattedProjects);

        if (formattedProjects.length > 0) {
          setNewTask((current) => ({
            ...current,
            project:
              current.project || formattedProjects[0].name,
          }));

          setNewRisk((current) => ({
            ...current,
            project:
              current.project || formattedProjects[0].name,
          }));

          setNewDependency((current) => ({
            ...current,
            project:
              current.project || formattedProjects[0].name,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [loggedInUser]);

  // =========================
  // LOAD TASKS
  // =========================

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    apiFetch("http://localhost:5000/api/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((data) => {
        setTasks(data);

        if (data.length > 0) {
          setNewDependency((current) => ({
            ...current,
            task: current.task || data[0].name,
            dependsOn: current.dependsOn || data[0].name,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [loggedInUser]);

  // =========================
  // LOAD RESOURCES
  // =========================

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    apiFetch("http://localhost:5000/api/resources")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        return response.json();
      })
      .then((data) => {
        setResources(data);
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
      });
  }, [loggedInUser]);

  // =========================
  // LOAD RISKS
  // =========================

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    apiFetch("http://localhost:5000/api/risks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch risks");
        }

        return response.json();
      })
      .then((data) => {
        const formattedRisks = data.map((risk) => ({
          ...risk,
          name: risk.title,
          mitigation: risk.mitigation || "",
        }));

        setRisks(formattedRisks);
      })
      .catch((error) => {
        console.error("Error fetching risks:", error);
      });
  }, [loggedInUser]);

  // =========================
  // LOAD DEPENDENCIES
  // =========================

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    apiFetch("http://localhost:5000/api/dependencies")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch dependencies");
        }

        return response.json();
      })
      .then((data) => {
        setDependencies(data);
      })
      .catch((error) => {
        console.error("Error fetching dependencies:", error);
      });
  }, [loggedInUser]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("ricoztrack_token");
    localStorage.removeItem("ricoztrack_user");

    setLoggedInUser(null);
    setProjects([]);
    setTasks([]);
    setResources([]);
    setRisks([]);
    setDependencies([]);
    setActivePage("Dashboard");
  };

  // =========================
  // PROJECT CHANGE
  // =========================

  const handleProjectChange = (event) => {
    const { name, value } = event.target;

    setNewProject((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // TASK CHANGE
  // =========================

  const handleTaskChange = (event) => {
    const { name, value } = event.target;

    setNewTask((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // RESOURCE CHANGE
  // =========================

  const handleResourceChange = (event) => {
    const { name, value } = event.target;

    setNewResource((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // RISK CHANGE
  // =========================

  const handleRiskChange = (event) => {
    const { name, value } = event.target;

    const probability =
      name === "probability"
        ? value
        : newRisk.probability;

    const impact =
      name === "impact"
        ? value
        : newRisk.impact;

    let severity = "Low";

    if (probability === "High" && impact === "High") {
      severity = "Critical";
    } else if (
      (probability === "High" && impact === "Medium") ||
      (probability === "Medium" && impact === "High")
    ) {
      severity = "High";
    } else if (
      (probability === "High" && impact === "Low") ||
      (probability === "Low" && impact === "High")
    ) {
      severity = "Medium";
    } else if (
      probability === "Medium" &&
      impact === "Medium"
    ) {
      severity = "Medium";
    }

    setNewRisk((current) => ({
      ...current,
      [name]: value,
      severity,
    }));
  };

  // =========================
  // DEPENDENCY CHANGE
  // =========================

  const handleDependencyChange = (event) => {
    const { name, value } = event.target;

    setNewDependency((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // CREATE PROJECT
  // =========================

  const handleCreateProject = async (event) => {
    event.preventDefault();

    if (!newProject.name || !newProject.manager) {
      alert("Please enter Project Name and Manager.");
      return;
    }

    const projectData = {
      ...newProject,
      status:
        newProject.status === "In Progress"
          ? "Active"
          : newProject.status,
      progress: Number(newProject.progress),
    };

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create project"
        );
      }

      setProjects((current) => [
        ...current,
        {
          ...data,
          status:
            data.status === "Active"
              ? "In Progress"
              : data.status,
        },
      ]);

      setNewProject({
        name: "",
        manager: "",
        status: "Planning",
        progress: 0,
        dueDate: "",
      });

      setShowProjectForm(false);

      alert("Project created successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not create project.");
    }
  };

  // =========================
  // EDIT PROJECT
  // =========================

  const handleEditProject = (project) => {
    setEditingProjectId(project._id);

    setNewProject({
      name: project.name,
      manager: project.manager,
      status: project.status,
      progress: project.progress,
      dueDate: project.dueDate || "",
    });

    setShowProjectForm(true);
  };

  // =========================
  // UPDATE PROJECT
  // =========================

  const handleUpdateProject = async (event) => {
    event.preventDefault();

    if (!editingProjectId) {
      return;
    }

    const projectData = {
      name: newProject.name,
      manager: newProject.manager,
      status:
        newProject.status === "In Progress"
          ? "Active"
          : newProject.status,
      progress: Number(newProject.progress),
      dueDate: newProject.dueDate,
    };

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/projects/${editingProjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update project"
        );
      }

      const updatedProject = {
        ...data,
        status:
          data.status === "Active"
            ? "In Progress"
            : data.status,
      };

      setProjects((current) =>
        current.map((project) =>
          project._id === editingProjectId
            ? updatedProject
            : project
        )
      );

      setEditingProjectId(null);
      setShowProjectForm(false);

      alert("Project updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not update project.");
    }
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const handleDeleteProject = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project?"
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      setProjects((current) =>
        current.filter((project) => project._id !== id)
      );

      alert("Project deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not delete project.");
    }
  };

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (
      !newTask.name ||
      !newTask.project ||
      !newTask.assignedTo
    ) {
      alert("Please fill Task Name, Project and Assigned To.");
      return;
    }

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create task"
        );
      }

      setTasks((current) => [...current, data]);

      setNewTask({
        name: "",
        project: projects[0]?.name || "",
        assignedTo: "",
        priority: "Medium",
        status: "Planning",
        dueDate: "",
      });

      setShowTaskForm(false);

      alert("Task created successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not create task.");
    }
  };

  // =========================
  // EDIT TASK
  // =========================

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);

    setNewTask({
      name: task.name,
      project: task.project,
      assignedTo: task.assignedTo,
      priority: task.priority || "Medium",
      status: task.status || "Planning",
      dueDate: task.dueDate || "",
    });

    setShowTaskForm(true);
  };

  // =========================
  // UPDATE TASK
  // =========================

  const handleUpdateTask = async (event) => {
    event.preventDefault();

    if (!editingTaskId) {
      return;
    }

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task"
        );
      }

      setTasks((current) =>
        current.map((task) =>
          task._id === editingTaskId ? data : task
        )
      );

      setEditingTaskId(null);
      setShowTaskForm(false);

      alert("Task updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not update task.");
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete task"
        );
      }

      setTasks((current) =>
        current.filter((task) => task._id !== id)
      );

      alert("Task deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not delete task.");
    }
  };

  // =========================
  // CREATE RESOURCE
  // =========================

  const handleCreateResource = async (event) => {
    event.preventDefault();

    if (!newResource.name || !newResource.role) {
      alert("Please enter Resource Name and Role.");
      return;
    }

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/resources",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newResource,
            workload: Number(newResource.workload),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create resource"
        );
      }

      setResources((current) => [...current, data]);

      setNewResource({
        name: "",
        role: "",
        skills: "",
        availability: "Available",
        project: "Unassigned",
        workload: 0,
      });

      setShowResourceForm(false);

      alert("Resource added successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not create resource.");
    }
  };

  // =========================
  // DELETE RESOURCE
  // =========================

  const handleDeleteResource = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this resource?"
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/resources/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete resource"
        );
      }

      setResources((current) =>
        current.filter((resource) => resource._id !== id)
      );

      alert("Resource deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not delete resource.");
    }
  };

  // =========================
  // CREATE RISK
  // =========================

  const handleCreateRisk = async (event) => {
    event.preventDefault();

    if (!newRisk.name || !newRisk.project) {
      alert("Please enter Risk Name and Project.");
      return;
    }

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/risks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newRisk.name,
            project: newRisk.project,
            description: "",
            probability: newRisk.probability,
            impact: newRisk.impact,
            severity: newRisk.severity,
            status: newRisk.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create risk"
        );
      }

      setRisks((current) => [
        ...current,
        {
          ...data,
          name: data.title,
          mitigation: newRisk.mitigation,
        },
      ]);

      setNewRisk({
        name: "",
        project: projects[0]?.name || "",
        probability: "Medium",
        impact: "Medium",
        severity: "Medium",
        status: "Open",
        mitigation: "",
      });

      setShowRiskForm(false);

      alert("Risk added successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not create risk.");
    }
  };

  // =========================
  // DELETE RISK
  // =========================

  const handleDeleteRisk = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this risk?"
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/risks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete risk"
        );
      }

      setRisks((current) =>
        current.filter((risk) => risk._id !== id)
      );

      alert("Risk deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not delete risk.");
    }
  };

  // =========================
  // CREATE DEPENDENCY
  // =========================

  const handleCreateDependency = async (event) => {
    event.preventDefault();

    if (
      !newDependency.name ||
      !newDependency.project ||
      !newDependency.task ||
      !newDependency.dependsOn
    ) {
      alert("Please fill all dependency fields.");
      return;
    }

    try {
      const response = await apiFetch(
        "http://localhost:5000/api/dependencies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDependency),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create dependency"
        );
      }

      setDependencies((current) => [...current, data]);

      setNewDependency({
        name: "",
        project: projects[0]?.name || "",
        task: tasks[0]?.name || "",
        dependsOn: tasks[0]?.name || "",
        type: "Finish-to-Start",
        status: "Pending",
      });

      setShowDependencyForm(false);

      alert("Dependency added successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not create dependency.");
    }
  };

  // =========================
  // DELETE DEPENDENCY
  // =========================

  const handleDeleteDependency = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this dependency?"
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/dependencies/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete dependency"
        );
      }

      setDependencies((current) =>
        current.filter(
          (dependency) => dependency._id !== id
        )
      );

      alert("Dependency deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Could not delete dependency.");
    }
  };

  // =========================
  // DASHBOARD
  // =========================

  const renderDashboard = () => {
    const activeProjects = projects.filter(
      (project) => project.status === "In Progress"
    ).length;

    const completedProjects = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    const activeTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const planningTasks = tasks.filter(
      (task) => task.status === "Planning"
    ).length;

    const averageProgress =
      projects.length > 0
        ? Math.round(
            projects.reduce(
              (total, project) =>
                total + Number(project.progress || 0),
              0
            ) / projects.length
          )
        : 0;

    return (
      <>
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to RicozTrack</p>
          </div>

          <div className="profile">
            👤 {loggedInUser?.name || "Admin"}
          </div>
        </header>

        <section className="cards">
          <div className="card">
            <h3>📁 Total Projects</h3>
            <strong>{projects.length}</strong>
          </div>

          <div className="card">
            <h3>🚀 Active Projects</h3>
            <strong>{activeProjects}</strong>
          </div>

          <div className="card">
            <h3>✅ Completed Projects</h3>
            <strong>{completedProjects}</strong>
          </div>

          <div className="card">
            <h3>📋 Active Tasks</h3>
            <strong>{activeTasks}</strong>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="content-box">
            <h2>📊 Project Progress</h2>

            {projects.length > 0 ? (
              <div className="dashboard-project-list">
                {projects.map((project) => (
                  <div
                    className="dashboard-project-item"
                    key={project._id}
                  >
                    <div className="dashboard-project-heading">
                      <div>
                        <strong>{project.name}</strong>
                        <span>
                          {project.manager || "No manager"}
                        </span>
                      </div>

                      <strong>
                        {Number(project.progress || 0)}%
                      </strong>
                    </div>

                    <div className="progress-bar dashboard-progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Number(project.progress || 0)}%`,
                        }}
                      ></div>
                    </div>

                    <div className="dashboard-project-footer">
                      <span>{project.status}</span>
                      <span>
                        Due: {project.dueDate || "Not set"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No projects found.</p>
            )}
          </div>

          <div className="content-box">
            <h2>📋 Task Summary</h2>

            <div className="dashboard-stat-list">
              <div className="dashboard-stat-row">
                <span>All Tasks</span>
                <strong>{tasks.length}</strong>
              </div>

              <div className="dashboard-stat-row">
                <span>In Progress</span>
                <strong>{activeTasks}</strong>
              </div>

              <div className="dashboard-stat-row">
                <span>Planning</span>
                <strong>{planningTasks}</strong>
              </div>

              <div className="dashboard-stat-row">
                <span>Completed</span>
                <strong>{completedTasks}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="content-box">
          <h2>🎯 Overall Project Progress</h2>

          <div className="overall-progress-wrapper">
            <div className="overall-progress-header">
              <span>Average project completion</span>
              <strong>{averageProgress}%</strong>
            </div>

            <div className="progress-bar overall-progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${averageProgress}%`,
                }}
              ></div>
            </div>
          </div>
        </section>
      </>
    );
  };

  // =========================
  // PROJECTS
  // =========================

  const renderProjects = () => (
    <>
      <header className="topbar">
        <div>
          <h1>Projects</h1>
          <p>Manage and track all your projects</p>
        </div>

        <button
          className="create-button"
          onClick={() => {
            if (showProjectForm) {
              setShowProjectForm(false);
              setEditingProjectId(null);
            } else {
              setEditingProjectId(null);

              setNewProject({
                name: "",
                manager: "",
                status: "Planning",
                progress: 0,
                dueDate: "",
              });

              setShowProjectForm(true);
            }
          }}
        >
          {showProjectForm
            ? "Close Form"
            : "+ Create Project"}
        </button>
      </header>

      {showProjectForm && (
        <section className="form-box">
          <h2>
            {editingProjectId
              ? "Edit Project"
              : "Create New Project"}
          </h2>

          <form
            onSubmit={
              editingProjectId
                ? handleUpdateProject
                : handleCreateProject
            }
          >
            <label>Project Name</label>

            <input
              type="text"
              name="name"
              value={newProject.name}
              onChange={handleProjectChange}
              placeholder="Enter project name"
              required
            />

            <label>Project Manager</label>

            <input
              type="text"
              name="manager"
              value={newProject.manager}
              onChange={handleProjectChange}
              placeholder="Enter manager name"
              required
            />

            <label>Status</label>

            <select
              name="status"
              value={newProject.status}
              onChange={handleProjectChange}
            >
              <option>Planning</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <label>Progress (%)</label>

            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={newProject.progress}
              onChange={handleProjectChange}
            />

            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={newProject.dueDate}
              onChange={handleProjectChange}
            />

            <button
              className="save-button"
              type="submit"
            >
              {editingProjectId
                ? "Update Project"
                : "Save Project"}
            </button>
          </form>
        </section>
      )}

      <section className="content-box">
        <h2>All Projects</h2>

        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Manager</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>{project.manager}</td>
                <td>{project.status}</td>
                <td>{project.progress}%</td>
                <td>
                  {project.dueDate || "Not set"}
                </td>

                <td>
                  <button
                    className="edit-button"
                    onClick={() =>
                      handleEditProject(project)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteProject(project._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <p>No projects found.</p>
        )}
      </section>
    </>
  );

  // =========================
  // TASKS
  // =========================

  const renderTasks = () => {
    const filteredTasks =
      taskFilter === "All"
        ? tasks
        : tasks.filter(
            (task) => task.status === taskFilter
          );

    return (
      <>
        <header className="topbar">
          <div>
            <h1>Tasks</h1>
            <p>Manage and track project tasks</p>
          </div>

          <button
            className="create-button"
            onClick={() => {
              if (showTaskForm) {
                setShowTaskForm(false);
                setEditingTaskId(null);
              } else {
                setEditingTaskId(null);

                setNewTask({
                  name: "",
                  project: projects[0]?.name || "",
                  assignedTo: "",
                  priority: "Medium",
                  status: "Planning",
                  dueDate: "",
                });

                setShowTaskForm(true);
              }
            }}
          >
            {showTaskForm
              ? "Close Form"
              : "+ Create Task"}
          </button>
        </header>

        {showTaskForm && (
          <section className="form-box">
            <h2>
              {editingTaskId
                ? "Edit Task"
                : "Create New Task"}
            </h2>

            <form
              onSubmit={
                editingTaskId
                  ? handleUpdateTask
                  : handleCreateTask
              }
            >
              <label>Task Name</label>

              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleTaskChange}
                placeholder="Enter task name"
                required
              />

              <label>Project</label>

              <select
                name="project"
                value={newTask.project}
                onChange={handleTaskChange}
              >
                <option value="">
                  Select Project
                </option>

                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project.name}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              <label>Assigned To</label>

              <input
                type="text"
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleTaskChange}
                placeholder="Enter person name"
                required
              />

              <label>Priority</label>

              <select
                name="priority"
                value={newTask.priority}
                onChange={handleTaskChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <label>Status</label>

              <select
                name="status"
                value={newTask.status}
                onChange={handleTaskChange}
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleTaskChange}
              />

              <button
                className="save-button"
                type="submit"
              >
                {editingTaskId
                  ? "Update Task"
                  : "Save Task"}
              </button>
            </form>
          </section>
        )}

        <section className="content-box">
          <div className="task-header">
            <h2>All Tasks</h2>

            <div className="task-filters">
              {[
                "All",
                "Planning",
                "In Progress",
                "Completed",
              ].map((filter) => (
                <button
                  key={filter}
                  className={
                    taskFilter === filter
                      ? "filter-active"
                      : ""
                  }
                  onClick={() =>
                    setTaskFilter(filter)
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.project}</td>
                  <td>{task.assignedTo}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.dueDate || "Not set"}
                  </td>

                  <td>
                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEditTask(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteTask(task._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <p>No tasks found.</p>
          )}
        </section>
      </>
    );
  };

  // =========================
  // RESOURCES
  // =========================

  const renderResources = () => {
    const availableResources = resources.filter(
      (resource) =>
        (resource.availability ||
          resource.status) === "Available"
    ).length;

    const busyResources = resources.filter(
      (resource) =>
        (resource.availability ||
          resource.status) === "Busy"
    ).length;

    return (
      <>
        <header className="topbar">
          <div>
            <h1>Resources</h1>
            <p>
              Manage project resources and team members
            </p>
          </div>

          <button
            className="create-button"
            onClick={() =>
              setShowResourceForm(
                !showResourceForm
              )
            }
          >
            {showResourceForm
              ? "Close Form"
              : "+ Add Resource"}
          </button>
        </header>

        {showResourceForm && (
          <section className="form-box">
            <h2>Add New Resource</h2>

            <form onSubmit={handleCreateResource}>
              <label>Resource Name</label>

              <input
                type="text"
                name="name"
                value={newResource.name}
                onChange={handleResourceChange}
                placeholder="Enter resource name"
                required
              />

              <label>Role</label>

              <input
                type="text"
                name="role"
                value={newResource.role}
                onChange={handleResourceChange}
                placeholder="e.g. Frontend Developer"
                required
              />

              <label>Skills</label>

              <input
                type="text"
                name="skills"
                value={newResource.skills}
                onChange={handleResourceChange}
                placeholder="React, JavaScript"
              />

              <label>Availability</label>

              <select
                name="availability"
                value={newResource.availability}
                onChange={handleResourceChange}
              >
                <option>Available</option>
                <option>Busy</option>
              </select>

              <label>Project</label>

              <select
                name="project"
                value={newResource.project}
                onChange={handleResourceChange}
              >
                <option>Unassigned</option>

                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project.name}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              <label>Workload (%)</label>

              <input
                type="number"
                name="workload"
                min="0"
                max="100"
                value={newResource.workload}
                onChange={handleResourceChange}
              />

              <button
                className="save-button"
                type="submit"
              >
                Save Resource
              </button>
            </form>
          </section>
        )}

        <section className="cards">
          <div className="card">
            <h3>Total Resources</h3>
            <strong>{resources.length}</strong>
          </div>

          <div className="card">
            <h3>Available</h3>
            <strong>{availableResources}</strong>
          </div>

          <div className="card">
            <h3>Busy</h3>
            <strong>{busyResources}</strong>
          </div>
        </section>

        <section className="content-box">
          <h2>All Resources</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Project</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((resource) => (
                <tr key={resource._id}>
                  <td>{resource.name}</td>
                  <td>
                    {resource.role || resource.type}
                  </td>
                  <td>
                    {resource.project ||
                      "Unassigned"}
                  </td>
                  <td>
                    {resource.availability ||
                      resource.status}
                  </td>

                  <td>
                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteResource(
                          resource._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {resources.length === 0 && (
            <p>No resources found.</p>
          )}
        </section>
      </>
    );
  };

  // =========================
  // RISKS
  // =========================

  const renderRisks = () => (
    <>
      <header className="topbar">
        <div>
          <h1>Risks</h1>
          <p>Identify and manage project risks</p>
        </div>

        <button
          className="create-button"
          onClick={() =>
            setShowRiskForm(!showRiskForm)
          }
        >
          {showRiskForm
            ? "Close Form"
            : "+ Add Risk"}
        </button>
      </header>

      {showRiskForm && (
        <section className="form-box">
          <h2>Add New Risk</h2>

          <form onSubmit={handleCreateRisk}>
            <label>Risk Name</label>

            <input
              type="text"
              name="name"
              value={newRisk.name}
              onChange={handleRiskChange}
              placeholder="Enter risk name"
              required
            />

            <label>Project</label>

            <select
              name="project"
              value={newRisk.project}
              onChange={handleRiskChange}
            >
              <option value="">
                Select Project
              </option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project.name}
                >
                  {project.name}
                </option>
              ))}
            </select>

            <label>Probability</label>

            <select
              name="probability"
              value={newRisk.probability}
              onChange={handleRiskChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Impact</label>

            <select
              name="impact"
              value={newRisk.impact}
              onChange={handleRiskChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Severity</label>

            <input
              type="text"
              value={newRisk.severity}
              readOnly
            />

            <label>Status</label>

            <select
              name="status"
              value={newRisk.status}
              onChange={handleRiskChange}
            >
              <option>Open</option>
              <option>Mitigated</option>
            </select>

            <label>Mitigation Plan</label>

            <input
              type="text"
              name="mitigation"
              value={newRisk.mitigation}
              onChange={handleRiskChange}
              placeholder="Enter mitigation plan"
            />

            <button
              className="save-button"
              type="submit"
            >
              Save Risk
            </button>
          </form>
        </section>
      )}

      <section className="content-box">
        <h2>All Risks</h2>

        <table>
          <thead>
            <tr>
              <th>Risk</th>
              <th>Project</th>
              <th>Probability</th>
              <th>Impact</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Mitigation</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {risks.map((risk) => (
              <tr key={risk._id}>
                <td>{risk.name}</td>
                <td>{risk.project}</td>
                <td>{risk.probability}</td>
                <td>{risk.impact}</td>
                <td>{risk.severity}</td>
                <td>{risk.status}</td>
                <td>
                  {risk.mitigation || "-"}
                </td>

                <td>
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteRisk(risk._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {risks.length === 0 && (
          <p>No risks found.</p>
        )}
      </section>
    </>
  );

  // =========================
  // DEPENDENCIES
  // =========================

  const renderDependencies = () => (
    <>
      <header className="topbar">
        <div>
          <h1>Dependencies</h1>
          <p>
            Manage task and project dependencies
          </p>
        </div>

        <button
          className="create-button"
          onClick={() =>
            setShowDependencyForm(
              !showDependencyForm
            )
          }
        >
          {showDependencyForm
            ? "Close Form"
            : "+ Add Dependency"}
        </button>
      </header>

      {showDependencyForm && (
        <section className="form-box">
          <h2>Add New Dependency</h2>

          <form onSubmit={handleCreateDependency}>
            <label>Dependency Name</label>

            <input
              type="text"
              name="name"
              value={newDependency.name}
              onChange={handleDependencyChange}
              placeholder="Enter dependency name"
              required
            />

            <label>Project</label>

            <select
              name="project"
              value={newDependency.project}
              onChange={handleDependencyChange}
            >
              <option value="">
                Select Project
              </option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project.name}
                >
                  {project.name}
                </option>
              ))}
            </select>

            <label>Task</label>

            <select
              name="task"
              value={newDependency.task}
              onChange={handleDependencyChange}
            >
              <option value="">
                Select Task
              </option>

              {tasks.map((task) => (
                <option
                  key={task._id}
                  value={task.name}
                >
                  {task.name}
                </option>
              ))}
            </select>

            <label>Depends On</label>

            <input
              type="text"
              name="dependsOn"
              value={newDependency.dependsOn}
              onChange={handleDependencyChange}
              placeholder="Enter dependent task"
              required
            />

            <label>Dependency Type</label>

            <select
              name="type"
              value={newDependency.type}
              onChange={handleDependencyChange}
            >
              <option>Finish-to-Start</option>
              <option>Start-to-Start</option>
              <option>Finish-to-Finish</option>
              <option>Start-to-Finish</option>
            </select>

            <label>Status</label>

            <select
              name="status"
              value={newDependency.status}
              onChange={handleDependencyChange}
            >
              <option>Pending</option>
              <option>Active</option>
              <option>Completed</option>
            </select>

            <button
              className="save-button"
              type="submit"
            >
              Save Dependency
            </button>
          </form>
        </section>
      )}

      <section className="content-box">
        <h2>All Dependencies</h2>

        <table>
          <thead>
            <tr>
              <th>Dependency</th>
              <th>Project</th>
              <th>Task</th>
              <th>Depends On</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {dependencies.map((dependency) => (
              <tr key={dependency._id}>
                <td>{dependency.name}</td>
                <td>{dependency.project}</td>
                <td>{dependency.task}</td>
                <td>{dependency.dependsOn}</td>
                <td>{dependency.type}</td>
                <td>{dependency.status}</td>

                <td>
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteDependency(
                        dependency._id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {dependencies.length === 0 && (
          <p>No dependencies found.</p>
        )}
      </section>
    </>
  );

  // =========================
  // REPORTS
  // =========================

  const renderReports = () => {
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const planningTasks = tasks.filter(
      (task) => task.status === "Planning"
    ).length;

    const availableResources = resources.filter(
      (resource) =>
        (resource.availability ||
          resource.status) === "Available"
    ).length;

    const busyResources = resources.filter(
      (resource) =>
        (resource.availability ||
          resource.status) === "Busy"
    ).length;

    const openRisks = risks.filter(
      (risk) => risk.status === "Open"
    ).length;

    const criticalRisks = risks.filter(
      (risk) => risk.severity === "Critical"
    ).length;

    const highRisks = risks.filter(
      (risk) => risk.severity === "High"
    ).length;

    const mitigatedRisks = risks.filter(
      (risk) => risk.status === "Mitigated"
    ).length;

    const activeDependencies =
      dependencies.filter(
        (dependency) =>
          dependency.status === "Active"
      ).length;

    const pendingDependencies =
      dependencies.filter(
        (dependency) =>
          dependency.status === "Pending"
      ).length;

    const completedDependencies =
      dependencies.filter(
        (dependency) =>
          dependency.status === "Completed"
      ).length;

    return (
      <>
        <header className="topbar">
          <div>
            <h1>Reports</h1>
            <p>
              Project performance and management reports
            </p>
          </div>
        </header>

        <section className="content-box">
          <h2>📋 Task Report</h2>

          <div className="cards">
            <div className="card">
              <h3>Total Tasks</h3>
              <strong>{tasks.length}</strong>
            </div>

            <div className="card">
              <h3>Completed</h3>
              <strong>{completedTasks}</strong>
            </div>

            <div className="card">
              <h3>In Progress</h3>
              <strong>{inProgressTasks}</strong>
            </div>

            <div className="card">
              <h3>Planning</h3>
              <strong>{planningTasks}</strong>
            </div>
          </div>
        </section>

        <section className="content-box">
          <h2>👥 Resource Report</h2>

          <div className="cards">
            <div className="card">
              <h3>Total Resources</h3>
              <strong>{resources.length}</strong>
            </div>

            <div className="card">
              <h3>Available</h3>
              <strong>{availableResources}</strong>
            </div>

            <div className="card">
              <h3>Busy</h3>
              <strong>{busyResources}</strong>
            </div>
          </div>
        </section>

        <section className="content-box">
          <h2>⚠️ Risk Report</h2>

          <div className="cards">
            <div className="card">
              <h3>Total Risks</h3>
              <strong>{risks.length}</strong>
            </div>

            <div className="card">
              <h3>Open Risks</h3>
              <strong>{openRisks}</strong>
            </div>

            <div className="card">
              <h3>Critical Risks</h3>
              <strong>{criticalRisks}</strong>
            </div>

            <div className="card">
              <h3>High Risks</h3>
              <strong>{highRisks}</strong>
            </div>

            <div className="card">
              <h3>Mitigated</h3>
              <strong>{mitigatedRisks}</strong>
            </div>
          </div>
        </section>

        <section className="content-box">
          <h2>🔗 Dependency Report</h2>

          <div className="cards">
            <div className="card">
              <h3>Total Dependencies</h3>
              <strong>
                {dependencies.length}
              </strong>
            </div>

            <div className="card">
              <h3>Active</h3>
              <strong>
                {activeDependencies}
              </strong>
            </div>

            <div className="card">
              <h3>Pending</h3>
              <strong>
                {pendingDependencies}
              </strong>
            </div>

            <div className="card">
              <h3>Completed</h3>
              <strong>
                {completedDependencies}
              </strong>
            </div>
          </div>
        </section>

        <section className="content-box">
          <h2>📊 Project Performance</h2>

          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td>{project.manager}</td>
                  <td>{project.status}</td>
                  <td>{project.progress}%</td>
                  <td>
                    {project.dueDate || "Not set"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </>
    );
  };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!loggedInUser) {
    return (
      <Login
        onLogin={(user) => {
          setLoggedInUser(user);
        }}
      />
    );
  }

  // =========================
  // MAIN APPLICATION
  // =========================

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>RicozTrack</h2>

        <nav>
          <button
            className={
              activePage === "Dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Dashboard")
            }
          >
            📊 Dashboard
          </button>

          <button
            className={
              activePage === "Projects"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Projects")
            }
          >
            📁 Projects
          </button>

          <button
            className={
              activePage === "Tasks"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Tasks")
            }
          >
            ✅ Tasks
          </button>

          <button
            className={
              activePage === "Resources"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Resources")
            }
          >
            👥 Resources
          </button>

          <button
            className={
              activePage === "Risks"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Risks")
            }
          >
            ⚠️ Risks
          </button>

          <button
            className={
              activePage === "Dependencies"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Dependencies")
            }
          >
            🔗 Dependencies
          </button>

          <button
            className={
              activePage === "Reports"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Reports")
            }
          >
            📈 Reports
          </button>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              color: "#ffb4b4",
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {activePage === "Dashboard" &&
          renderDashboard()}

        {activePage === "Projects" &&
          renderProjects()}

        {activePage === "Tasks" &&
          renderTasks()}

        {activePage === "Resources" &&
          renderResources()}

        {activePage === "Risks" &&
          renderRisks()}

        {activePage === "Dependencies" &&
          renderDependencies()}

        {activePage === "Reports" &&
          renderReports()}
      </main>
    </div>
  );
}

export default App;
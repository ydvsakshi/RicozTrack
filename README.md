\# RicozTrack



RicozTrack is a full-stack project management application designed to help teams manage projects, tasks, resources, risks, and dependencies from a single dashboard.



\## Features



\* 📊 Dashboard with project overview

\* 📁 Project management

\* ✅ Task management

\* 👥 Resource management

\* ⚠️ Risk management

\* 🔗 Dependency tracking

\* 📈 Reports section

\* 🔐 User Signup and Login

\* 🔑 JWT-based authentication

\* 🛡️ Protected backend APIs

\* 💾 MongoDB data persistence

\* 🔄 CRUD operations

\* 📱 Responsive user interface



\## Tech Stack



\### Frontend



\* React.js

\* Vite

\* JavaScript

\* HTML

\* CSS



\### Backend



\* Node.js

\* Express.js

\* MongoDB

\* Mongoose



\### Authentication



\* JSON Web Token (JWT)

\* bcryptjs



\## Project Structure



```text

RicozTrack/

│

├── backend/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   ├── server.js

│   ├── package.json

│   └── package-lock.json

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── Login.jsx

│   │   ├── index.css

│   │   └── main.jsx

│   ├── package.json

│   └── package-lock.json

│

└── .gitignore

```



\## Main Modules



\### Dashboard



Provides an overview of projects and their progress.



\### Projects



Users can create and manage projects, including project manager, status, progress, and due date.



\### Tasks



Users can create and manage tasks with project assignment, assignee, priority, status, and due date.



\### Resources



Provides resource management functionality for team members.



\### Risks



Allows users to record and manage project risks.



\### Dependencies



Allows users to track dependencies between project items.



\### Reports



Provides a centralized reports section for project information.



\## Authentication



RicozTrack uses JWT authentication to protect backend APIs.



The application supports:



\* User registration

\* User login

\* Password hashing using bcrypt

\* JWT token generation

\* Protected API routes

\* Logout functionality



\## Installation



\### 1. Clone the repository



```bash

git clone https://github.com/ydvsakshi/RicozTrack.git

cd RicozTrack

```



\### 2. Install backend dependencies



```bash

cd backend

npm install

```



\### 3. Configure environment variables



Create a `.env` file inside the `backend` folder.



Example:



```env

MONGO\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_jwt\_secret

PORT=5000

```



Do not upload your actual `.env` file or database credentials to GitHub.



\### 4. Start the backend



```bash

node server.js

```



Backend runs on:



```text

http://localhost:5000

```



\### 5. Install frontend dependencies



Open another terminal:



```bash

cd frontend

npm install

```



\### 6. Start the frontend



```bash

npm run dev

```



Frontend runs on:



```text

http://localhost:5173

```



\## API Modules



The backend provides API routes for:



\* Authentication

\* Projects

\* Tasks

\* Resources

\* Risks

\* Dependencies



Protected APIs require a valid JWT authentication token.



\## Data Persistence



Project, task, resource, risk, and dependency data are stored in MongoDB.



Data remains available after refreshing or restarting the application.



\## Security



\* Passwords are hashed before storage.

\* JWT is used for authentication.

\* Protected APIs reject unauthorized requests.

\* Environment variables are excluded from Git using `.gitignore`.



\## Future Scope



Possible future improvements include:



\* Advanced analytics

\* Email notifications

\* Team collaboration

\* Role-based access control

\* File/document management

\* Advanced reporting and charts

\* Deployment to a cloud platform



\## Author



\*\*Sakshi Yadav\*\*



GitHub: https://github.com/ydvsakshi



\## Repository



https://github.com/ydvsakshi/RicozTrack






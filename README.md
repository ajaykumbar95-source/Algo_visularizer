# 🔬 AlgoVisual Laboratory

A high-performance, interactive algorithm visualization platform designed to help students and developers master data structures and algorithms through step-by-step trace generation and real-time visual feedback.

## 🚀 Key Features

### Core Functionality
- **FR-01 Algorithm Selection**: Choose from 12+ supported Sorting and Graph algorithms (Bubble, Quick, Dijkstra, BFS, DFS, etc.).
- **FR-02 Custom Input**: Enter your own numeric arrays or graph data to visualize specific edge cases.
- **FR-03 Trace Generation**: Advanced backend engine calculates full execution traces before visualization begins.
- **FR-04 Step Navigation**: Granular control to move forward or backward through every single step of the algorithm.
- **FR-05 Auto-Play**: Hands-free visualization with adjustable playback speed.
- **FR-10 Input Validation**: Intelligent rejection of invalid data with clear, user-friendly error messages.

### Educational Insights
- **FR-06 Pseudocode Sync**: Real-time highlighting of the active pseudocode line for every step.
- **FR-07 Complexity Info**: Instant access to Time (Best/Average/Worst) and Space complexity for all algorithms.
- **FR-08 Variable Panel**: Live snapshots of internal variables (pointers, counters, distances) as they change.
- **FR-09 Speed Control**: Adjustable animation speeds from 0.5x to 4x.

### User & Admin Management
- **User Accounts**: Secure Login and Signup system to save personal visualization history.
- **Admin Dashboard**: Comprehensive management interface for administrators to oversee users and their activity.
- **Global History**: Track and revisit previous algorithm executions for comparative learning.

## 🛠️ Technology Stackflowchart TD
  U[User] -->|selects algorithm / inputs data| F[Frontend React App]
  F -->|POST /api/trace
  {algorithmId, input}| S[Backend Express API]
  S -->|calls| A[Trace Engine]
  A -->|generates JSON step trace| S
  S -->|returns trace data| F
  F -->|renders visualization
  {steps, pseudocode, state}| V[Sorting/Graph Visualizer]
  F -->|POST /api/auth/login
  {credentials}| S
  S -->|verify JWT / bcrypt| DB[Database / Prisma]
  S -->|issue JWT| F
  F -->|GET /api/history| S
  S -->|fetch history| DB
  DB -->|history records| S
  S -->|return history| F
  subgraph Frontend
    F
    V
  end
  subgraph Backend
    S
    A
  end
  subgraph Data Layer
    DB
  end
  classDef service fill:#f9f,stroke:#333,stroke-width:1px;
  class F,S,A,DB service;

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (TypeScript), Tailwind CSS, Framer Motion |
| **Backend** | Node.js (Express), TypeScript, JWT Authentication |
| **Database** | SQLite with Prisma ORM |
| **API Style** | RESTful JSON API |

## 📐 Software Process Model: Agile (Iterative)

The laboratory was developed using an **Agile/Iterative** approach to ensure high quality and flexibility:
- **Iterative Refinement**: Complex visualizers were built incrementally, allowing for fine-tuning of animation physics and UI responsiveness.
- **Contract-Driven**: A shared type definition system ensures seamless integration between the Node.js backend and React frontend.
- **Continuous Integration**: Concurrent development of client and server allowed for immediate identification and resolution of integration issues.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
### 🔑 Environment Variables

The application requires several environment variables to be set up. A template is provided in [.env.example](file:///Users/shree/Desktop/algo_visualiser/.env.example).

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | The port the backend server will run on | `5001` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your-secret-key` |
| `DATABASE_URL` | Prisma database connection string | `file:../dev.db` |

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algo_visualiser
   ```

2. **Setup Environment Files**
   Copy the example environment file to the `server` and `database` directories:
   ```bash
   cp .env.example server/.env
   cp .env.example database/.env
   ```
   *Note: Ensure `DATABASE_URL` in `database/.env` points correctly to your database file.*

3. **Setup the Backend**
   ```bash
   cd server
   npm install
   npx prisma db push
   npx prisma generate
   npm run dev
   ```

4. **Setup the Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---
*Developed as a modern laboratory for algorithm exploration.*

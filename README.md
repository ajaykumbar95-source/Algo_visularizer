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

## 🛠️ Technology Stack

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

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algo_visualiser
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   npx prisma db push
   npx prisma generate
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---
*Developed as a modern laboratory for algorithm exploration.*

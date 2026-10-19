# prog7312-poe-mavundlankosana
## Programming 3B POE repository

# Smart-X
**Author:** Nkosana Mavundla
**ST Number:** ST10434391
**Project:** PROG7312 POE

# Links
**YouTube Demo:** https://youtu.be/z7IeMISnCt0

**GitHub Link:** https://github.com/MavundlaNkosana/prog7312-poe-mavundlankosana/


## Overview
The Smart-X Ecosystem has evolved from a static data ingestion gateway (Part 1) into a dynamic, real-time processing engine (Part 2). Managing a live network of edge devices requires highly optimized data handling to prevent bottlenecks. This iteration introduces a highly responsive Command Stream, real PBKDF2 authentication, and a backend powered entirely by advanced C# data structures.

## Key Technical Implementations
* **Advanced OOP:** Zero-boxing data handling using `TelemetryPacket<T>` generics and custom operator overloading for direct data manipulation.
* **Memory Optimization:** Jagged arrays (`float[][]`) for burst telemetry buffering and efficient memory layout.
* **Recursive Algorithms:** Deep network hierarchy validation using a recursive `DeploymentNode` algorithm.
* **Enterprise Security:** On-the-fly AES-256 file encryption utilizing `CryptoStream` for large multipart log attachments without degrading server RAM.
* **UX Strategy:** Preattentive visual pulsing and strict client-side regex validation (IEEE 802 MAC format).
* **Enterprise Security & Authentication:** Scrapped hardcoded credentials in favor of a true in-memory Identity API using PBKDF2 Hashing. Passwords are securely salted and hashed using Rfc2898DeriveBytes before issuing cryptographic session tokens.
* **UI/UX & State Preservation:** Asynchronous navigation from a lifted React state to the root application component. Operators can switch seamlessly between the "Ingestion" and "Command Stream" modules without losing volatile telemetry data or spatial map configurations.
* **Predictive Action Engine** Automated insights from analyzing historical sensor queries and data patterns using frequency mapping to proactively suggest related commands and highlight potentially problematic devices before manual intervention is needed.
* **Advanced Data Structures Engine:** To achieve flawless streaming logic and O(1) instantaneous lookups, the IoTDataService implements:    
* Queues & Priority Queues: Standard telemetry flows through a FIFO Queue<T>, while critical alerts (e.g., severe power spikes) bypass the queue via a PriorityQueue<TElement, TPriority> for zero-latency processing.
* Stacks: A LIFO Stack<T> manages the manual override history, powering an instant "Undo Last Action" feature.
* Dictionaries & Sorted Dictionaries: Dictionary<TKey, TValue> provides O(1) device caching and lookup, while a SortedDictionary<TKey, TValue> organizes historical logs sequentially for timeline efficiency.
* HashSets: A HashSet<T> tracks unique active error states, algorithmically preventing the system from processing duplicate alerts for the same sensor.

---

## Quick Start Guide

### Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/)
* [Node.js & npm](https://nodejs.org/) (v18+ recommended)
* Docker Desktop (Optional, for containerized execution)

### Step 1: Booting the .NET Backend
Open your terminal and navigate to the backend directory:

```cd SmartX.Server```

Restore the required C# packages and dependencies:

```dotnet restore```

Build the project to ensure there are no compilation errors:

```dotnet build```

Run the server (Note the assigned localhost port in the terminal output, typically 5001 or 7123):

```dotnet run```

(Alternatively, you can run the backend via Docker Desktop by launching the Docker profile in Visual Studio).

### Step 2: Deploying the React Client App
Open a second, separate terminal and navigate to the frontend directory:

```cd smartx.client```

Install the necessary Node modules (including Vite, React, Lucide-React, and Tailwind CSS v4):

```npm install```

Boot the Vite development server:

```npm run dev```

### Step 3: Accessing the Application
Open your browser and navigate to the local Vite URL provided in the terminal (e.g., http://localhost:57009).

Ensure the API_BASE_URL in App.jsx matches the port your C# server is running on.

# prog7312-poe-mavundlankosana
Programming 3B POE repository

# Smart-X
**Author:** Nkosana Mavundla
**ST Number:** ST10434391
**Project:** PROG7312 POE PART 1

# Links
**YouTube Demo:** https://youtu.be/5A8OFTE04dY

**GitHub Link:** https://github.com/MavundlaNkosana/prog7312-poe-mavundlankosana/


## Overview
Smart-X is a high-performance edge-computing IoT gateway system. It features a robust C# .NET 10 Minimal API backend designed for high-throughput sensor telemetry, paired with a modern React/Tailwind CSS frontend for real-time spatial topology mapping and preattentive anomaly detection.

## Key Technical Implementations
* **Advanced OOP:** Zero-boxing data handling using `TelemetryPacket<T>` generics and custom operator overloading for direct data manipulation.
* **Memory Optimization:** Jagged arrays (`float[][]`) for burst telemetry buffering and efficient memory layout.
* **Recursive Algorithms:** Deep network hierarchy validation using a recursive `DeploymentNode` algorithm.
* **Enterprise Security:** On-the-fly AES-256 file encryption utilizing `CryptoStream` for large multipart log attachments without degrading server RAM.
* **UX Strategy:** Preattentive visual pulsing and strict client-side regex validation (IEEE 802 MAC format).

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

# 🚀 Sui AI Coin - Backend

This document provides a step-by-step guide to setting up and running the backend for **Sui AI Coin**.

---

## 🛠 Prerequisites

Before running the backend, ensure you have the following installed:

- **Node.js** (>= 20.x) 

---

## 🚀 Installation & Running

Follow these steps to set up and start the backend:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/badukwei/sui-ai-coin.git
cd sui-ai-coin/backend
```

### 2️⃣ Install Dependencies
``` bash
npm install  
```

### 3️⃣ Set Up Environment Variables
Create a .env file based on the example:

```bash
cp .env.example .env
```
Then, edit .env and add your API keys.


### 4️⃣ Start the Backend Server

```bash
npm run build
npm run start
```

Once running, the backend should be accessible at:
http://localhost:5050
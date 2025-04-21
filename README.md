# Drawing App

This is a full-stack drawing application built with Node.js, React, and MongoDB. The application allows users to create and share drawings in real-time. This README provides instructions for setting up and running the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (either a local instance or a cloud-based service like MongoDB Atlas)

## Project Structure

The project is organized into two main folders:
- **client**: Contains the React frontend.
- **server**: Contains the Node.js/Express backend.

The root directory includes a `package.json` with a `concurrently` script to run both the client and server simultaneously.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd whiteboard-application
```

### 2. Install Root Dependencies
In the root directory, install the `concurrently` package:
```bash
npm install
```

### 3. Set Up the Client
Navigate to the `client` folder and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder with the following content:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_AUTH_TOKEN_KEY=secret_key_mitul
REACT_APP_SOCKET_CONNECTION_BACKEND_BASE_URL=http://localhost:5000/
REACT_APP_SMOOTH_FACTOR=.5
```

### 4. Set Up the Server
Navigate to the `server` folder and install dependencies:
```bash
cd ../server
npm install
```

Create a `.env` file in the `server` folder with the following content:
```
JWT_SECRET=secret_key_mitul
MONGO_URI=<your-mongodb-uri>
PORT=5000
IMGBB_API_KEY=36837f90ad4bc026c064d7f18e837604
```

**Note**: Replace `<your-mongodb-uri>` with your own MongoDB connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/drawApp`). You can set up a free MongoDB Atlas cluster or use a local MongoDB instance.

### 5. Running the Application

#### Option 1: Run Client and Server Concurrently
From the **root directory**, use the following command to start both the client and server:
```bash
npm run start
```

This will:
- Start the server on `http://localhost:5000`
- Start the client on `http://localhost:3000` (default React port)

#### Option 2: Run Client and Server Separately
- **Server**: Navigate to the `server` folder and run:
  ```bash
  cd server
  npm run server
  ```
  The server will run on `http://localhost:5000`.

- **Client**: In a separate terminal, navigate to the `client` folder and run:
  ```bash
  cd client
  npm run start
  ```
  The client will run on `http://localhost:3000`.

### 6. Accessing the Application
Once both the client and server are running, open your browser and navigate to:
```
http://localhost:3000
```

You can now use the drawing app, create drawings.
## Environment Variables

### Client (.env)
- `REACT_APP_API_BASE_URL`: The base URL for API requests (default: `http://localhost:5000/api`).
- `REACT_APP_AUTH_TOKEN_KEY`: Key for storing JWT tokens in the browser.(default: `secret_key_mitul`).
- `REACT_APP_SOCKET_CONNECTION_BACKEND_BASE_URL`: WebSocket connection URL (default: `http://localhost:5000/`).
- `REACT_APP_SMOOTH_FACTOR`: Smoothing factor for drawing (default: `0.5`).

### Server (.env)
- `JWT_SECRET`: Secret key for signing JWT tokens.(default: `secret_key_mitul`).
- `MONGO_URI`: MongoDB connection string (example: `mongodb+srv://<username>:<secret key>@cluster0.gynoovb.mongodb.net/drawApp`)..
- `PORT`: Server port (default: `5000`).
- `IMGBB_API_KEY`: API key for image hosting on ImgBB.(default: `36837f90ad4bc026c064d7f18e837604`).

## Troubleshooting

- **MongoDB Connection Issues**: Ensure your MongoDB URI is correct and that your IP is whitelisted in MongoDB Atlas (if using Atlas).
- **Port Conflicts**: If port `5000` or `3000` is in use, update the `PORT` in the server `.env` or let React choose a different port.
- **CORS Errors**: Verify that the `REACT_APP_API_BASE_URL` matches the server’s running URL.

## Contributing
To contribute to this project:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.
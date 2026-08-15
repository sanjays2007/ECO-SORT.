
# EcoSort-Vision

This project has two main parts that need to be running at the same time:
1.  **The Web App (Next.js)**: This is the user interface you see in your browser.
2.  **The AI Service (Python)**: This is a local service that handles waste detection.

You will need **two separate terminal windows** to run both.

## Running the Application

### Step 1: Run the Web App (Terminal 1)

This starts the main application.

```bash
# Install dependencies (only need to do this once)
npm install

# Start the web app
npm run dev
```
After this, you can open http://localhost:9002 in your browser. You will see the app, but the AI scanner will show an "Offline" error until you complete Step 2.

### Step 2: Run the AI Service (Terminal 2)

This starts the local Python service that performs the AI waste detection.

**First-Time Setup (Do this only once)**

If this is your first time running the project, you need to set up the Python environment.

1.  **Navigate to the service directory:**
    ```bash
    cd yolo-service
    ```

2.  **Create a Python virtual environment:**
    ```bash
    python3 -m venv .venv
    ```

3.  **Activate the virtual environment:**
    *   On macOS/Linux:
        ```bash
        source .venv/bin/activate
        ```
    *   On Windows (PowerShell):
        ```powershell
        .\.venv\Scripts\Activate.ps1
        ```
    _You should see `(.venv)` at the beginning of your terminal prompt._

4.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```
    > **Note:** If you see an error related to `cv2`, `libGL.so.1`, or `libxcb.so.1` when starting the service, it means a system dependency for OpenCV is missing. This can be fixed by re-running `pip install -r requirements.txt` inside your activated virtual environment to ensure the correct "headless" version of OpenCV is used.

**Start the Service (Do this every time)**

Once the first-time setup is complete, follow these steps in your second terminal to start the AI service.

1.  **Navigate to the service directory (if you're not already there):**
    ```bash
    cd yolo-service
    ```
2.  **Activate the virtual environment (if it's not already active):**
    *   On macOS/Linux:
        ```bash
        source .venv/bin/activate
        ```
    *   On Windows (PowerShell):
        ```powershell
        .\.venv\Scripts\Activate.ps1
        ```

3.  **Run the AI service:**
    ```bash
    python3 -m uvicorn app:app --reload --port 8000
    ```

Once both services are running, refresh the app at http://localhost:9002. The "AI Service Offline" message should disappear, and you can start scanning items.

    
    
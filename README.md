# CV Assist

An AI-powered web application that provides instant feedback on your CV (resume) to help you optimize it for job applications.

## Features

- **CV Upload & Analysis**: Upload your CV and receive AI-driven feedback on structure, content, and keywords.
- **Detailed Feedback Reports**: Get actionable insights to improve your resume's effectiveness.
- **Stats Dashboard**: Track your CV's performance metrics and improvement suggestions.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend Workflow**: n8n for AI processing and automation

## Prerequisites

- Node.js (v18 or higher)
- n8n (for workflow automation)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cv-assist.git
   cd cv-assist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## n8n Workflow Setup

This project uses n8n for handling the AI feedback workflow. To set it up:

1. Install and run n8n locally or use the cloud version.
2. Import the workflow: Copy the workflow JSON code from `n8n-workflow.json` (or wherever it's located) and paste it into n8n's workflow editor.
3. Configure any necessary API keys (e.g., for AI services like OpenAI).
4. Start the workflow and ensure it's accessible via webhook or API for the frontend to connect.

## Usage

1. Ensure n8n workflow is running and configured.
2. Navigate to the upload page in the app.
3. Upload your CV file.
4. View the AI-generated feedback and stats from the dashboard.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
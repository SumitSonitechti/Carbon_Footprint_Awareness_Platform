# 🌱 footprint.ai — Carbon Footprint Awareness Platform

**footprint.ai** is a minimalist, responsive, and highly interactive carbon footprint tracking application designed for hackers and climate advocates alike. The platform helps individuals calculate their annual greenhouse gas emissions across travel, energy, diet, and waste consumption, and leverage **Google Gemini API** to generate a single, highly actionable, personalized tip to reduce their primary carbon hotspot.

Built as a Next.js 16 App Router application with Tailwind CSS, TypeScript, and a multi-stage Docker configuration.

---

## ✨ Features

- **🚶 Multi-category Lifestyle Form**: A tabbed questionnaire detailing travel mileage, flights, home heating sources, green electricity shares, dietary preferences, and recycling rates.
- **📊 Pure SVG Interactive Donut Chart**: Smooth, responsive graphics generated dynamically with vanilla SVGs. Uses zero charting library overhead to ensure instant load times and peak performance.
- **🤖 Google Gemini API integration**: Real-time analysis of user lifestyle inputs to extract their single largest "Carbon Hot Spot" and return a contextual, motivating reduction action plan.
- **⚡ Smart Heuristic Fallback**: Includes local estimation algorithms that automatically provide highly accurate carbon breakdown graphs and reduction recommendations if no Gemini API Key is configured.
- **🐳 Standalone Docker Integration**: Optimized using Next.js standalone server traces to produce a minimal production container ready for **Google Cloud Run** and other cloud environments.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Analytics**: Google Gemini API (`gemini-1.5-flash`)
- **Containerization**: Docker (multi-stage alpine build)

---

## 📦 Local Installation & Setup

Ensure you have **Node.js 20+** installed on your system.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SumitSonitechti/Carbon_Footprint_Awareness_Platform.git
   cd Carbon_Footprint_Awareness_Platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   *(Note: If left blank, the app will gracefully activate local smart heuristic calculation models to show breakdown graphs and tips).*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Running with Docker

This project includes a multi-stage Dockerfile optimized to run Next.js inside a lightweight Alpine base:

1. **Build the image**:
   ```bash
   docker build -t carbon-platform .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:8080 -e GEMINI_API_KEY="your_api_key_here" carbon-platform
   ```
   The application will be accessible at [http://localhost:8080](http://localhost:8080).

---

## ☁️ Deployment

### Google Cloud Run
Since the Dockerfile is fully configured, you can build and deploy directly to Google Cloud Run:
```bash
gcloud run deploy carbon-platform --source . --env-vars-file=env.yaml --port=8080
```

### Vercel Deployment
To deploy this project to Vercel:
1. Push the code to GitHub (already completed).
2. Go to the [Vercel Dashboard](https://vercel.com/new).
3. Import the `Carbon_Footprint_Awareness_Platform` repository.
4. In the Project Settings, under **Environment Variables**, add:
   - Name: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key_value`
5. Click **Deploy**.

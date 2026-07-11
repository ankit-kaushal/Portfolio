# 🧑‍💻 Ankit Kaushal - Portfolio

Personal portfolio built with **Next.js** and **CSS Modules**.

🔗 [Live Website](https://portfolio-phi-seven-45.vercel.app)

---

## 🚀 Features

- Fully responsive layout
- Project showcase with descriptions and live links
- Skills and work experience section
- Travel Journey: visual log of places explored
- Contact section with email integration
- Admin dashboard for content management

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: CSS Modules
- **State**: Redux
- **Deployment**: Vercel

---

## 🖥️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankit-kaushal/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values. If migrating from the old CRA setup, rename `REACT_APP_*` variables to `NEXT_PUBLIC_*`.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components (CSS Modules)
├── views/            # Page-level view components
├── lib/              # Redux store, actions, reducers
└── data/             # Static config and fallback data
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (updates data + sitemap) |
| `npm start` | Start production server |
| `npm run lint:all` | Lint JS and CSS |

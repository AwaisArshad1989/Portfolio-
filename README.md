# Awais Arshad Portfolio

A modern multi-page portfolio website for Awais Arshad, showcasing research, projects, skills, education, achievements, and contact information.

This project presents a cyber-inspired dark theme with interactive sections, responsive layout, animated background, project cards, and research-focused content.

## Overview

The portfolio includes:

- Home page with hero section and quick navigation
- About section with background and professional profile
- Research section highlighting AI and data science work
- Skills section covering technical stack and capabilities
- Projects section with project descriptions and demo video support
- Experience and achievements pages
- Education and contact details
- Downloadable CV link

## Project Structure

```text
Portfolio/
├── index.html
├── about.html
├── research.html
├── skills.html
├── projects.html
├── experience.html
├── achievements.html
├── education.html
├── contact.html
├── style.css
├── script.js
├── Awais.png
├── Awais_Arshad_Reseach_Cv.pdf
├── README.md
└── .gitignore
```

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Python (for local static server)
- Git and GitHub for version control and deployment

## Run Locally

From the project directory, run:

```powershell
cd "C:\Users\lenovo\Desktop\Portfolio"
py -m http.server 8000
```

Then open in the browser:

```text
http://localhost:8000
```

If `py` does not work on your machine, try:

```powershell
python -m http.server 8000
```

## Deploy to GitHub Pages

1. Initialize Git and commit the project:

```powershell
git init
git add .
git commit -m "Initial portfolio commit"
```

2. Connect to your GitHub repository:

```powershell
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

3. In GitHub, go to:
   `Settings` → `Pages`

4. Select the branch and folder to publish, then save.

Your site will be available at:

```text
https://<your-username>.github.io/<your-repo-name>/
```

## License

This project is for personal portfolio use.

## Contact

For questions or collaboration, use the contact section on the website or reach out via the email provided in the portfolio.

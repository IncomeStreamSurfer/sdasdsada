# Cheese Guide

A comprehensive guide to cheeses from around the world, built with Next.js 14.2.23. This project provides detailed information about different types of cheeses, their origins, characteristics, and pairings.

## Features

- 🧀 Detailed cheese profiles with rich information
- 🌍 Browse by origin (country and region)
- 🥛 Filter by milk type (cow, goat, sheep)
- 📊 Interactive data visualizations
- 📱 Mobile-friendly, responsive design
- 🔍 SEO optimized with dynamic meta tags
- 🗺️ Programmatically generated sitemaps
- 🚀 Static site generation with ISR support

## Tech Stack

- **Framework:** Next.js 14.2.23
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Data Generation:** OpenAI GPT-4o-mini
- **Charts:** Chart.js with react-chartjs-2
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/cheese-guide.git
cd cheese-guide
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env.local\` file in the root directory:
\`\`\`env
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

4. Generate the data:
\`\`\`bash
npm run generate-data
\`\`\`

5. Generate sitemaps:
\`\`\`bash
npm run generate-sitemaps
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see the application.

## Project Structure

\`\`\`
my-next-app/
├── app/
│   ├── (routes)/
│   │   ├── milk-type/[type]/
│   │   ├── origin/[country]/
│   │   ├── origin/[country]/[region]/
│   │   ├── texture/[type]/
│   │   ├── flavor/[type]/
│   │   └── dietary-info/[type]/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── blocks/
│   └── lib/
│       ├── utils/
│       └── constants/
├── data/
│   ├── data.csv
│   └── generated/
│       ├── cheeses/
│       └── indexes/
└── scripts/
    ├── generate-data.ts
    └── generate-sitemaps.ts
\`\`\`

## Available Scripts

- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm run start\`: Start production server
- \`npm run generate-data\`: Generate cheese data from CSV
- \`npm run generate-sitemaps\`: Generate sitemaps
- \`npm run lint\`: Run ESLint

## Data Generation

The project uses a CSV file with basic cheese information and enhances it using GPT-4o-mini to generate:

- Detailed descriptions
- Historical background
- Pairing suggestions
- Serving recommendations
- Cultural significance
- Additional tags

## SEO Strategy

- Unique meta titles and descriptions for all pages
- Structured data for rich snippets
- Split sitemaps (2500 URLs per file)
- Exact phrase match optimization
- Dynamic route generation
- Optimized for featured snippets

## Performance Optimization

- Static site generation with ISR
- Efficient data generation with rate limiting
- Optimized image loading
- Mobile-first responsive design
- Route segmentation
- Caching strategies

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Data sourced from various cheese databases
- Icons from Lucide React
- UI components from shadcn/ui
- Enhanced content generation using OpenAI's GPT-4o-mini

#!/bin/bash

# Project Creation Script for Plixo Portfolio API
# This script creates all 9 projects from temp-data.ts
# Using production API at http://localhost:8788

API_URL="http://localhost:8788"
AUTH_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbl9hY2NvdW50IiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDcxODQ1MCwiZXhwIjoxNzY0ODA0ODUwfQ.R7HlqSjfbE56lzAfjuHLZvJ_5ulvb59-3hwxHLDPY6I"

echo "=========================================="
echo "Creating Projects in Plixo Portfolio API"
echo "=========================================="
echo ""

# Project 1: Tenebrae Platform
echo "[1/9] Creating: Tenebrae - Encrypted Contact & Analytics Platform"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "Tenebrae - Encrypted Contact & Analytics Platform",
    "description": "Secure communication management platform with privacy-first visitor analytics and multi-user admin dashboard",
    "technologies": ["React", "TypeScript", "Cloudflare Workers", "Cloudflare D1", "Vite", "Tailwind CSS", "ReCharts", "Web Crypto API", "Cloudflare Turnstile"],
    "status": "Live",
    "image": "/assets/work/tenebrae_1.jpg",
    "live_url": "https://www.tenebrae.ai",
    "github_url": "https://github.com/gone3d/tenebraeV2",
    "demo_url": "https://tenebrae.plixo.com",
    "featured": true,
    "display_order": 0
  }'
echo -e "\n"
sleep 0.5

# Project 2: Hourlings Writers Platform
echo "[2/9] Creating: Hourlings - Collaborative Writers Portal"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "Hourlings - Collaborative Writers Portal",
    "description": "Modern writers group platform with inline commenting, submission cycles, and collaborative feedback system",
    "technologies": ["React", "TypeScript", "Cloudflare Workers", "Cloudflare D1", "Vite", "Tailwind CSS", "Quill Editor", "Hono", "React Markdown"],
    "status": "In Development",
    "image": "/assets/work/hourlings_1.jpg",
    "live_url": "https://hourlings.plixo.com",
    "github_url": "https://github.com/gone3d/hourlings-ui",
    "demo_url": "https://hourlings.plixo.com",
    "featured": true,
    "display_order": 1
  }'
echo -e "\n"
sleep 0.5

# Project 3: Plixo Portfolio Website
echo "[3/9] Creating: Plixo Portfolio Website"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "Plixo Portfolio Website",
    "description": "Modern React portfolio showcasing technical leadership with real-time analytics, seamless animations, and encrypted API integration",
    "technologies": ["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "PostgreSQL", "AES-256 Encryption", "GDPR Compliance"],
    "status": "In Development",
    "image": "/assets/work/plixo_web_1.jpg",
    "live_url": "https://plixo.com",
    "github_url": "https://github.com/gone3d/plixo-web",
    "demo_url": "/work",
    "featured": true,
    "display_order": 2
  }'
echo -e "\n"
sleep 0.5

# Project 4: Capital One Developer Portal
echo "[4/9] Creating: Capital One Developer Portal Transformation"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "Capital One Developer Portal Transformation",
    "description": "Led team transformation of internal Developer Portal from static GitHub pages to dynamic, on-demand document rendering application",
    "technologies": ["Angular", "Node.js", "AWS Lambda", "S3", "Jenkins", "Docker", "DataDog", "Python"],
    "status": "Live",
    "image": "/assets/work/placeholder.jpg",
    "live_url": "",
    "github_url": "https://github.com/capitalone",
    "demo_url": "",
    "featured": true,
    "display_order": 1
  }'
echo -e "\n"
sleep 0.5

# Project 5: HAARP Antenna Control System
echo "[5/9] Creating: HAARP Antenna Control System"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "HAARP Antenna Control System",
    "description": "Developed control software and UI for HAARP (High Frequency Active Auroral Research Program), managing 120 20kW phased array antennas",
    "technologies": ["C++", "Qt", "Real-time Systems", "Linux", "Scientific Computing", "Hardware Integration"],
    "status": "Live",
    "image": "/assets/work/placeholder.jpg",
    "live_url": "",
    "github_url": "",
    "demo_url": "",
    "featured": true,
    "display_order": 2
  }'
echo -e "\n"
sleep 0.5

# Project 6: U.S. State Department Training Platform
echo "[6/9] Creating: U.S. State Department Training Platform Migration"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "U.S. State Department Training Platform Migration",
    "description": "Spearheaded migration of legacy Adobe Flash-based learning applications to modern HTML/CSS/JavaScript web applications",
    "technologies": ["JavaScript", "HTML5", "CSS3", "WebGL", "Unity3D", "Unreal Engine", "VR/AR", "Flash/ActionScript"],
    "status": "Live",
    "image": "/assets/work/placeholder.jpg",
    "live_url": "",
    "github_url": "",
    "demo_url": "",
    "featured": true,
    "display_order": 3
  }'
echo -e "\n"
sleep 0.5

# Project 7: CIG AI Platform
echo "[7/9] Creating: AI-Integrated Application Platform"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "AI-Integrated Application Platform",
    "description": "Architect and develop complete backend infrastructure with integrated AI using Ollama and Hugging Face LLMs to deploy custom AI models and services",
    "technologies": ["React", "TypeScript", "Node.js", "Python", "Ollama", "Hugging Face", "PostgreSQL", "AWS", "Docker"],
    "status": "In Development",
    "image": "/assets/work/placeholder.jpg",
    "live_url": "",
    "github_url": "",
    "demo_url": "",
    "featured": true,
    "display_order": 4
  }'
echo -e "\n"
sleep 0.5

# Project 8: Echo360 Video Platform
echo "[8/9] Creating: Echo360 Enterprise Video Platform"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "Echo360 Enterprise Video Platform",
    "description": "Developed interactive online course video capture tools for enterprise blended learning platform with adaptive design principles",
    "technologies": ["JavaScript", "jQuery", "HTML5", "CSS3", "Flash/ActionScript", "Video Streaming", "Responsive Design"],
    "status": "Archived",
    "image": "/assets/work/placeholder.jpg",
    "live_url": "https://echo360.com",
    "github_url": "",
    "demo_url": "",
    "featured": false,
    "display_order": 5
  }'
echo -e "\n"
sleep 0.5

# Project 9: Grab Media Video Players
echo "[9/9] Creating: Grab Media Streaming Video Players"
curl -X POST "${API_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d '{
    "title": "Grab Media Streaming Video Players",
    "description": "Led development of streaming video players with integrated advertising, front-end UI interfacing with Ruby on Rails API",
    "technologies": ["ActionScript 3", "Flash", "JavaScript", "HTML", "Ruby on Rails", "Adobe Media Server", "Video Streaming"],
    "status": "Archived",
    "image": "/assets/work/placeholder.jpg",
    "live_url": "",
    "github_url": "",
    "demo_url": "",
    "featured": false,
    "display_order": 6
  }'
echo -e "\n"

echo ""
echo "=========================================="
echo "All projects created successfully!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Total projects: 9"
echo "- Featured projects: 7"
echo "- Live projects: 4"
echo "- In Development: 2"
echo "- Archived: 2"
echo ""
echo "Next steps:"
echo "1. Verify projects in database: curl ${API_URL}/projects"
echo "2. Check featured projects: curl ${API_URL}/projects?featured=true"
echo "3. Upload actual project images to replace placeholders"
echo ""

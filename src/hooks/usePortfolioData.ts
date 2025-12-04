// Portfolio Data Hooks - Convenient data access
// Phase 2: Data management and API integration preparation

import { useMemo } from 'react'
import { useGlobal, useProjects, useExperiences, useSkills } from '../contexts/GlobalContext'
import type { Project, Skill, TechnologyCategory } from '../types/portfolio'

/**
 * Hook for comprehensive portfolio statistics
 */
export function usePortfolioStats() {
  const { state } = useGlobal()
  const { projects } = useProjects()
  const { experiences } = useExperiences()
  const { skills } = useSkills()

  return useMemo(() => {
    const stats = {
      // Project Statistics
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length,
      liveProjects: projects.filter(p => p.status === 'Live').length,
      inDevelopmentProjects: projects.filter(p => p.status === 'In Development').length,

      // Experience Statistics
      totalExperiences: experiences.length,
      yearsExperience: state.data.portfolioOverview?.yearsExperience || 0,
      currentRole: experiences.find(exp => !exp.endDate)?.role,
      currentCompany: experiences.find(exp => !exp.endDate)?.company,

      // Skills Statistics
      totalSkills: skills.length,
      expertSkills: skills.filter(s => s.proficiency === 5).length,
      learningSkills: skills.filter(s => s.learning).length,
      recentlyUsedSkills: skills.filter(s => s.recentlyUsed).length,

      // Technology Categories
      frontendSkills: skills.filter(s => s.category === 'frontend').length,
      backendSkills: skills.filter(s => s.category === 'backend').length,
      cloudSkills: skills.filter(s => s.category === 'cloud').length,
      aiMlSkills: skills.filter(s => s.category === 'ai-ml').length,

      // Engagement Metrics
      projectsWithLiveUrls: projects.filter(p => p.live_url).length,
      projectsWithGithub: projects.filter(p => p.github_url).length
    }

    return stats
  }, [projects, experiences, skills, state.data.portfolioOverview])
}

/**
 * Hook for filtered and sorted projects
 */
export function useProjectsFiltered() {
  const { projects } = useProjects()
  const { state } = useGlobal()

  return useMemo(() => {
    let filtered = [...projects]

    // Apply search query
    if (state.ui.searchQuery) {
      const query = state.ui.searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.technologies.some(tech => tech.toLowerCase().includes(query))
      )
    }

    // Sort by priority (featured first), then by date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      if (a.featured && b.featured) return a.priority - b.priority
      const aDate = a.updated_at || a.lastUpdated
      const bDate = b.updated_at || b.lastUpdated
      return new Date(bDate).getTime() - new Date(aDate).getTime()
    })

    return {
      filteredProjects: filtered,
      totalCount: projects.length,
      filteredCount: filtered.length,
      hasActiveFilters: !!state.ui.filters.projectCategory || !!state.ui.searchQuery
    }
  }, [projects, state.ui.filters, state.ui.searchQuery])
}

/**
 * Hook for skills analysis and grouping
 */
export function useSkillsAnalysis() {
  const { skills } = useSkills()
  const { state } = useGlobal()

  return useMemo(() => {
    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<TechnologyCategory, Skill[]>)

    // Sort skills within each category by proficiency and recent use
    Object.keys(skillsByCategory).forEach(category => {
      skillsByCategory[category as TechnologyCategory].sort((a, b) => {
        // Prioritize recently used skills
        if (a.recentlyUsed && !b.recentlyUsed) return -1
        if (!a.recentlyUsed && b.recentlyUsed) return 1

        // Then by proficiency
        if (a.proficiency !== b.proficiency) return b.proficiency - a.proficiency

        // Then by years of experience
        return b.yearsExperience - a.yearsExperience
      })
    })

    // Calculate category statistics
    const categoryStats = Object.entries(skillsByCategory).map(([category, categorySkills]) => ({
      category: category as TechnologyCategory,
      count: categorySkills.length,
      averageProficiency: categorySkills.reduce((sum, skill) => sum + skill.proficiency, 0) / categorySkills.length,
      expertCount: categorySkills.filter(s => s.proficiency === 5).length,
      learningCount: categorySkills.filter(s => s.learning).length,
      recentCount: categorySkills.filter(s => s.recentlyUsed).length
    }))

    // Apply filters
    let filteredSkills = skills
    if (state.ui.filters.skillCategory) {
      filteredSkills = skills.filter(s => s.category === state.ui.filters.skillCategory)
    }

    return {
      skillsByCategory,
      categoryStats,
      filteredSkills,
      totalSkills: skills.length,
      coreSkills: skills.filter(s => s.proficiency >= 4 && s.recentlyUsed),
      learningSkills: skills.filter(s => s.learning),
      expertiseAreas: categoryStats
        .filter(cat => cat.averageProficiency >= 4)
        .sort((a, b) => b.averageProficiency - a.averageProficiency)
    }
  }, [skills, state.ui.filters])
}

/**
 * Hook for career timeline and progression analysis
 */
export function useCareerTimeline() {
  const { experiences } = useExperiences()

  return useMemo(() => {
    // Sort experiences by start date (most recent first)
    const sortedExperiences = [...experiences].sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )

    // Calculate career progression metrics
    const careerStats = {
      totalYears: 0,
      totalCompanies: experiences.length,
      averageTenure: 0,
      longestTenure: 0,
      currentTenure: 0,
      industries: [...new Set(experiences.map(exp => exp.industry))],
      companySizes: [...new Set(experiences.map(exp => exp.companySize))],
      hasSecurityClearance: experiences.some(exp => exp.clearanceLevel),
      maxClearanceLevel: experiences
        .filter(exp => exp.clearanceLevel)
        .sort((a, b) => {
          const clearanceLevels = ['Public Trust', 'Secret', 'Top Secret', 'TS/SCI']
          return clearanceLevels.indexOf(b.clearanceLevel!) - clearanceLevels.indexOf(a.clearanceLevel!)
        })[0]?.clearanceLevel
    }

    // Calculate tenure for each experience
    const experiencesWithTenure = sortedExperiences.map(exp => {
      const startDate = new Date(exp.startDate)
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date()
      const tenureMonths = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
      const tenureYears = Math.round(tenureMonths / 12 * 10) / 10

      return {
        ...exp,
        tenureMonths,
        tenureYears,
        isCurrent: !exp.endDate
      }
    })

    // Update career stats
    careerStats.totalYears = Math.round(
      experiencesWithTenure.reduce((sum, exp) => sum + exp.tenureYears, 0) * 10
    ) / 10

    careerStats.averageTenure = Math.round(
      (careerStats.totalYears / experiencesWithTenure.length) * 10
    ) / 10

    careerStats.longestTenure = Math.max(
      ...experiencesWithTenure.map(exp => exp.tenureYears)
    )

    careerStats.currentTenure = experiencesWithTenure.find(exp => exp.isCurrent)?.tenureYears || 0

    return {
      experiences: experiencesWithTenure,
      careerStats,
      currentExperience: experiencesWithTenure.find(exp => exp.isCurrent),
      timeline: experiencesWithTenure.map(exp => ({
        id: exp.id,
        company: exp.company,
        role: exp.role,
        startDate: exp.startDate,
        endDate: exp.endDate,
        duration: exp.tenureYears,
        category: exp.category,
        industry: exp.industry
      }))
    }
  }, [experiences])
}

/**
 * Hook for project technology analysis
 */
export function useProjectTechnologies() {
  const { projects } = useProjects()

  return useMemo(() => {
    // Aggregate all technologies used across projects (simplified - technologies are now just strings)
    const technologyUsage = new Map<string, {
      name: string
      projectCount: number
      projects: Project[]
    }>()

    projects.forEach(project => {
      project.technologies.forEach(techName => {
        const existing = technologyUsage.get(techName)
        if (existing) {
          existing.projectCount++
          existing.projects.push(project)
        } else {
          technologyUsage.set(techName, {
            name: techName,
            projectCount: 1,
            projects: [project]
          })
        }
      })
    })

    // Convert to array and sort by usage frequency
    const technologyStats = Array.from(technologyUsage.values())
      .sort((a, b) => {
        // Sort by project count
        if (a.projectCount !== b.projectCount) return b.projectCount - a.projectCount
        // Then alphabetically
        return a.name.localeCompare(b.name)
      })

    return {
      technologyStats,
      mostUsedTechnologies: technologyStats.slice(0, 10),
      totalUniqueTechnologies: technologyStats.length,
      averageProjectTechCount: projects.reduce((sum, p) => sum + p.technologies.length, 0) / projects.length
    }
  }, [projects])
}

/**
 * Hook for search and filtering functionality
 */
export function useSearch() {
  const { state, dispatch } = useGlobal()

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }

  const setFilters = (filters: Partial<typeof state.ui.filters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const clearFilters = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })
    dispatch({ type: 'SET_FILTERS', payload: {} })
  }

  return {
    searchQuery: state.ui.searchQuery,
    filters: state.ui.filters,
    setSearchQuery,
    setFilters,
    clearFilters,
    hasActiveSearch: !!state.ui.searchQuery || Object.keys(state.ui.filters).length > 0
  }
}
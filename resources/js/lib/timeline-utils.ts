import type { Event } from "./types"

export const getAuthorColor = (role: string) => {
  switch (role) {
    case "far":
    case "father":
      return "bg-gradient-to-br from-green-100 to-green-200 border-green-300 text-green-900 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700 dark:text-green-100"
    case "mor":
    case "mother":
      return "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-900 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700 dark:text-blue-100"
    case "myndighed":
    case "consultant":
      return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-900 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700 dark:text-yellow-100"
    default:
      return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-900 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-700 dark:text-gray-100"
  }
}

export const getCategoryColor = (category: Event["category"]) => {
  switch (category) {
    case "afgørelse":
    case "vejledning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200"
    case "familieret":
    case "barnet":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
    case "korrespondance":
    case "rapport":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
  }
}

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const sortTimelineItems = (items: Event[]) => {
  return [...items].sort((a, b) => b.timestamp - a.timestamp)
}

export const filterTimelineItems = (
  items: Event[],
  searchTerm: string,
  selectedAuthor?: string,
  selectedCategory?: string,
  dateRange?: { start: string; end: string },
) => {
  // Ensure items is an array
  if (!Array.isArray(items)) {
    console.warn('filterTimelineItems: items is not an array:', items);
    return [];
  }

  return items.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(item.tags) ? item.tags : []).some((tag) =>
        typeof tag === 'string' ? tag.toLowerCase().includes(searchTerm.toLowerCase()) : tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesAuthor = !selectedAuthor || item.author === selectedAuthor
    const matchesCategory = !selectedCategory || item.category === selectedCategory

    let matchesDateRange = true
    if (dateRange?.start || dateRange?.end) {
      const itemDate = new Date(item.timestamp)
      const startDate = dateRange.start ? new Date(dateRange.start) : null
      const endDate = dateRange.end ? new Date(dateRange.end + "T23:59:59") : null

      if (startDate && itemDate < startDate) matchesDateRange = false
      if (endDate && itemDate > endDate) matchesDateRange = false
    }

    return matchesSearch && matchesAuthor && matchesCategory && matchesDateRange
  })
}

export const groupItemsByDate = (items: Event[]) => {
  const groups: { [key: string]: Event[] } = {}

  items.forEach((item) => {
    const date = new Date(item.timestamp).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
  })

  return groups
}

export const formatGroupDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

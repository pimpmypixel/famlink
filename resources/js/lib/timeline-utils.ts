import type { TimelineItem } from "./types"

export const getAuthorColor = (author: TimelineItem["author"]) => {
  switch (author) {
    case "father":
      return "bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-100"
    case "mother":
      return "bg-pink-100 border-pink-300 text-pink-900 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-100"
    case "consultant":
      return "bg-green-100 border-green-300 text-green-900 dark:bg-green-900/20 dark:border-green-700 dark:text-green-100"
    default:
      return "bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-100"
  }
}

export const getCategoryColor = (category: TimelineItem["category"]) => {
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

export const sortTimelineItems = (items: TimelineItem[]) => {
  return [...items].sort((a, b) => b.timestamp - a.timestamp)
}

export const filterTimelineItems = (
  items: TimelineItem[],
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
      (Array.isArray(item.tags) ? item.tags : []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

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

export const groupItemsByDate = (items: TimelineItem[]) => {
  const groups: { [key: string]: TimelineItem[] } = {}

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

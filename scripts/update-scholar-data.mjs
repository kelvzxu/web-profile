import { readFile, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const authorId = process.env.SCHOLAR_AUTHOR_ID || 'NxJb3rEAAAAJ'
const apiKey = process.env.SERPAPI_KEY
const dataPath = resolve('src/data/scholar.json')

if (!apiKey) {
  throw new Error('SERPAPI_KEY is required. Add it as a GitHub Actions secret.')
}

function normalizeTitle(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function metricValue(table, pattern) {
  for (const row of table || []) {
    for (const [label, values] of Object.entries(row || {})) {
      const key = label.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (!pattern.test(key)) continue

      const value = Number(values?.all ?? values?.total)
      if (Number.isFinite(value)) return value
    }
  }

  return null
}

function inferType(publication) {
  if (/\b(book|buku|textbook)\b/i.test(publication)) return 'Book'
  if (/conference|proceedings|symposium|workshop|seminar|congress/i.test(publication)) {
    return 'Conference'
  }
  return publication ? 'Journal' : 'Other'
}

async function fetchAuthorPage(start = 0) {
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google_scholar_author')
  url.searchParams.set('author_id', authorId)
  url.searchParams.set('hl', 'en')
  url.searchParams.set('num', '100')
  url.searchParams.set('api_key', apiKey)
  if (start > 0) url.searchParams.set('start', String(start))

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`SerpApi request failed with HTTP ${response.status}. Existing JSON was kept.`)
  }

  const result = await response.json()
  if (result.search_metadata?.status !== 'Success' || !Array.isArray(result.articles)) {
    throw new Error('SerpApi returned an unsuccessful or unexpected response. Existing JSON was kept.')
  }

  return result
}

const previous = JSON.parse(await readFile(dataPath, 'utf8'))
const previousTypes = new Map(
  previous.publications.map((publication) => [normalizeTitle(publication.title), publication.type]),
)

const firstPage = await fetchAuthorPage()
const articles = [...firstPage.articles]

for (let start = articles.length; articles.length >= 100; start += 100) {
  const page = await fetchAuthorPage(start)
  if (page.articles.length === 0) break
  articles.push(...page.articles)
  if (page.articles.length < 100) break
}

const table = firstPage.cited_by?.table
const metrics = {
  citations: metricValue(table, /^(citations?|citation)$/),
  hIndex: metricValue(table, /^(hindex|indiceh)$/),
  i10Index: metricValue(table, /^(i10index|indicei10)$/),
}

if (Object.values(metrics).some((value) => value === null)) {
  throw new Error('Could not read all three Scholar metrics. Existing JSON was kept.')
}

const publications = articles
  .filter((article) => article.title)
  .map((article) => {
    const publication = article.publication || ''
    const year = Number(article.year || publication.match(/(?:19|20)\d{2}/g)?.at(-1)) || null
    const venue = publication.replace(/[,\s]+(?:19|20)\d{2}\s*$/, '').trim()
    const titleKey = normalizeTitle(article.title)

    return {
      year,
      type: previousTypes.get(titleKey) || inferType(publication),
      citations: Number(article.cited_by?.value) || 0,
      title: article.title,
      authors: article.authors || '',
      venue,
      link: article.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(article.title)}`,
    }
  })

const apiCitationGraph = firstPage.cited_by?.graph
const citationHistory = Array.isArray(apiCitationGraph) && apiCitationGraph.length > 0
  ? apiCitationGraph
    .map((item) => ({ year: Number(item.year), citations: Number(item.citations) || 0 }))
    .filter((item) => Number.isFinite(item.year))
  : previous.citationHistory || []

const output = {
  updatedAt: new Date().toISOString(),
  metrics,
  citationHistory,
  publications,
}
const temporaryPath = `${dataPath}.tmp`
await writeFile(temporaryPath, `${JSON.stringify(output, null, 2)}\n`)
await rename(temporaryPath, dataPath)

console.log(`Updated ${publications.length} publications and Scholar metrics.`)

import { DocSearch } from "@docsearch/react"
import { DocSearchHit } from "./doc-search-hit"

export function Search() {
  return (
    <DocSearch
      appId="IL96ROKQXM"
      indexName="uwuui_com_il96rokqxm_pages"
      apiKey="56f5c1644f1c26ca966cbd5cb71c52fa"
      placeholder="Search documentation..."
      disableUserPersonalization
      maxResultsPerGroup={10}
      initialQuery="Text"
      hitComponent={({ hit }) => <DocSearchHit hit={hit} />}
      translations={{
        button: {
          buttonText: 'Search docs...',
          buttonAriaLabel: 'Search documentation',
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Clear the query',
            resetButtonAriaLabel: 'Clear the query',
            cancelButtonText: 'Close',
            cancelButtonAriaLabel: 'Close',
            searchInputLabel: 'Search',
          },
          startScreen: {
            recentSearchesTitle: 'Recent',
            noRecentSearchesText: 'No recent searches',
            saveRecentSearchButtonTitle: 'Save this search',
            removeRecentSearchButtonTitle: 'Remove this search from history',
            favoriteSearchesTitle: 'Favorite',
            removeFavoriteSearchButtonTitle: 'Remove this search from favorites',
          },
          errorScreen: {
            titleText: 'Unable to fetch results',
            helpText: 'You might want to check your network connection.',
          },
          footer: {
            selectText: 'to select',
            selectKeyAriaLabel: 'Enter key',
            navigateText: 'to navigate',
            navigateUpKeyAriaLabel: 'Arrow up',
            navigateDownKeyAriaLabel: 'Arrow down',
            closeText: 'to close',
            closeKeyAriaLabel: 'Escape key',
            searchByText: 'Search by',
          },
          noResultsScreen: {
            noResultsText: 'No results for',
            suggestedQueryText: 'Try searching for',
            reportMissingResultsText: 'Believe this query should return results?',
            reportMissingResultsLinkText: 'Let us know.',
          },
        },
      }}
    />
  )
}
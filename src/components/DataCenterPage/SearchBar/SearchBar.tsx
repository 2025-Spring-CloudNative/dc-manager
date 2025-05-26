import { useEffect, useState } from "react"
import styles from "./SearchBar.module.scss"

export interface SearchParams {
    query: string
    searchBy: "name" | "location" | ""
    sortBy: "name" | "location" | "" // "" means “choose”
    sortOrder: "asc" | "desc"
}

interface SearchBarProps {
    /** Called when the user presses “Search” */
    onSearch: (params: SearchParams) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("")
    const [searchBy, setSearchBy] = useState<SearchParams["searchBy"]>("name")
    const [sortBy, setSortBy] = useState<SearchParams["sortBy"]>("")
    const [sortOrder, setSortOrder] = useState<SearchParams["sortOrder"]>("asc")

    const inputDisabled = !searchBy
    const sortOrderDisabled = !sortBy

    useEffect(() => {
        const id = setTimeout(
            () => onSearch({ query, searchBy, sortBy, sortOrder }),
            250
        )
        return () => clearTimeout(id)
    }, [query, searchBy, sortBy, sortOrder])

    return (
        <form
            className={styles.bar}
            onSubmit={(e) => e.preventDefault()}
            role="search"
        >
            <input
                className={styles.input}
                type="text"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={inputDisabled}
            />

            <label className={styles.label}>
                搜尋方式
                <select
                    className={styles.select}
                    value={searchBy}
                    onChange={(e) => {
                        setSearchBy(e.target.value as SearchParams["searchBy"])
                        if (e.target.value === "") setQuery("")
                    }}
                >
                    <option value="">—</option>
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                </select>
            </label>

            <label className={styles.label}>
                排序
                <select
                    className={styles.select}
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value as SearchParams["sortBy"])
                    }
                >
                    <option value="">—</option>
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                </select>
            </label>

            <label className={styles.label}>
                排序方式
                <select
                    className={styles.select}
                    value={sortOrder}
                    onChange={(e) =>
                        setSortOrder(
                            e.target.value as SearchParams["sortOrder"]
                        )
                    }
                    disabled={sortOrderDisabled}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </label>
        </form>
    )
}

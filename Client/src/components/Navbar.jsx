import { SearchIcon, PanelLeft, FolderOpen, Square } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/themeSlice'
import { MoonIcon, SunIcon } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ setIsSidebarOpen }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector(state => state.theme);
    const { currentWorkspace } = useSelector(state => state.workspace);

    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search projects and tasks from current workspace
    const results = (() => {
        if (!query.trim() || !currentWorkspace) return [];
        const q = query.toLowerCase();

        const projects = currentWorkspace.projects
            .filter(p => p.name.toLowerCase().includes(q))
            .map(p => ({ type: 'project', label: p.name, sub: p.status, id: p.id }));

        const tasks = currentWorkspace.projects.flatMap(p =>
            p.tasks
                .filter(t => t.title.toLowerCase().includes(q))
                .map(t => ({ type: 'task', label: t.title, sub: p.name, id: t.id, projectId: p.id }))
        );

        return [...projects, ...tasks].slice(0, 8);
    })();

    const handleSelect = (item) => {
        setQuery('');
        setShowResults(false);
        if (item.type === 'project') {
            navigate(`/projectsDetail?id=${item.id}&tab=tasks`);
        } else {
            navigate(`/taskDetails?projectId=${item.projectId}&taskId=${item.id}`);
        }
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between w-full">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800">
                        <PanelLeft size={20} />
                    </button>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm" ref={searchRef}>
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                            onFocus={() => setShowResults(true)}
                            placeholder="Search projects, tasks..."
                            className="pl-8 pr-4 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />

                        {/* Results Dropdown */}
                        {showResults && query.trim() && (
                            <div className="absolute top-full mt-1 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-50 overflow-hidden">
                                {results.length === 0 ? (
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 px-4 py-3">No results found</p>
                                ) : (
                                    results.map((item, i) => (
                                        <button key={i} onClick={() => handleSelect(item)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-left">
                                            {item.type === 'project'
                                                ? <FolderOpen className="size-4 text-blue-500 shrink-0" />
                                                : <Square className="size-4 text-green-500 shrink-0" />
                                            }
                                            <div className="min-w-0">
                                                <p className="text-sm text-zinc-800 dark:text-zinc-200 truncate">{item.label}</p>
                                                <p className="text-xs text-zinc-400 truncate">{item.type === 'project' ? item.sub : `in ${item.sub}`}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button onClick={() => dispatch(toggleTheme())} className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95">
                        {theme === "light"
                            ? (<MoonIcon className="size-4 text-gray-800 dark:text-gray-200" />)
                            : (<SunIcon className="size-4 text-yellow-400" />)
                        }
                    </button>

                    {/* User Button */}
                    <UserButton />
                </div>
            </div>
        </div>
    )
}

export default Navbar

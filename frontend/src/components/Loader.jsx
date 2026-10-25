
function Loader({ message = "Loading videos..." }) {
    return (
        <div
            className="flex min-h-48 flex-col items-center justify-center gap-4"
            role="status"
            aria-live="polite"
        >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-red-600" />

            <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
            </p>
        </div>
    );
}

export default Loader;

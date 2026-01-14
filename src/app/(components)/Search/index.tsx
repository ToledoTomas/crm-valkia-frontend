import { useEffect, useState, useRef } from "react";

const Search = ({ onSearch }: { onSearch: (name: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div>
      <form
        action="#"
        className="flex w-full md:w-auto md:mr-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full md:w-64 rounded-md p-2 border border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Search;

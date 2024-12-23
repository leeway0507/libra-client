import useSWR from "swr";

const fetcher = (path:string) => fetch(new URL(path,import.meta.env.VITE_BACKEND_API)).then((res) => res.json());

export default function App() {
  const { data, error, isLoading } = useSWR(
    "/scrap/yangcheon/8970126740",
    fetcher
  );

  if (error) return <div>{JSON.stringify(error)}</div>
  if (isLoading) return "Loading...";
  return (
    <div>
      <strong>👁 {JSON.stringify(data)}</strong>{" "}
      <strong>👁 {JSON.stringify(data)}</strong>{" "}
    </div>
  );
}
